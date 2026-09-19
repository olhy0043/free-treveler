export type ToastVariant = "success" | "error" | "neutral";

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  label: string;
  message: string;
  durationMs: number;
}

type Listener = (toasts: ToastMessage[]) => void;

let toasts: ToastMessage[] = [];
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener(toasts);
}

export function subscribeToasts(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToasts(): ToastMessage[] {
  return toasts;
}

const VARIANT_LABEL: Record<ToastVariant, string> = {
  success: "성공",
  error: "오류",
  neutral: "안내",
};

/**
 * 실제 이메일 발송 없이 화면 상태로만 알림을 표시한다(참가요청/신고 처리 등).
 * message에는 닉네임·이메일 등 개인정보를 포함하지 않는다 - 호출부 책임.
 * 이 함수 호출 실패가 이미 반영된 상태 변경을 롤백하지 않는다.
 */
export function showToast(variant: ToastVariant, message: string, durationMs = 4000): string {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  toasts = [...toasts, { id, variant, label: VARIANT_LABEL[variant], message, durationMs }];
  emit();
  return id;
}

export function dismissToast(id: string): void {
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}
