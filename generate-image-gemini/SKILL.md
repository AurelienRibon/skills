---
name: generate-image-gemini
description: Generate or edit images using Google Gemini API (Nano Banana 2)
---

Generate or edit images using the Google Gemini API (model codename: Nano Banana 2).

Model: `gemini-3.1-flash-image-preview`. Images are saved as `~/Imagen/<YYYY-MM>/<timestamp>-gemini.png`, one folder per month.

## Options

| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| `--size` | 512px, 1K, 2K, 4K | 1K | Image resolution |
| `--ratio` | 1:1, 1:4, 1:8, 2:3, 3:2, 3:4, 4:1, 4:3, 4:5, 5:4, 8:1, 9:16, 16:9, 21:9 | auto | Aspect ratio |
| `--ref` | path | - | Reference image(s) for editing (can be repeated) |

### Aspect Ratios

- **Landscape**: 16:9, 21:9, 4:3, 3:2, 5:4, 4:1, 8:1
- **Portrait**: 9:16, 3:4, 2:3, 4:5, 1:4, 1:8
- **Square**: 1:1

## Instructions

1. Parse the user's request to determine:
   - The image prompt/description
   - Desired resolution (look for "1K", "2K", "4K", "haute résolution", "high res")
   - Desired aspect ratio (look for "paysage/landscape", "portrait", "carré/square", "16:9", etc.)
   - Reference images for editing (if user provides image paths or wants to modify existing images)

2. Run the generation script:
   ```bash
   node ~/.claude/skills/generate-image-gemini/generate-image-gemini.mjs [options] "<prompt>"
   ```

   Examples:
   ```bash
   # Simple generation (1K, auto ratio)
   node ~/.claude/skills/generate-image-gemini/generate-image-gemini.mjs "A cat playing piano"

   # Landscape 2K
   node ~/.claude/skills/generate-image-gemini/generate-image-gemini.mjs --size=2K --ratio=16:9 "Mountain landscape"

   # Ultra-wide cinematic
   node ~/.claude/skills/generate-image-gemini/generate-image-gemini.mjs --size=4K --ratio=21:9 "Cinematic sci-fi landscape"

   # Edit a single reference image
   node ~/.claude/skills/generate-image-gemini/generate-image-gemini.mjs --ref=/path/to/photo.jpg "Make them smile"

   # Combine multiple images
   node ~/.claude/skills/generate-image-gemini/generate-image-gemini.mjs --ref=/path/to/img1.jpg --ref=/path/to/img2.jpg "Create a group photo of these people"
   ```

3. After generation, inform the user of the result and display the image.

## Requirements

- `GOOGLE_API_KEY` or `GEMINI_API_KEY` environment variable must be set
- Node.js must be installed
