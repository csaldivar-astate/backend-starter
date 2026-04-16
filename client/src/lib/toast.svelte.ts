export type ToastKind = 'info' | 'success' | 'error';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

class ToastStore {
  toasts = $state<Toast[]>([]);
  private nextId = 1;

  show(message: string, kind: ToastKind = 'info', timeoutMs = 3000): void {
    const id = this.nextId++;
    this.toasts.push({ id, kind, message });

    if (timeoutMs > 0) {
      setTimeout(() => this.dismiss(id), timeoutMs);
    }
  }

  dismiss(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }
}

export const toast = new ToastStore();
