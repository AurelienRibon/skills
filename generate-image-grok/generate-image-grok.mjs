import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

const API_BASE = "https://api.x.ai/v1";
const OUTPUT_DIR = path.join(os.homedir(), "Imagen");
const MAX_REF_IMAGES = 3;
const MODELS = {
  "2.0": "grok-imagine-image-2.0",
  quality: "grok-imagine-image-quality",
  fast: "grok-imagine-image",
};
const VALID_QUALITIES = ["low", "medium"];
const VALID_RESOLUTIONS = ["1k", "2k"];
const VALID_RATIOS = [
  "1:1", "3:4", "4:3", "9:16", "16:9", "2:3", "3:2",
  "9:19.5", "19.5:9", "9:20", "20:9", "1:2", "2:1", "auto",
];

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!options.prompt) {
    printUsage();
    process.exit(1);
  }

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    console.error("Error: XAI_API_KEY environment variable is required");
    process.exit(1);
  }

  console.log(`Model: Grok Imagine (${MODELS[options.model]})`);
  console.log(`Ratio: ${options.ratio}, Resolution: ${options.resolution}, Quality: ${options.quality}`);
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

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const monthDir = path.join(OUTPUT_DIR, timestamp.slice(0, 7));
  fs.mkdirSync(monthDir, { recursive: true });
  const filename = path.join(monthDir, `${timestamp}-grok.png`);
  fs.writeFileSync(filename, Buffer.from(b64, "base64"));
  console.log(`Image saved as ${filename}`);
}

// ------------------------------------------------------------------------------
// MARK: API CALLS
// ------------------------------------------------------------------------------

function generateImage(apiKey, options, signal) {
  return post(apiKey, "/images/generations", buildPayload(options), signal);
}

// Edits are JSON, not multipart: the xAI endpoint rejects form-data, so local
// files travel as base64 data URIs. With several sources the prompt must name
// them <IMAGE_0>, <IMAGE_1>… so the model knows which is which.
function editImage(apiKey, options, signal) {
  const images = options.refImages.map((p) => ({ url: toDataUri(p) }));
  const payload = buildPayload(options);
  if (images.length === 1) {
    payload.image = images[0];
  } else {
    payload.images = images;
  }
  return post(apiKey, "/images/edits", payload, signal);
}

function post(apiKey, endpoint, payload, signal) {
  return fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    signal,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// ------------------------------------------------------------------------------
// MARK: HELPERS
// ------------------------------------------------------------------------------

function buildPayload(options) {
  const payload = {
    model: MODELS[options.model],
    prompt: options.prompt,
    aspect_ratio: options.ratio,
    resolution: options.resolution,
    response_format: "b64_json",
  };
  // The quality knob only exists on 2.0; the other models reject it.
  if (options.model === "2.0") payload.quality = options.quality;
  return payload;
}

function parseArgs(args) {
  const options = {
    model: "2.0",
    ratio: "auto",
    resolution: "1k",
    quality: "medium",
    prompt: [],
    refImages: [],
  };

  for (const arg of args) {
    if (arg.startsWith("--model=")) {
      options.model = pick(arg.slice(8).toLowerCase(), Object.keys(MODELS), "model");
    } else if (arg.startsWith("--ratio=")) {
      options.ratio = pick(arg.slice(8).toLowerCase(), VALID_RATIOS, "ratio");
    } else if (arg.startsWith("--size=")) {
      options.resolution = pick(arg.slice(7).toLowerCase(), VALID_RESOLUTIONS, "size");
    } else if (arg.startsWith("--quality=")) {
      options.quality = pick(arg.slice(10).toLowerCase(), VALID_QUALITIES, "quality");
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

  if (options.refImages.length > MAX_REF_IMAGES) {
    console.error(`Too many reference images: ${options.refImages.length} (max ${MAX_REF_IMAGES})`);
    process.exit(1);
  }

  options.prompt = options.prompt.join(" ");
  return options;
}

function pick(value, allowed, label) {
  if (!allowed.includes(value)) {
    console.error(`Invalid ${label}: ${value}. Valid: ${allowed.join(", ")}`);
    process.exit(1);
  }
  return value;
}

function toDataUri(filePath) {
  const buffer = fs.readFileSync(filePath);
  return `data:${getMimeType(filePath)};base64,${buffer.toString("base64")}`;
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
  console.error(`Usage: node generate-image-grok.mjs [options] <prompt>

Options:
  --model=MODEL      2.0 (default), quality, fast
  --ratio=RATIO      ${VALID_RATIOS.join(", ")} (default: auto)
  --size=RESOLUTION  1k, 2k (default: 1k)
  --quality=QUALITY  low, medium (default: medium, only for --model=2.0)
  --ref=PATH         Reference image for editing (up to ${MAX_REF_IMAGES} times)

Examples:
  node generate-image-grok.mjs "A cat playing piano"
  node generate-image-grok.mjs --ratio=16:9 --size=2k "A mountain landscape"
  node generate-image-grok.mjs --ref=photo.jpg "Make them smile"
  node generate-image-grok.mjs --ref=a.jpg --ref=b.jpg "Put the hat from <IMAGE_1> on the person in <IMAGE_0>"`);
}

main().catch((err) => {
  console.error("Error generating image:", err.message);
  process.exit(1);
});
