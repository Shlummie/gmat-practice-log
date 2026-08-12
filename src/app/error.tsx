"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="panel mx-auto mt-20 max-w-xl p-6">
      <h2 className="text-xl font-bold">Something went wrong</h2>
      <p className="mt-2 text-sm text-[#8ea0b5]">{error.message}</p>
      <button className="btn mt-4" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
