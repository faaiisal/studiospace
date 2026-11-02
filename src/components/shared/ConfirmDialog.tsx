"use client";

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
  variant?: "destructive" | "default";
}

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, description, confirmLabel = "Confirm", loading, variant = "destructive" }: Props) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${variant === "destructive" ? "bg-red-100 text-red-600" : "bg-[#F1F0EC] text-[#202124]"}`}>
              <AlertTriangle size={20} />
            </div>
            <h3 className="font-semibold text-neutral-900">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-100"><X size={18} /></button>
        </div>
        <div className="p-6">
          <p className="text-sm text-neutral-600 leading-6">{description}</p>
          <div className="mt-8 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button variant={variant === "destructive" ? "destructive" : "default"} onClick={onConfirm} disabled={loading}>{loading ? "Processing..." : confirmLabel}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

