import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private nextId = 0;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  readonly messages = signal<ToastMessage[]>([]);

  show(message: string, type: ToastType = 'success', duration = 4000): void {
    const id = ++this.nextId;
    const toast: ToastMessage = { id, text: message, type, duration };
    let removedIds: number[] = [];

    this.messages.update((items) => {
      const next = [...items, toast];
      removedIds = next.slice(0, Math.max(0, next.length - 3)).map((item) => item.id);
      return next.slice(-3);
    });

    removedIds.forEach((removedId) => this.clearTimer(removedId));
    this.timers.set(id, setTimeout(() => this.dismiss(id), duration));
  }

  dismiss(id: number): void {
    this.clearTimer(id);
    this.messages.update((items) => items.filter((toast) => toast.id !== id));
  }

  private clearTimer(id: number): void {
    const timer = this.timers.get(id);
    if (timer) clearTimeout(timer);
    this.timers.delete(id);
  }
}