import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("generateTryOnImage", () => {
  it("retries transient OpenAI image edit failures", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    process.env.IMAGE_MODEL = "gpt-image-2";
    process.env.IMAGE_OUTPUT_COUNT = "1";
    process.env.IMAGE_SIZE = "1536x1024";
    process.env.IMAGE_QUALITY = "medium";

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: {
              message: "The server had an error while processing your request.",
              type: "server_error",
            },
          }),
          {
            status: 500,
            headers: { "x-request-id": "req_test_retry" },
          },
        ),
      )
      .mockResolvedValueOnce(
        Response.json({
          data: [{ b64_json: Buffer.from("image-bytes").toString("base64") }],
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const { generateTryOnImage } = await import("./provider");
    const result = await generateTryOnImage({
      image: new File(["source"], "source.jpg", { type: "image/jpeg" }),
      prompt: "Add glasses",
    });

    expect(result.source).toBe("openai");
    expect(result.bytes.toString()).toBe("image-bytes");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("uses a browser-provided API key and appends frame references", async () => {
    process.env.OPENAI_API_KEY = "";
    process.env.IMAGE_MODEL = "gpt-image-2";

    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        data: [{ b64_json: Buffer.from("image-bytes").toString("base64") }],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { generateTryOnImage } = await import("./provider");
    await generateTryOnImage({
      image: new File(["source"], "source.jpg", { type: "image/jpeg" }),
      frameImage: new File(["frame"], "frame.jpg", { type: "image/jpeg" }),
      referenceImages: [
        new File(["catalog"], "catalog.jpg", { type: "image/jpeg" }),
      ],
      prompt: "Add glasses",
      apiKey: "sk-user-key",
    });

    const request = fetchMock.mock.calls[0][1];
    expect(request.headers.Authorization).toBe("Bearer sk-user-key");
    expect(request.body.getAll("image")).toHaveLength(3);
  });

  it("returns a user-safe error after repeated upstream failures", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    process.env.IMAGE_MODEL = "gpt-image-2";

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: { message: "internal details" } }), {
          status: 500,
          headers: { "x-request-id": "req_final_failure" },
        }),
      ),
    );

    const { generateTryOnImage } = await import("./provider");

    await expect(
      generateTryOnImage({
        image: new File(["source"], "source.jpg", { type: "image/jpeg" }),
        prompt: "Add glasses",
      }),
    ).rejects.toThrow(
      "OpenAI image service had a temporary error. Please try again.",
    );
  });
});
