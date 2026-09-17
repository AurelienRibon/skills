import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

const API_BASE = "https://api.openai.com/v1";
const OUTPUT_DIR = path.join(os.homedir(), "Imagen");
const VALID_QUALITIES = ["low", "medium", "high", "auto"];
const MODELS = {
  flare: "gpt-image-2.5-flare",
  sunburst: "gpt-image-2.5-sunburst",
};
const SIZES = {
  square: "1024x1024",
  landscape: "1536x1024",
  portrait: "1024x1536",
  auto: "auto",
};

async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (!options.prompt) {
    printUsage();
    process.exit(1);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Error: OPENAI_API_KEY environment variable is required");
    process.exit(1);
  }

  console.log(`Model: GPT Image (${MODELS[options.model]})`);
  console.log(`Size: ${options.size}, Quality: ${options.quality}`);
  if (options.refImages.length > 0) {
    console.log(`Reference images: ${options.refImages.length}`);
  }
  console.log(`Prompt: "${options.prompt}"`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 180000);

  let response;
  try {
    response =
      options.refImages.length > 0
        ? await editImage(apiKey, options, controller.signal)
        : await generateImage(apiKey, options, controller.signal);
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const body = await response.text();
    console.error(`API error (${response.status}): ${body}`);
    process.exit(1);
  }

  const result = await response.json();
  const b64 = result.data?.[0]?.b64_json;
  if (!b64) {
    console.error("No image data in response:", JSON.stringify(result));
    process.exit(1);
  }

  // Milliseconds included: parallel runs in the same second must not overwrite each other.
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 23);
  const monthDir = path.join(OUTPUT_DIR, timestamp.slice(0, 7));
  fs.mkdirSync(monthDir, { recursive: true });
  const filename = path.join(monthDir, `${timestamp}-gpt.png`);
  fs.writeFileSync(filename, Buffer.from(b64, "base64"));
  console.log(`Image saved as ${filename}`);
}

// ------------------------------------------------------------------------------
// MARK: API CALLS
// ------------------------------------------------------------------------------

function generateImage(apiKey, options, signal) {
  return fetch(`${API_BASE}/images/generations`, {
    method: "POST",
    signal,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODELS[options.model],
      prompt: options.prompt,
      size: SIZES[options.size],
      quality: options.quality,
      ...(options.transparent ? { background: "transparent" } : {}),
    }),
  });
}

function editImage(apiKey, options, signal) {
  const form = new FormData();
  form.append("model", MODELS[options.model]);
  form.append("prompt", options.prompt);
  form.append("size", SIZES[options.size]);
  form.append("quality", options.quality);
  if (options.transparent) form.append("background", "transparent");
  for (const imagePath of options.refImages) {
    const buffer = fs.readFileSync(imagePath);
    const blob = new Blob([buffer], { type: getMimeType(imagePath) });
    form.append("image[]", blob, path.basename(imagePath));
  }

  return fetch(`${API_BASE}/images/edits`, {
    method: "POST",
    signal,
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
}

// ------------------------------------------------------------------------------
// MARK: HELPERS
// ------------------------------------------------------------------------------

function parseArgs(args) {
  const options = {
    model: "flare",
    size: "auto",
    quality: "auto",
    prompt: [],
    refImages: [],
    transparent: false,
  };

  for (const arg of args) {
    if (arg.startsWith("--model=")) {
      const model = arg.slice(8).toLowerCase();
      if (MODELS[model]) {
        options.model = model;
      } else {
        console.error(
          `Invalid model: ${model}. Valid: ${Object.keys(MODELS).join(", ")}`,
        );
        process.exit(1);
      }
    } else if (arg.startsWith("--size=")) {
      const size = arg.slice(7).toLowerCase();
      if (SIZES[size]) {
        options.size = size;
      } else {
        console.error(
          `Invalid size: ${size}. Valid: ${Object.keys(SIZES).join(", ")}`,
        );
        process.exit(1);
      }
    } else if (arg.startsWith("--quality=")) {
      const quality = arg.slice(10).toLowerCase();
      if (VALID_QUALITIES.includes(quality)) {
        options.quality = quality;
      } else {
        console.error(
          `Invalid quality: ${quality}. Valid: ${VALID_QUALITIES.join(", ")}`,
        );
        process.exit(1);
      }
    } else if (arg === "--transparent") {
      options.transparent = true;
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
    ".webp": "image/webp",
  };
  return mimeTypes[ext] || "image/jpeg";
}

function printUsage() {
  console.error(`Usage: node generate-image-gpt.mjs [options] <prompt>

Options:
  --model=MODEL      flare (fast, default), sunburst (premium, tighter edit control)
  --size=SIZE        square (1024x1024), landscape (1536x1024), portrait (1024x1536), auto (default: auto)
  --quality=QUALITY  low, medium, high, auto (default: auto)
  --transparent      real alpha background (PNG); without it the model paints a fake checkerboard
  --ref=PATH         Reference image for editing (can be used multiple times)

Examples:
  node generate-image-gpt.mjs "A cat playing piano"
  node generate-image-gpt.mjs --size=landscape --quality=high "A mountain landscape"
  node generate-image-gpt.mjs --ref=photo.jpg "Make them smile"
  node generate-image-gpt.mjs --model=sunburst --ref=photo.jpg "Retouch for a campaign poster"
  node generate-image-gpt.mjs --ref=img1.jpg --ref=img2.jpg "Combine these into a collage"`);
}

main().catch((err) => {
  console.error("Error generating image:", err.message);
  process.exit(1);
});
