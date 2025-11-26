import {
  pipeline,
  type TextGenerationPipeline,
} from "@huggingface/transformers";
import type {
  WorkerRequest,
  WorkerResponseError,
  WorkerResponseOk,
} from "../models/workerModels";

interface ChatMessage {
  role: string;
  content: string;
}

interface Generation {
  generated_text: ChatMessage[];
}

let commitPipelinePromise: Promise<TextGenerationPipeline> | null = null;

async function getCommitPipeline(): Promise<TextGenerationPipeline> {
  if (!commitPipelinePromise) {
    commitPipelinePromise = pipeline(
      "text-generation",
      "onnx-community/Qwen2.5-Coder-0.5B-Instruct",
      { dtype: "q8" }
    ) as Promise<TextGenerationPipeline>;
  }
  return commitPipelinePromise;
}

self.addEventListener("message", async (event: MessageEvent<WorkerRequest>) => {
  const data = event.data;

  if (!data || data.type !== "generate") return;

  const { id, diffOrSnippet } = data;

  try {
    const generator = await getCommitPipeline();

    const messages = [
      {
        role: "system",
        content:
          "You are an assistant that writes excellent Git commit messages.\n" +
          "Given a diff, write a concise, high-quality commit message.\n" +
          "Output only the commit message.\n" +
          "If it is not a code diff or snipped, type: that's not even a code!!!.\n",
      },
      {
        role: "user",
        content: diffOrSnippet,
      },
    ];

    const result = await generator(messages, {
      max_new_tokens: 128,
      do_sample: false,
    });

    let msg: string | undefined;

    try {
      msg = (result as Generation[])[0]?.generated_text?.at(-1)?.content;
    } catch {
      msg = undefined;
    }

    if (!msg) {
      msg = "chore: update code";
    }

    const response: WorkerResponseOk = {
      type: "result",
      id,
      status: "ok",
      message: msg,
    };

    self.postMessage(response);
  } catch (err) {
    console.error("[commitWorker] error", err);

    const response: WorkerResponseError = {
      type: "result",
      id,
      status: "error",
      error:
        err instanceof Error ? err.message : "Unknown error in commit worker",
    };

    self.postMessage(response);
  }
});
