# Friendly Commits Requisite Skills

**Prototype:** local browser application that generates commit messages from code diffs or snippets.

## Model execution
- Transformers.js text-generation pipeline.
- ONNX model loading.
- Qwen2.5-Coder-0.5B-Instruct integration.
- Quantized model configuration (`q8`).
- Local browser inference without a backend.

## Worker architecture
- Web Worker creation and lifecycle.
- Typed request and response messages.
- Request ID generation and correlation.
- Pending promise registry.
- Success and error response handling.
- Worker error propagation and pending-request cleanup.
- Off-main-thread inference.

## Application behavior
- Git diff and code-snippet intake.
- Commit-message generation.
- Conventional Commit output.
- Invalid-input response.
- React, TypeScript, Vite, and Tailwind integration.

## Source artifacts inspected
- `src/logic/commitMessageModel.ts`
- `src/workers/commitWorker.ts`
- Repository README.

## Evidence boundary
Source and README inspected. Model quality, latency, and offline behavior were not independently benchmarked in this review.

See the [shared requisite-skill atlas](https://github.com/git4emet/systemsNxXD/blob/main/docs/skills/CONVERSATION_RECOVERED_SKILL_ATLAS.md).
