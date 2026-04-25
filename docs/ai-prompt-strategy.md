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

- add or replace only eyewear unless the user explicitly selects background blur or replacement
- preserve identity, face shape, expression, skin tone, hair, clothing, pose, background, lighting direction, shadows, camera angle, focal length, image grain, and composition
- fit glasses naturally to bridge and ears
- include lens transparency, reflections, contact shadows, and perspective
- return one finished realistic preview for a single frame
- return one single 1536x1024 landscape contact sheet when the user selects multiple frames
- keep every contact-sheet tile at the same crop, face scale, lighting, and pose so the result can be visually compared

## Cost Control

The product generates one image per request. Quality and size are configurable so production can tune budget versus realism without changing UI code.

Multi-frame mode is intentionally still one image request. Up to eight frames are described in one detailed prompt. Three-POV mode is limited to three frames because the model has to compose front, slight-left, and slight-right views inside one landscape image.

## Frame References

Users can upload a frame reference image. The server sends the face photo first and the frame reference second to the image edit endpoint, so the model prioritizes preserving the person while using the second image for eyewear shape, color, and material.

The catalog scraper stores retailer image URLs and metadata from public Shopify product JSON. During generation, the server fetches selected catalog frame images and sends them as additional image inputs after the face photo, up to eight references per request.

For long-term production, replace the seed source with an affiliate or partner feed so prices, availability, and image rights remain clean.
