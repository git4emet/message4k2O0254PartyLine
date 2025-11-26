import type { WorkerRequest, WorkerResponse } from "../models/workerModels";

let worker: Worker | null = null;

const pending = new Map<
  string,
  { resolve: (value: string) => void; reject: (reason?: unknown) => void }
>();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(
      new URL("../workers/commitWorker.ts", import.meta.url),
      { type: "module" }
    );

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const data = event.data;
      if (!data || data.type !== "result") return;

      const entry = pending.get(data.id);
      if (!entry) return;
      pending.delete(data.id);

      if (data.status === "ok") {
        entry.resolve(data.message);
      } else {
        entry.reject(new Error(data.error));
      }
    };

    worker.onerror = (err) => {
      console.error("[commitMessageModel] Worker error", err);
      for (const [, { reject }] of pending) {
        reject(new Error("Worker error"));
      }
      pending.clear();
    };
  }

  return worker;
}

export function generateCommitMessage(diffOrSnippet: string): Promise<string> {
  const w = getWorker();

  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const message: WorkerRequest = {
    type: "generate",
    id,
    diffOrSnippet,
  };

  return new Promise<string>((resolve, reject) => {
    pending.set(id, { resolve, reject });
    w.postMessage(message);
  });
}
