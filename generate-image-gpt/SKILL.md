---
name: generate-image-gpt
description: Generate or edit images using OpenAI GPT Image API (GPT-Image-2.5 Flare / Sunburst)
---

Generate or edit images using the OpenAI Images API.

Images are saved as `~/Imagen/<YYYY-MM>/<timestamp>-gpt.png`, one folder per month.

## Options

| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| `--model` | flare, sunburst | flare | Which GPT-Image-2.5 model to use |
| `--size` | square, landscape, portrait, auto | auto | Image dimensions |
| `--quality` | low, medium, high, auto | auto | Rendering quality |
| `--ref` | path | - | Reference image(s) for editing (can be repeated) |
| `--transparent` | flag | off | Real alpha background. REQUIRED for stickers, logos, mascots: asking for "transparent background" in the prompt only gets a painted checkerboard |

### Models

- **flare** (`gpt-image-2.5-flare`): the default. Fast, good quality, fine for anything
  from social content to high-volume generation.
- **sunburst** (`gpt-image-2.5-sunburst`): premium workflows needing tighter control
  across edits (campaign creative, polished product imagery). Same price, slower.

### Sizes

- **square**: 1024x1024
- **landscape**: 1536x1024
- **portrait**: 1024x1536
- **auto**: the model picks the best fit

## Instructions

1. Parse the user's request to determine:
   - The image prompt/description
   - Desired size (look for "paysage/landscape", "portrait", "carré/square")
   - Desired quality (look for "haute qualité", "high quality", "draft", "quick")
   - Whether the job needs sunburst (polished/final visuals, careful edits of a reference)
   - Reference images for editing (if user provides image paths or wants to modify existing images)

2. Run the generation script:
   ```bash
   node ~/.claude/skills/generate-image-gpt/generate-image-gpt.mjs [options] "<prompt>"
   ```

   Examples:
   ```bash
   # Simple generation
   node ~/.claude/skills/generate-image-gpt/generate-image-gpt.mjs "A cat playing piano"

   # Landscape, high quality
   node ~/.claude/skills/generate-image-gpt/generate-image-gpt.mjs --size=landscape --quality=high "Mountain landscape"

   # Premium model for a careful edit
   node ~/.claude/skills/generate-image-gpt/generate-image-gpt.mjs --model=sunburst --ref=/path/to/product.jpg "Put it on a marble surface, studio lighting"

   # Edit a single reference image
   node ~/.claude/skills/generate-image-gpt/generate-image-gpt.mjs --ref=/path/to/photo.jpg "Make them smile"

   # Combine multiple images
   node ~/.claude/skills/generate-image-gpt/generate-image-gpt.mjs --ref=/path/to/img1.jpg --ref=/path/to/img2.jpg "Create a group photo of these people"
   ```

3. After generation, inform the user of the result and display the image.

## Requirements

- `OPENAI_API_KEY` environment variable must be set
- Node.js 18+ must be installed (uses native fetch, no dependencies)
