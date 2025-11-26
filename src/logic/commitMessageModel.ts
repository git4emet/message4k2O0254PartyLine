import {
  pipeline,
  type TextGenerationPipeline,
} from "@huggingface/transformers";

let commitPipelinePromise: Promise<TextGenerationPipeline> | null = null;

export async function getCommitPipeline(): Promise<TextGenerationPipeline> {
  if (!commitPipelinePromise) {
    commitPipelinePromise = pipeline(
      "text-generation",
      "onnx-community/Qwen2.5-Coder-0.5B-Instruct"
    ) as Promise<TextGenerationPipeline>;
  }

  return commitPipelinePromise;
}

export async function generateCommitMessage(
  diffOrSnippet: string
): Promise<string> {
  const generator = await getCommitPipeline();

  const messages = [
    {
      role: "system",
      content:
        "You are an assistant that writes excellent Git commit messages.\n" +
        "Given a diff, write a concise, high-quality commit message.\n" +
        "Output only the commit message.",
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

  const msg =
    Array.isArray(result) && result[0]?.generated_text?.at(-1)?.content;

  return msg || "chore: update code";
}
