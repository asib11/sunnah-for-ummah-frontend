"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import {
  Pencil,
  Upload,
  RotateCcw,
  X,
  Image as ImageIcon,
  Video as VideoIcon,
} from "lucide-react";
import { deleteBlob, getBlob, putBlob } from "@/lib/mediaStore";

export type MediaSlot = {
  key: string;
  label: string;
  kind: "image" | "video";
  defaultUrl: string;
};

type SlotState = { url: string; custom: boolean };

export function useSectionMedia(sectionId: string, slots: MediaSlot[]): {
  urls: Record<string, string>;
  editor: ReactNode;
} {
  const [state, setState] = useState<Record<string, SlotState>>(() =>
    Object.fromEntries(
      slots.map((s) => [s.key, { url: s.defaultUrl, custom: false }])
    )
  );
  const objectUrlsRef = useRef<string[]>([]);

  // Load custom blobs from IDB on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const slot of slots) {
        try {
          const blob = await getBlob(`${sectionId}:${slot.key}`);
          if (cancelled || !blob) continue;
          const url = URL.createObjectURL(blob);
          objectUrlsRef.current.push(url);
          setState((prev) => ({ ...prev, [slot.key]: { url, custom: true } }));
        } catch {
          // ignore
        }
      }
    })();
    return () => {
      cancelled = true;
      objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      objectUrlsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  const replace = async (slotKey: string, file: File) => {
    await putBlob(`${sectionId}:${slotKey}`, file);
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.push(url);
    setState((prev) => ({ ...prev, [slotKey]: { url, custom: true } }));
  };

  const reset = async (slotKey: string) => {
    await deleteBlob(`${sectionId}:${slotKey}`);
    const slot = slots.find((s) => s.key === slotKey)!;
    setState((prev) => ({
      ...prev,
      [slotKey]: { url: slot.defaultUrl, custom: false },
    }));
  };

  const urls = Object.fromEntries(
    Object.entries(state).map(([k, v]) => [k, v.url])
  ) as Record<string, string>;

  const editor = (
    <EditorPanel
      slots={slots}
      state={state}
      onReplace={replace}
      onReset={reset}
    />
  );

  return { urls, editor };
}

function EditorPanel(_: {
  slots: MediaSlot[];
  state: Record<string, SlotState>;
  onReplace: (key: string, file: File) => void;
  onReset: (key: string) => void;
}) {
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _UnusedEditorPanel({
  slots,
  state,
  onReplace,
  onReset,
}: {
  slots: MediaSlot[];
  state: Record<string, SlotState>;
  onReplace: (key: string, file: File) => void;
  onReset: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="absolute top-3 right-3 md:top-4 md:right-4 z-[60] pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground/70 backdrop-blur-md border border-accent/40 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-foreground/90 transition-all shadow-lg"
          aria-label="Edit section media"
        >
          <Pencil className="w-3 h-3 text-accent" />
          Edit
        </button>
      ) : (
        <div className="w-[260px] rounded-xl bg-foreground/95 backdrop-blur-md border border-accent/40 shadow-2xl p-3 space-y-2 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between mb-1">
            <span className="font-body text-[10px] uppercase tracking-[0.25em] text-accent">
              Edit Media
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-primary-foreground/10 text-primary-foreground/70"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {slots.map((slot) => (
            <SlotRow
              key={slot.key}
              slot={slot}
              custom={state[slot.key]?.custom ?? false}
              onReplace={(file) => onReplace(slot.key, file)}
              onReset={() => onReset(slot.key)}
            />
          ))}
          <p className="text-[9px] text-primary-foreground/50 leading-snug pt-1">
            Saved on this device. Use Reset to restore the default.
          </p>
        </div>
      )}
    </div>
  );
}

function SlotRow({
  slot,
  custom,
  onReplace,
  onReset,
}: {
  slot: MediaSlot;
  custom: boolean;
  onReplace: (file: File) => void;
  onReset: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const Icon = slot.kind === "video" ? VideoIcon : ImageIcon;
  return (
    <div className="flex items-center gap-2 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 p-2">
      <Icon className="w-3.5 h-3.5 text-accent shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-body text-[10px] text-primary-foreground/90 truncate">
          {slot.label}
        </p>
        <p className="font-body text-[9px] uppercase tracking-[0.2em] text-primary-foreground/40">
          {custom ? "Custom" : "Default"}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={slot.kind === "video" ? "video/*" : "image/*"}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onReplace(file);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="p-1.5 rounded-md bg-accent/20 hover:bg-accent/30 text-accent transition-colors"
        aria-label={`Replace ${slot.label}`}
        title="Replace"
      >
        <Upload className="w-3 h-3" />
      </button>
      {custom && (
        <button
          type="button"
          onClick={onReset}
          className="p-1.5 rounded-md bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground/70 transition-colors"
          aria-label={`Reset ${slot.label}`}
          title="Reset to default"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}


