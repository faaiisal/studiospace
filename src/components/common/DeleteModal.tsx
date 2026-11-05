"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, title, description, confirmLabel = "Delete", loading }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="my-4 w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-neutral-200" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 sm:p-6 border-b border-neutral-100 rounded-t-2xl gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <h3 className="font-semibold text-neutral-900 text-[15px] sm:text-base break-words pr-2">{title}</h3>
          </div>
          <button onClick={onClose} aria-label="Close dialog" className="p-2 rounded-full hover:bg-neutral-100 shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 sm:p-6">
          <p className="text-[13px] sm:text-sm text-neutral-600 leading-6 break-words">{description}</p>
          <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading} className="w-full sm:w-auto min-h-[44px]">
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={loading} className="w-full sm:w-auto min-h-[44px]">
              {loading ? "Deleting..." : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

