"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("App error:", error)
  }, [error])

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#faf7f5",
        color: "#3a3330",
        fontFamily: "Georgia, serif",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        maxWidth: "480px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Something went wrong</h1>
      <p style={{ fontSize: "0.875rem", color: "#c25044", margin: 0 }}>
        {error.message}
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          marginTop: "0.5rem",
          padding: "0.5rem 1rem",
          background: "#d4856a",
          color: "#fff",
          border: "none",
          borderRadius: "0.5rem",
          cursor: "pointer",
          fontFamily: "Georgia, serif",
        }}
      >
        Try again
      </button>
    </div>
  )
}
