# AI Prompt Strategy

## Model

Default model: `gpt-image-2`.

The model name, quality, size, and output count are environment-configured:

- `IMAGE_MODEL`
- `IMAGE_MODEL_SNAPSHOT`
- `IMAGE_QUALITY`
- `IMAGE_SIZE`
- `IMAGE_OUTPUT_COUNT`

## Prompt Contract

The prompt must:

- add or replace only eyewear
- preserve identity, face shape, expression, skin tone, hair, clothing, pose, background, lighting direction, shadows, camera angle, focal length, image grain, and composition
- fit glasses naturally to bridge and ears
- include lens transparency, reflections, contact shadows, and perspective
- return one finished realistic preview

## Cost Control

The product generates one image per request. Quality and size are configurable so production can tune budget versus realism without changing UI code.
