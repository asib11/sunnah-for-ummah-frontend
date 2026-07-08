"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Next.js Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Client-side Crash!</h2>
      <div className="bg-red-950 p-6 rounded-lg max-w-3xl w-full text-left overflow-auto">
        <p className="font-mono text-sm mb-2"><strong className="text-red-400">Message:</strong> {error.message}</p>
        <p className="font-mono text-xs text-red-200 whitespace-pre-wrap"><strong className="text-red-400">Stack:</strong><br/>{error.stack}</p>
        {error.digest && <p className="font-mono text-xs mt-2 text-gray-400">Digest: {error.digest}</p>}
      </div>
      <button
        className="mt-6 px-4 py-2 bg-white text-black font-bold rounded"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
