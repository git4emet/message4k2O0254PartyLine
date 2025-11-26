import { useState } from "react";
import { generateCommitMessage } from "./logic/commitMessageModel";

function App() {
  const [input, setInput] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("Please paste a diff or code snippet.");
      return;
    }

    setLoading(true);
    setError(null);
    setCommitMessage(""); 

    try {
      const msg = await generateCommitMessage(input);
      setCommitMessage(msg);
    } catch (e) {
      console.error(e);
      setError("Something went wrong while generating the commit message.");
    } finally {
      setLoading(false);
    }
  };

  const handleExample = () => {
    setInput(
      [
        "diff --git a/src/user.ts b/src/user.ts",
        "index 1234567..89abcde 100644",
        "--- a/src/user.ts",
        "+++ b/src/user.ts",
        "@@ -1,4 +1,9 @@",
        " export interface User {",
        "-  name: string;",
        "+  id: string;",
        "+  name: string;",
        "+  email?: string;",
        " }",
        "",
        "+export function getDisplayName(user: User): string {",
        "+  return user.name || user.id;",
        "+}",
      ].join("\n")
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8">

        <header className="mb-8">
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Friendly Commits <span className="text-xl">🧠</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Paste a git diff or code snippet and let Transformers.js generate a commit message —
            all locally in your browser.
          </p>
        </header>

        <main className="grid flex-1 gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">

          <section className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow-xl shadow-slate-950/60">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Diff / snippet
              </h2>

              <button
                onClick={handleExample}
                className="inline-flex items-center rounded-full border border-slate-600/70 px-3 py-1 text-xs text-slate-200 hover:border-slate-300 hover:bg-slate-800/80 transition-colors"
              >
                Insert example diff
              </button>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a git diff or code snippet..."
              rows={14}
              className="flex-1 resize-none rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 font-mono"
            />

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Generating…" : "Generate commit message"}
              </button>

              {error && <p className="text-xs text-rose-400">{error}</p>}
            </div>
          </section>

          <section className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow-xl shadow-slate-950/60">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Commit message
              </h2>
            </div>

            <div className="flex-1 rounded-xl border border-slate-800 bg-slate-950/60 p-3">

              {loading && (
                <p className="text-sm text-slate-400">
                  Generating commit message…
                </p>
              )}

              {!loading && commitMessage && (
                <pre className="whitespace-pre-wrap break-words font-mono text-sm text-slate-100">
                  {commitMessage}
                </pre>
              )}

              {!loading && !commitMessage && !error && (
                <p className="text-sm text-slate-500">
                  Your commit message will appear here ✨
                </p>
              )}

              {!loading && error && (
                <p className="text-sm text-rose-400">{error}</p>
              )}
            </div>

            <p className="mt-3 text-[11px] text-slate-500">
              Powered by <code>@huggingface/transformers</code> (Transformers.js) — running fully on-device.
            </p>
          </section>

        </main>
      </div>
    </div>
  );
}

export default App;
