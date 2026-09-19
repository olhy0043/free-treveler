"use client";

import { useEffect, useSyncExternalStore } from "react";
import { subscribeToasts, getToasts, dismissToast, type ToastMessage } from "@/lib/toast";

const VARIANT_STYLES: Record<ToastMessage["variant"], string> = {
  success: "bg-[#1F8A5F]/10 text-[#1F8A5F] border-[#1F8A5F]/30",
  error: "bg-[#C1272D]/10 text-[#C1272D] border-[#C1272D]/30",
  neutral: "bg-[#2A2A2E]/5 text-[#2A2A2E] border-[#E3E1DC]",
};

function ToastItem({ toast }: { toast: ToastMessage }) {
  useEffect(() => {
    const timer = setTimeout(() => dismissToast(toast.id), toast.durationMs);
    return () => clearTimeout(timer);
  }, [toast.id, toast.durationMs]);

  return (
    <div
      role="status"
      className={`flex items-center gap-2 rounded-[14px] border px-4 py-3 text-[14px] font-medium leading-[1.5] shadow-[0_1px_2px_rgba(0,0,0,.06),0_4px_10px_rgba(0,0,0,.08)] ${VARIANT_STYLES[toast.variant]}`}
    >
      <span className="font-semibold">{toast.label}</span>
      <span>{toast.message}</span>
    </div>
  );
}

export default function ToastViewport() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts, getToasts);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
}
