---
name: generate-image
description: Generate or edit images using Google Gemini API (Nano Banana)
---

Generate or edit images using the Nano Banana (Google Gemini) API.

## Models

- **Nano Banana** (default): gemini-2.5-flash-image - Fast generation
- **Nano Banana Pro**: gemini-3-pro-image-preview - Higher quality

## Options

| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| `--pro` | - | off | Use Nano Banana Pro model |
| `--size` | 1K, 2K, 4K | 1K | Image resolution |
| `--ratio` | 16:9, 9:16, 4:3, 3:4, 5:4, 4:5, 1:1 | auto | Aspect ratio |
| `--ref` | path | - | Reference image(s) for editing (can be repeated) |

### Aspect Ratios

- **Landscape**: 16:9, 4:3, 5:4
- **Portrait**: 9:16, 3:4, 4:5
- **Square**: 1:1

## Instructions

1. Parse the user's request to determine:
   - The image prompt/description
   - Whether they want Pro quality (look for "pro", "high quality", "meilleure qualité")
   - Desired resolution (look for "1K", "2K", "4K", "haute résolution", "high res")
   - Desired aspect ratio (look for "paysage/landscape", "portrait", "carré/square", "16:9", etc.)
   - Reference images for editing (if user provides image paths or wants to modify existing images)

2. Run the generation script:
   ```bash
   node ~/.claude/skills/generate-image/generate-image.mjs [options] "<prompt>"
   ```

   Examples:
   ```bash
   # Simple generation (1K, auto ratio)
   node ~/.claude/skills/generate-image/generate-image.mjs "A cat playing piano"

   # Landscape 2K
   node ~/.claude/skills/generate-image/generate-image.mjs --size=2K --ratio=16:9 "Mountain landscape"

   # Portrait 4K with Pro
   node ~/.claude/skills/generate-image/generate-image.mjs --pro --size=4K --ratio=9:16 "Fashion portrait"

   # Edit a single reference image
   node ~/.claude/skills/generate-image/generate-image.mjs --ref=/path/to/photo.jpg "Make them smile"

   # Combine multiple images
   node ~/.claude/skills/generate-image/generate-image.mjs --pro --ref=/path/to/img1.jpg --ref=/path/to/img2.jpg "Create a group photo of these people"
   ```

3. After generation, inform the user of the result and display the image.

## Requirements

- `GOOGLE_API_KEY` or `GEMINI_API_KEY` environment variable must be set
- Node.js must be installed
