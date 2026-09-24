"use client";

import { useState } from "react";
import { Check, Download, Globe, Link2, Lock } from "lucide-react";
import toast from "react-hot-toast";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";
import { Button } from "@/components/ui/Button";
import { absoluteUrl } from "@/utils/baseUrl";
import { downloadImage } from "@/utils/downloadImage";
import { cn } from "@/utils/cn";

const SHARE_TITLE = "I found my ikigai";

interface SharePanelProps {
  userId: string;
  coverImage: string;
  initialSharable: boolean;
  onSharableChange?: (sharable: boolean) => void;
  className?: string;
}

const socialClass =
  "inline-flex h-10 items-center justify-center rounded-full border border-border-strong bg-card px-4 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-40";

export default function SharePanel({ userId, coverImage, initialSharable, onSharableChange, className }: SharePanelProps) {
  const [sharable, setSharable] = useState(initialSharable);
  const [updating, setUpdating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = absoluteUrl(`/ikigai/${userId}`);

  const toggle = async () => {
    setUpdating(true);
    const next = !sharable;
    try {
      const res = await fetch("/api/ikigai/sharing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, sharable: next }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSharable(next);
      onSharableChange?.(next);
      toast.success(next ? "Your card is public" : "Your card is private");
    } catch {
      toast.error("We couldn't update sharing. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy. You can copy the link from the address bar on your public page.");
    }
  };

  const download = async () => {
    setDownloading(true);
    try {
      await downloadImage(coverImage, "my-ikigai.png");
    } catch {
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 sm:p-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-full",
              sharable ? "bg-[#e3f1ea] text-success" : "bg-muted text-muted-foreground"
            )}
            aria-hidden="true"
          >
            {sharable ? <Globe className="size-5" /> : <Lock className="size-5" />}
          </span>
          <div>
            <p className="font-medium" id="share-visibility-label">
              {sharable ? "Public link is on" : "Private"}
            </p>
            <p className="text-sm text-muted-foreground">
              {sharable ? "Anyone with the link can see your card and ikigai map." : "Only you can see your card."}
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={sharable}
          aria-labelledby="share-visibility-label"
          disabled={updating}
          onClick={toggle}
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60",
            sharable ? "bg-success" : "bg-border-strong"
          )}
        >
          <span
            className={cn(
              "absolute left-0 top-1 size-5 rounded-full bg-white shadow transition-transform",
              sharable ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>

      {sharable && (
        <div className="mt-5 space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-4 pr-1">
            <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{url}</span>
            <Button size="sm" variant="neutral" onClick={copy} leftIcon={copied ? <Check className="size-4" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}>
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <TwitterShareButton url={url} title={SHARE_TITLE} resetButtonStyle={false} className={socialClass}>
              X
            </TwitterShareButton>
            <LinkedinShareButton url={url} title={SHARE_TITLE} resetButtonStyle={false} className={socialClass}>
              LinkedIn
            </LinkedinShareButton>
            <FacebookShareButton url={url} hashtag="#ikigai" resetButtonStyle={false} className={socialClass}>
              Facebook
            </FacebookShareButton>
            <EmailShareButton url={url} subject={SHARE_TITLE} body="Here's my ikigai:" resetButtonStyle={false} className={socialClass}>
              Email
            </EmailShareButton>
          </div>
        </div>
      )}

      <Button
        variant="primary"
        fullWidth
        className="mt-5"
        onClick={download}
        isLoading={downloading}
        loadingText="Preparing…"
        leftIcon={<Download className="size-4" aria-hidden="true" />}
      >
        Download image
      </Button>
    </div>
  );
}
