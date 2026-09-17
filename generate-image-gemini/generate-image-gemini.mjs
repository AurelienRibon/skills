import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

const MODEL = "gemini-3.1-flash-image-preview";
const OUTPUT_DIR = path.join(os.homedir(), "Imagen");
const VALID_SIZES = ["512px", "1K", "2K", "4K"];
const VALID_RATIOS = [
  "1:1", "1:4", "1:8", "2:3", "3:2", "3:4",
  "4:1", "4:3", "4:5", "5:4", "8:1", "9:16", "16:9", "21:9",
];

async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (!options.prompt) {
    printUsage();
    process.exit(1);
  }

  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(
      "Error: GOOGLE_API_KEY or GEMINI_API_KEY environment variable is required",
    );
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  console.log(`Model: Gemini (${MODEL})`);
  console.log(
    `Size: ${options.size}${options.ratio ? `, Ratio: ${options.ratio}` : ""}`,
  );
  if (options.refImages.length > 0) {
    console.log(`Reference images: ${options.refImages.length}`);
  }
  console.log(`Prompt: "${options.prompt}"`);

  const config = {
    responseModalities: ["TEXT", "IMAGE"],
    imageConfig: {
      imageSize: options.size,
    },
  };

  if (options.ratio) {
    config.imageConfig.aspectRatio = options.ratio;
  }

  // Build contents - simple string for text-only, array with images for editing
  let contents;
  if (options.refImages.length > 0) {
    contents = [{ text: options.prompt }];
    for (const imagePath of options.refImages) {
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Data = imageBuffer.toString("base64");
      contents.push({
        inlineData: {
          mimeType: getMimeType(imagePath),
          data: base64Data,
        },
      });
    }
  } else {
    contents = options.prompt;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  config.abortSignal = controller.signal;

  let response;
  try {
    response = await ai.models.generateContent({ model: MODEL, contents, config });
  } finally {
    clearTimeout(timeout);
  }

  // One folder per month, named after the timestamp it will hold
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const monthDir = path.join(OUTPUT_DIR, timestamp.slice(0, 7));
  fs.mkdirSync(monthDir, { recursive: true });
  const filename = path.join(monthDir, `${timestamp}-gemini.png`);

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log("Model response:", part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync(filename, buffer);
      console.log(`Image saved as ${filename}`);
    }
  }
}

// ------------------------------------------------------------------------------
// MARK: HELPERS
// ------------------------------------------------------------------------------

function parseArgs(args) {
  const options = {
    size: "1K",
    ratio: null,
    prompt: [],
    refImages: [],
  };

  for (const arg of args) {
    if (arg.startsWith("--size=")) {
      const raw = arg.slice(7);
      const size = raw.toLowerCase() === "512px" ? "512px" : raw.toUpperCase();
      if (VALID_SIZES.includes(size)) {
        options.size = size;
      } else {
        console.error(
          `Invalid size: ${size}. Valid: ${VALID_SIZES.join(", ")}`,
        );
        process.exit(1);
      }
    } else if (arg.startsWith("--ratio=")) {
      const ratio = arg.slice(8);
      if (VALID_RATIOS.includes(ratio)) {
        options.ratio = ratio;
      } else {
        console.error(
          `Invalid ratio: ${ratio}. Valid: ${VALID_RATIOS.join(", ")}`,
        );
        process.exit(1);
      }
    } else if (arg.startsWith("--ref=")) {
      const imagePath = arg.slice(6);
      if (!fs.existsSync(imagePath)) {
        console.error(`Reference image not found: ${imagePath}`);
        process.exit(1);
      }
      options.refImages.push(imagePath);
    } else {
      options.prompt.push(arg);
    }
  }

  options.prompt = options.prompt.join(" ");
  return options;
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return mimeTypes[ext] || "image/jpeg";
}

function printUsage() {
  console.error(`Usage: node generate-image-gemini.mjs [options] <prompt>

Options:
  --size=SIZE     Image resolution: 512px, 1K, 2K, 4K (default: 1K)
  --ratio=RATIO   Aspect ratio: 1:1, 1:4, 1:8, 2:3, 3:2, 3:4, 4:1, 4:3, 4:5, 5:4, 8:1, 9:16, 16:9, 21:9
  --ref=PATH      Reference image for editing (can be used multiple times)

Examples:
  node generate-image-gemini.mjs "A cat playing piano"
  node generate-image-gemini.mjs --size=2K --ratio=16:9 "A mountain landscape"
  node generate-image-gemini.mjs --ref=photo.jpg "Make them smile"
  node generate-image-gemini.mjs --ref=img1.jpg --ref=img2.jpg "Combine these into a collage"`);
}

main().catch((err) => {
  console.error("Error generating image:", err.message);
  process.exit(1);
});
