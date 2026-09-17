---
name: generate-image-grok
description: Generate or edit images using xAI Grok Imagine API (grok-imagine-image-2.0)
---

Generate or edit images using the Grok Imagine (xAI) API.

Model: `grok-imagine-image-2.0`. Images are saved as `~/Imagen/<YYYY-MM>/<timestamp>-grok.png`, one folder per month.

## Options

| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| `--model` | 2.0, quality, fast | 2.0 | Model tier (see below) |
| `--ratio` | 1:1, 3:4, 4:3, 9:16, 16:9, 2:3, 3:2, 1:2, 2:1, 9:19.5, 19.5:9, 9:20, 20:9, auto | auto | Aspect ratio |
| `--size` | 1k, 2k | 1k | Output resolution |
| `--quality` | low, medium | medium | Rendering effort (2.0 only) |
| `--ref` | path | - | Reference image(s) for editing (max 3) |

### Models

- **2.0** — `grok-imagine-image-2.0`, $0.04/image. Plans typography and layout before painting: the one to use for posters, infographics, UI mockups, anything with readable text.
- **quality** — `grok-imagine-image-quality`, $0.05/image. Previous flagship, the one xAI's editing docs are written against.
- **fast** — `grok-imagine-image`, $0.02/image. Cheap drafts.

### Aspect Ratios

- **Landscape**: 16:9, 4:3, 3:2, 2:1, 19.5:9, 20:9
- **Portrait**: 9:16, 3:4, 2:3, 1:2, 9:19.5, 9:20
- **Square**: 1:1

## Instructions

1. Parse the user's request to determine:
   - The image prompt/description
   - Desired aspect ratio (look for "paysage/landscape", "portrait", "carré/square", "16:9", etc.)
   - Desired resolution (look for "2K", "haute résolution", "high res")
   - Reference images for editing (if user provides image paths or wants to modify existing images)

2. Run the generation script:
   ```bash
   node ~/.claude/skills/generate-image-grok/generate-image-grok.mjs [options] "<prompt>"
   ```

   Examples:
   ```bash
   # Simple generation (1K, auto ratio)
   node ~/.claude/skills/generate-image-grok/generate-image-grok.mjs "A cat playing piano"

   # Landscape 2K
   node ~/.claude/skills/generate-image-grok/generate-image-grok.mjs --ratio=16:9 --size=2k "Mountain landscape"

   # Cheap draft
   node ~/.claude/skills/generate-image-grok/generate-image-grok.mjs --model=fast --quality=low "Rough concept sketch of a spaceship"

   # Edit a single reference image
   node ~/.claude/skills/generate-image-grok/generate-image-grok.mjs --ref=/path/to/photo.jpg "Make them smile"

   # Combine multiple images (up to 3)
   node ~/.claude/skills/generate-image-grok/generate-image-grok.mjs --ref=/path/to/img1.jpg --ref=/path/to/img2.jpg "Put the jacket from <IMAGE_1> on the person in <IMAGE_0>"
   ```

3. After generation, inform the user of the result and display the image.

## Multi-image editing

With 2+ `--ref`, the prompt must address the sources as `<IMAGE_0>`, `<IMAGE_1>`, `<IMAGE_2>`, in the
order the flags were passed. Without those markers the model guesses which image plays which role.

## Requirements

- `XAI_API_KEY` environment variable must be set (console.x.ai)
- Node.js 18+ must be installed (uses native fetch, no dependencies)
