"use client";

import { useEffect, useRef, useState, useTransition, type ReactElement } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  CameraIcon,
  CheckIcon,
  CircleHelpIcon,
  EyeIcon,
  HeartIcon,
  ImageIcon,
  InfoIcon,
  LoaderCircleIcon,
  LockIcon,
  RotateCwIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  UploadIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { GLASSES_STYLES, type GlassesStyle } from "@/lib/glasses/catalog";
import { cn } from "@/lib/utils";

type GenerationResult = {
  id: string;
  imageUrl: string;
  styleName: string;
  model: string;
  source: "openai" | "demo";
};

const STYLE_TABS = ["Recommended", "Trending", "Round", "Square", "Rectangle"];
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function TryOnStudio() {
  const [selectedStyleId, setSelectedStyleId] = useState(GLASSES_STYLES[0].id);
  const [activeTab, setActiveTab] = useState(STYLE_TABS[0]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [userStyleDescription, setUserStyleDescription] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [paywall, setPaywall] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPending, startTransition] = useTransition();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const selectedStyle =
    GLASSES_STYLES.find((style) => style.id === selectedStyleId) ??
    GLASSES_STYLES[0];
  const visibleStyles = GLASSES_STYLES.filter((style) => {
    if (activeTab === "Recommended" || activeTab === "Trending") return true;
    return style.family.toLowerCase().includes(activeTab.toLowerCase());
  });

  useEffect(() => {
    if (!isPending) {
      return;
    }

    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(value + 9, 91));
    }, 650);

    return () => window.clearInterval(timer);
  }, [isPending]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!cameraOpen) {
      stopCameraStream();
      return;
    }

    let cancelled = false;

    async function openCamera() {
      setCameraLoading(true);
      setCameraError(null);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        attachStream(videoRef.current);
      } catch {
        setCameraError("Camera permission was blocked or no camera was found.");
        toast.error("Camera permission was not granted.");
      } finally {
        if (!cancelled) {
          setCameraLoading(false);
        }
      }
    }

    openCamera();

    return () => {
      cancelled = true;
    };
  }, [cameraOpen]);

  function attachStream(videoElement: HTMLVideoElement | null) {
    if (!videoElement || !streamRef.current) return;
    videoElement.srcObject = streamRef.current;
    void videoElement.play().catch(() => undefined);
  }

  function stopCameraStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function capturePhoto() {
    const video = videoRef.current;

    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      toast.error("Camera is still warming up. Try again in a moment.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "camera-capture.jpg", {
          type: "image/jpeg",
        });
        setPhotoFile(file);
        setCameraOpen(false);
        toast.success("Camera photo captured.");
      },
      "image/jpeg",
      0.92,
    );
  }

  function setPhotoFile(file: File) {
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("Use a photo under 10MB.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPhoto(file);
    setResult(null);
    setPaywall(false);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handlePhotoFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Upload a JPG, PNG, or WEBP image.");
      return;
    }

    setPhotoFile(file);
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
    <>
      <section
        className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-[1720px] flex-col gap-4 px-4 pb-8 pt-4 md:px-6"
        aria-label="AI glasses try-on studio"
      >
        <div className="grid flex-1 grid-cols-1 gap-4 xl:grid-cols-[0.88fr_1.45fr_1.08fr]">
          <Card className="paper-panel studio-entrance">
            <CardHeader className="gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="font-mono text-[13px] uppercase tracking-[0.78px]">
                    1. Upload your photo
                  </CardTitle>
                  <CardDescription>
                    Good lighting and a clear front-facing photo work best.
                  </CardDescription>
                </div>
                <CircleHelpIcon className="size-4 text-muted-foreground" aria-hidden />
              </div>
              <div className="grid grid-cols-2 rounded-md border border-foreground/15 bg-secondary/40 p-1">
                <label
                  htmlFor="face-photo"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "paper-button h-10 cursor-pointer bg-card",
                  )}
                >
                  Upload
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 rounded-md font-mono text-[13px] uppercase tracking-[0.78px]"
                  onClick={() => setCameraOpen(true)}
                >
                  Camera
                </Button>
              </div>
              <Input
                id="face-photo"
                className="sr-only"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  handlePhotoFile(event.target.files?.[0]);
                }}
              />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-md border border-dashed border-foreground/25 bg-background"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handlePhotoFile(event.dataTransfer.files[0]);
                }}
              >
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Uploaded face preview"
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-4 p-8 text-center text-muted-foreground">
                    <UploadIcon className="size-12 stroke-1" aria-hidden />
                    <div>
                      <p className="font-mono text-[13px] uppercase tracking-[0.78px] text-foreground">
                        Drag and drop your photo here
                      </p>
                      <p className="mt-2 text-xs">JPG, PNG or WEBP, max 10MB</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-md border border-foreground/15 bg-background p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.72px]">
                  Photo tips
                </p>
                <div className="mt-3 grid gap-3 text-sm text-muted-foreground">
                  <Tip icon={<EyeIcon />} text="Face the camera directly" />
                  <Tip icon={<ImageIcon />} text="Remove sunglasses or hats" />
                  <Tip icon={<SunIcon />} text="Use even, natural lighting" />
                  <Tip icon={<ShieldCheckIcon />} text="Source photos are private" />
                </div>
              </div>

              <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
                <LockIcon className="size-3.5" aria-hidden />
                Your source image is deleted after generation.
              </p>
            </CardContent>
          </Card>

          <Card className="paper-panel studio-entrance-delay">
            <CardHeader>
              <CardTitle className="font-mono text-[13px] uppercase tracking-[0.78px]">
                2. Choose your style
              </CardTitle>
              <CardDescription>
                Select a frame or describe your own reference.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex gap-6 overflow-x-auto border-b border-foreground/15 pb-1">
                {STYLE_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    data-active={activeTab === tab}
                    className="relative h-9 shrink-0 font-mono text-[12px] uppercase tracking-[0.72px] text-muted-foreground transition hover:text-foreground data-[active=true]:text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-foreground after:opacity-0 data-[active=true]:after:opacity-100"
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visibleStyles.map((style, index) => {
                  const selected = selectedStyleId === style.id;

                  return (
                    <button
                      key={style.id}
                      type="button"
                      className="group relative min-h-[156px] rounded-md border border-foreground/12 bg-background p-3 text-left transition hover:-translate-y-0.5 hover:border-foreground/45 data-[selected=true]:border-foreground data-[selected=true]:shadow-[0_0_0_1px_var(--foreground)]"
                      data-selected={selected}
                      onClick={() => setSelectedStyleId(style.id)}
                    >
                      <FrameIllustration style={style} index={index} />
                      <span className="mt-3 flex items-end justify-between gap-3">
                        <span>
                          <span className="block font-mono text-[12px] uppercase tracking-[0.72px]">
                            {style.name}
                          </span>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {style.color}
                          </span>
                        </span>
                        {selected ? (
                          <CheckIcon className="size-4 text-foreground" aria-hidden />
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-4 rounded-md border border-dashed border-foreground/25 bg-background p-4 md:grid-cols-[auto_1fr] md:items-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-secondary">
                  <FrameIllustration style={selectedStyle} compact />
                </div>
                <label className="flex flex-col gap-2">
                  <span className="font-mono text-[12px] uppercase tracking-[0.72px]">
                    Upload your own frame notes
                  </span>
                  <Textarea
                    value={userStyleDescription}
                    onChange={(event) => setUserStyleDescription(event.target.value)}
                    placeholder="Example: thin brushed silver round glasses with clear lenses"
                    className="min-h-20 resize-none rounded-md bg-card"
                  />
                </label>
              </div>

              <Button
                type="button"
                className="paper-button mx-auto h-13 w-full max-w-sm bg-foreground text-background hover:bg-foreground/90"
                onClick={generate}
                disabled={isPending}
              >
                {isPending ? (
                  <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
                ) : (
                  <SparklesIcon data-icon="inline-start" />
                )}
                Generate try-on
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <InfoIcon className="size-3.5" aria-hidden />
                Results usually take a few seconds.
              </p>
            </CardContent>
          </Card>

          <Card className="paper-panel studio-entrance">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="font-mono text-[13px] uppercase tracking-[0.78px]">
                    3. Preview your look
                  </CardTitle>
                  <CardDescription>
                    See the selected frame while preserving your photo.
                  </CardDescription>
                </div>
                {photo ? (
                  <label
                    htmlFor="face-photo"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "paper-button cursor-pointer bg-card",
                    )}
                  >
                    Change photo
                  </label>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="flex min-h-[560px] flex-col gap-4">
              <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-md border border-foreground/15 bg-background">
                {result ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={result.imageUrl}
                    alt={`Generated try-on with ${result.styleName}`}
                    className="size-full object-contain"
                  />
                ) : previewUrl ? (
                  <div className="grid size-full grid-cols-2">
                    <PreviewHalf label="Before" imageUrl={previewUrl} />
                    <div className="relative flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="After generation placeholder"
                        className="size-full object-cover opacity-45 grayscale"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-background/40 p-6 text-center backdrop-blur-[1px]">
                        <p className="max-w-[14rem] font-mono text-[12px] uppercase tracking-[0.72px] text-foreground">
                          Generate to preview the selected frame on your photo
                        </p>
                      </div>
                      <span className="absolute right-3 top-3 rounded border border-foreground/20 bg-card px-2 py-1 font-mono text-[11px] uppercase tracking-[0.66px]">
                        After
                      </span>
                    </div>
                    <span className="absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-foreground/15 bg-card shadow-sm">
                      <ArrowRightIcon className="size-4" aria-hidden />
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center text-muted-foreground">
                    <SparklesIcon className="size-12 stroke-1" aria-hidden />
                    <p className="max-w-xs text-sm">
                      Add a photo and pick a frame to preview your try-on.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-3 rounded-md border border-foreground/12 bg-background p-3">
                <div className="flex items-center gap-3">
                  <FrameIllustration style={selectedStyle} compact />
                  <div>
                    <p className="font-mono text-[12px] uppercase tracking-[0.72px]">
                      {selectedStyle.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedStyle.color}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="paper-button bg-card"
                  aria-label="Save style"
                >
                  <HeartIcon className="size-4" aria-hidden />
                </Button>
              </div>

              {isPending ? (
                <div className="rounded-md border border-foreground/12 bg-background p-4">
                  <div className="flex items-center gap-3">
                    <LoaderCircleIcon className="size-5 animate-spin" aria-hidden />
                    <div>
                      <p className="font-mono text-[12px] uppercase tracking-[0.72px]">
                        Generating your try-on
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Preserving identity, lighting, and background.
                      </p>
                    </div>
                  </div>
                  <Progress value={progress} className="mt-3" />
                </div>
              ) : null}

              {paywall ? (
                <div className="rounded-md border border-foreground/15 bg-background p-4">
                  <p className="text-sm text-muted-foreground">
                    Your first free generation is used. Create an account and add credits to keep trying frames.
                  </p>
                  <Link
                    href="/checkout"
                    className={cn(
                      buttonVariants(),
                      "paper-button mt-3 w-full bg-foreground text-background hover:bg-foreground/90",
                    )}
                  >
                    Continue to credits
                  </Link>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="paper-panel grid gap-4 p-4 md:grid-cols-4">
          <Feature icon={<ShieldCheckIcon />} title="Private & secure" text="Source photos are not reused." />
          <Feature icon={<SparklesIcon />} title="Accurate try-on" text="One detailed edit per request." />
          <Feature icon={<EyeIcon />} title="Wide selection" text="Curated shapes and colors." />
          <Feature icon={<RotateCwIcon />} title="Easy & fast" text="Try frames from home." />
        </div>
      </section>

      <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
        <DialogContent className="max-w-3xl p-0">
          <DialogHeader className="border-b border-foreground/10 p-4">
            <DialogTitle className="font-mono text-[13px] uppercase tracking-[0.78px]">
              Take a photo
            </DialogTitle>
            <DialogDescription>
              Center your face, use soft light, then capture.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-foreground/15 bg-black">
              {cameraLoading ? (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <LoaderCircleIcon className="size-7 animate-spin" aria-hidden />
                </div>
              ) : null}
              {cameraError ? (
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm text-white">
                  {cameraError}
                </div>
              ) : null}
              <video
                ref={(node) => {
                  videoRef.current = node;
                  attachStream(node);
                }}
                autoPlay
                muted
                playsInline
                className="size-full object-cover"
              />
              <div className="pointer-events-none absolute inset-6 rounded-[999px] border border-white/45" />
            </div>
          </div>
          <DialogFooter className="m-0 rounded-none">
            <Button
              type="button"
              variant="outline"
              className="paper-button bg-card"
              onClick={() => setCameraOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="paper-button bg-foreground text-background hover:bg-foreground/90"
              disabled={cameraLoading || Boolean(cameraError)}
              onClick={capturePhoto}
            >
              <CameraIcon data-icon="inline-start" />
              Use this photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PreviewHalf({ label, imageUrl }: { label: string; imageUrl: string }) {
  return (
    <div className="relative overflow-hidden border-r border-foreground/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt={`${label} generation`} className="size-full object-cover" />
      <span className="absolute left-3 top-3 rounded border border-foreground/20 bg-card px-2 py-1 font-mono text-[11px] uppercase tracking-[0.66px]">
        {label}
      </span>
    </div>
  );
}

function Tip({ icon, text }: { icon: ReactElement; text: string }) {
  return (
    <p className="flex items-center gap-3">
      {icon}
      <span>{text}</span>
    </p>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: ReactElement;
  title: string;
  text: string;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-3 border-foreground/10 md:border-r md:pr-4 md:last:border-r-0">
      <span className="flex size-11 items-center justify-center rounded-md border border-foreground/15">
        {icon}
      </span>
      <span>
        <span className="block font-mono text-[12px] uppercase tracking-[0.72px]">
          {title}
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">{text}</span>
      </span>
    </div>
  );
}

function FrameIllustration({
  style,
  compact = false,
  index = 0,
}: {
  style: GlassesStyle;
  compact?: boolean;
  index?: number;
}) {
  const colors = ["#18181b", "#7c2d12", "#8b8b83", "#b98943", "#1f3a4a", "#6b6f45"];
  const stroke = colors[index % colors.length];
  const width = compact ? 58 : 170;
  const height = compact ? 32 : 74;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 170 74"
      role="img"
      aria-label={`${style.name} frame preview`}
      className="mx-auto block text-foreground transition group-hover:scale-[1.02]"
    >
      <path
        d="M17 36 C22 20 48 17 63 29 C70 36 68 55 58 61 C45 69 23 62 18 47 Z"
        fill="none"
        stroke={stroke}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path
        d="M107 29 C122 17 148 20 153 36 L152 47 C147 62 125 69 112 61 C102 55 100 36 107 29 Z"
        fill="none"
        stroke={stroke}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path
        d="M65 38 C75 31 95 31 105 38"
        fill="none"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M18 36 C6 35 2 39 0 43 M152 36 C164 35 168 39 170 43"
        fill="none"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M33 24 C42 22 53 23 60 30 M124 24 C133 22 144 23 151 30"
        fill="none"
        stroke="white"
        strokeOpacity="0.62"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
