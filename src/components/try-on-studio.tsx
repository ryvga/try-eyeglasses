"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  CameraIcon,
  CheckIcon,
  ImageIcon,
  LoaderCircleIcon,
  SparklesIcon,
  UploadIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { GLASSES_STYLES } from "@/lib/glasses/catalog";
import { cn } from "@/lib/utils";

type GenerationResult = {
  id: string;
  imageUrl: string;
  styleName: string;
  model: string;
  source: "openai" | "demo";
};

export function TryOnStudio() {
  const [selectedStyleId, setSelectedStyleId] = useState(GLASSES_STYLES[0].id);
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [userStyleDescription, setUserStyleDescription] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPending, startTransition] = useTransition();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isPending) {
      return;
    }

    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(value + 12, 92));
    }, 450);

    return () => window.clearInterval(timer);
  }, [isPending]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 960 },
      });
      streamRef.current = stream;
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      toast.error("Camera permission was not granted.");
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 960;
    const context = canvas.getContext("2d");
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "camera-capture.jpg", {
        type: "image/jpeg",
      });
      setPhotoFile(file);
      toast.success("Camera photo captured.");
    }, "image/jpeg");
  }

  function setPhotoFile(file: File) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPhoto(file);
    setResult(null);
    setPaywall(false);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function generate() {
    if (!photo) {
      toast.error("Upload or capture a face photo first.");
      return;
    }

    setProgress(8);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("image", photo);
      formData.set("styleId", selectedStyleId);
      formData.set("userStyleDescription", userStyleDescription);

      const response = await fetch("/api/generations", {
        method: "POST",
        body: formData,
      });

      if (response.status === 402) {
        setPaywall(true);
        toast.info("Create an account or buy credits for more try-ons.");
        return;
      }

      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload.message ?? "Generation failed.");
        return;
      }

      setProgress(100);
      setResult(payload);
      toast.success(
        payload.source === "demo"
          ? "Demo result created. Add OpenAI/R2 secrets for real generation."
          : "Your try-on is ready.",
      );
    });
  }

  return (
    <section
      className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-[1480px] flex-col gap-5 px-4 pb-10 pt-4 md:px-6"
      aria-label="AI glasses try-on studio"
    >
      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_0.92fr_1.1fr]">
        <Card className="rounded-md border-stone-600 bg-stone-50 shadow-none">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="font-mono text-[13px] uppercase tracking-[0.78px]">
                  01 Face Photo
                </CardTitle>
                <CardDescription>
                  Upload or capture a clear, front-facing photo. The background stays intact.
                </CardDescription>
              </div>
              <Badge variant="outline">Private source</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-stone-300 bg-[#fffdf8]">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="size-full object-cover"
                />
              ) : previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Uploaded face preview"
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-3 p-8 text-center text-stone-500">
                  <ImageIcon className="size-10" aria-hidden />
                  <p className="max-w-sm text-sm">
                    Use a well-lit photo where your eyes and nose bridge are visible.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label
                htmlFor="face-photo"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "paper-button cursor-pointer",
                )}
              >
                <UploadIcon data-icon="inline-start" />
                Upload
              </label>
              <Input
                id="face-photo"
                className="sr-only"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setPhotoFile(file);
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="paper-button"
                onClick={cameraActive ? capturePhoto : startCamera}
              >
                <CameraIcon data-icon="inline-start" />
                {cameraActive ? "Capture" : "Camera"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-md border-stone-600 bg-[#fffdf8] shadow-none">
          <CardHeader>
            <CardTitle className="font-mono text-[13px] uppercase tracking-[0.78px]">
              02 Frame Style
            </CardTitle>
            <CardDescription>
              Pick a curated style or describe a reference pair you want to match.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              {GLASSES_STYLES.map((style) => {
                const selected = selectedStyleId === style.id;

                return (
                  <button
                    key={style.id}
                    type="button"
                    className="grid grid-cols-[1fr_auto] gap-3 rounded-md border border-stone-300 bg-stone-50 p-3 text-left transition hover:border-stone-600 data-[selected=true]:border-stone-800 data-[selected=true]:bg-stone-100"
                    data-selected={selected}
                    onClick={() => setSelectedStyleId(style.id)}
                  >
                    <span className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-stone-950">
                        {style.name}
                      </span>
                      <span className="text-xs text-stone-500">
                        {style.color} / {style.material}
                      </span>
                    </span>
                    {selected ? <CheckIcon className="size-4" aria-hidden /> : null}
                  </button>
                );
              })}
            </div>

            <Separator />

            <label className="flex flex-col gap-2">
              <span className="font-mono text-[12px] uppercase tracking-[0.72px] text-stone-500">
                Optional reference notes
              </span>
              <Textarea
                value={userStyleDescription}
                onChange={(event) => setUserStyleDescription(event.target.value)}
                placeholder="Example: thin brushed silver round glasses with clear lenses"
                className="min-h-24 resize-none rounded-md border-stone-300 bg-stone-50"
              />
            </label>
          </CardContent>
        </Card>

        <Card className="rounded-md border-stone-600 bg-stone-950 text-stone-50 shadow-none">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="font-mono text-[13px] uppercase tracking-[0.78px]">
                  03 Result
                </CardTitle>
                <CardDescription className="text-stone-300">
                  One realistic gpt-image-2 edit. No background swap, no face changes.
                </CardDescription>
              </div>
              <Badge variant="secondary">First free</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-[520px] flex-col gap-4">
            <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-md border border-stone-700 bg-stone-900">
              {result ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={result.imageUrl}
                  alt={`Generated try-on with ${result.styleName}`}
                  className="size-full object-contain"
                />
              ) : previewUrl ? (
                <div className="grid size-full grid-cols-2">
                  <div className="relative border-r border-stone-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Before generation"
                      className="size-full object-cover opacity-80"
                    />
                    <span className="absolute left-3 top-3 rounded border border-stone-700 bg-stone-950 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.66px]">
                      Before
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-8 text-center text-sm text-stone-400">
                    Your generated try-on appears here.
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center text-stone-400">
                  <SparklesIcon className="size-10" aria-hidden />
                  <p className="max-w-xs text-sm">
                    Add a photo and frame style to preview your result.
                  </p>
                </div>
              )}
            </div>

            {isPending ? (
              <div className="flex flex-col gap-2">
                <Progress value={progress} />
                <p className="font-mono text-[12px] uppercase tracking-[0.72px] text-stone-400">
                  Preserving light, face, and background
                </p>
              </div>
            ) : null}

            {paywall ? (
              <div className="rounded-md border border-stone-700 bg-stone-900 p-4">
                <p className="text-sm text-stone-200">
                  Your first free generation is used. Create an account and add credits to keep trying frames.
                </p>
                <Link
                  href="/checkout"
                  className={cn(
                    buttonVariants(),
                    "paper-button mt-3 w-full bg-stone-50 text-stone-950 hover:bg-stone-100",
                  )}
                >
                  Continue to credits
                </Link>
              </div>
            ) : (
              <Button
                type="button"
                className="paper-button h-12 bg-stone-50 text-stone-950 hover:bg-stone-100"
                onClick={generate}
                disabled={isPending}
              >
                {isPending ? (
                  <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
                ) : (
                  <SparklesIcon data-icon="inline-start" />
                )}
                Generate try-on
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
