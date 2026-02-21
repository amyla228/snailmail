"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", padding: "2rem", background: "#faf7f5", color: "#3a3330" }}>
        <h1>Something went wrong</h1>
        <p style={{ color: "#c25044" }}>{error.message}</p>
        <button type="button" onClick={reset} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
          Try again
        </button>
      </body>
    </html>
  )
}
