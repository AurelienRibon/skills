import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

const OUTPUT_DIR = path.join(os.homedir(), "Downloads", "Banana");
const VALID_SIZES = ["1K", "2K", "4K"];
const VALID_RATIOS = ["16:9", "9:16", "4:3", "3:4", "5:4", "4:5", "1:1"];

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

function parseArgs(args) {
  const options = {
    pro: false,
    size: "1K",
    ratio: null,
    prompt: [],
    refImages: [],
  };

  for (const arg of args) {
    if (arg === "--pro") {
      options.pro = true;
    } else if (arg.startsWith("--size=")) {
      const size = arg.slice(7).toUpperCase();
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

function printUsage() {
  console.error(`Usage: node generate-image.mjs [options] <prompt>

Options:
  --pro           Use Nano Banana Pro (gemini-3-pro-image-preview)
                  Default: Nano Banana (gemini-2.5-flash-image)
  --size=SIZE     Image resolution: 1K, 2K, 4K (default: 1K) [Pro only]
  --ratio=RATIO   Aspect ratio: 16:9, 9:16, 4:3, 3:4, 5:4, 4:5, 1:1 [Pro only]
  --ref=PATH      Reference image for editing (can be used multiple times)

Note: --size and --ratio options only work with --pro model.

Examples:
  node generate-image.mjs "A cat playing piano"
  node generate-image.mjs --pro --size=2K --ratio=16:9 "A mountain landscape"
  node generate-image.mjs --ref=photo.jpg "Make them smile"
  node generate-image.mjs --pro --ref=img1.jpg --ref=img2.jpg "Combine these into a collage"`);
}

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

  // Warn if size/ratio used without --pro
  if (!options.pro && (options.size !== "1K" || options.ratio)) {
    console.warn(
      "Warning: --size and --ratio options only work with --pro model. Ignoring.",
    );
  }

  const model = options.pro
    ? "gemini-3-pro-image-preview"
    : "gemini-2.5-flash-image";
  const modelLabel = options.pro ? "Nano Banana Pro" : "Nano Banana";

  const ai = new GoogleGenAI({ apiKey });

  console.log(`Model: ${modelLabel} (${model})`);
  if (options.pro) {
    console.log(
      `Size: ${options.size}${options.ratio ? `, Ratio: ${options.ratio}` : ""}`,
    );
  }
  if (options.refImages.length > 0) {
    console.log(`Reference images: ${options.refImages.length}`);
  }
  console.log(`Prompt: "${options.prompt}"`);

  // Build config - imageConfig only for Pro model
  const config = {
    responseModalities: ["TEXT", "IMAGE"],
  };

  if (options.pro) {
    config.imageConfig = {
      imageSize: options.size,
    };
    if (options.ratio) {
      config.imageConfig.aspectRatio = options.ratio;
    }
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
    response = await ai.models.generateContent({ model, contents, config });
  } finally {
    clearTimeout(timeout);
  }

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Generate a filename based on timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const suffix = options.pro ? "-pro" : "";
  const filename = path.join(OUTPUT_DIR, `generated${suffix}-${timestamp}.png`);

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

main().catch((err) => {
  console.error("Error generating image:", err.message);
  process.exit(1);
});
