import type { ContentPatch, PatchAck } from "./types";

const MAX_RETRIES = 5;
const INITIAL_DELAY = 1000;
const MAX_DELAY = 30000;

interface QueueItem {
  patch: ContentPatch;
  retryCount: number;
  state: "pending" | "in-flight" | "failed";
}

type SendFn = (patch: ContentPatch) => void;

export class PatchQueue {
  private items: QueueItem[] = [];
  private sendFn: SendFn | null = null;
  private processing = false;

  setSendFn(fn: SendFn) {
    this.sendFn = fn;
  }

  enqueue(patch: ContentPatch) {
    this.items.push({ patch, retryCount: 0, state: "pending" });
    this.process();
  }

  handleAck(ack: PatchAck) {
    const idx = this.items.findIndex(
      (item) => item.patch.patchId === ack.patchId && item.state === "in-flight",
    );
    if (idx === -1) return;

    if (ack.status === "applied") {
      this.items.splice(idx, 1);
    }
  }

  handleReconnect() {
    for (const item of this.items) {
      if (item.state === "in-flight") {
        item.state = "pending";
      }
    }
    this.processing = false;
    this.process();
  }

  get pendingCount(): number {
    return this.items.filter((i) => i.state !== "failed").length;
  }

  clear() {
    this.items = [];
    this.processing = false;
  }

  private process() {
    if (this.processing || !this.sendFn) return;

    const next = this.items.find(
      (item) => item.state === "pending" || item.state === "failed",
    );
    if (!next) {
      this.processing = false;
      return;
    }

    this.processing = true;
    next.state = "in-flight";
    this.sendFn(next.patch);

    const timeout = setTimeout(() => {
      next.state = "failed";
      next.retryCount++;
      this.processing = false;

      if (next.retryCount < MAX_RETRIES) {
        const delay = Math.min(
          INITIAL_DELAY * Math.pow(2, next.retryCount - 1),
          MAX_DELAY,
        );
        setTimeout(() => this.process(), delay);
      }
    }, 5000);

    const originalHandleAck = this.handleAck.bind(this);
    const originalProcess = this.process.bind(this);

    const wrappedAck = (ack: PatchAck) => {
      clearTimeout(timeout);
      originalHandleAck(ack);
      this.processing = false;
      originalProcess();
    };

    this.handleAck = wrappedAck;
  }
}
