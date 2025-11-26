export interface WorkerRequest {
  type: "generate";
  id: string;
  diffOrSnippet: string;
}

export interface WorkerResponseOk {
  type: "result";
  id: string;
  status: "ok";
  message: string;
}

export interface WorkerResponseError {
  type: "result";
  id: string;
  status: "error";
  error: string;
}

export type WorkerResponse = WorkerResponseOk | WorkerResponseError;