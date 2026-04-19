export const handleError = (err) => {
  const code = err?.code || "UNKNOWN_ERROR";

  if (code === "SYS_503") {
    console.warn("Service unavailable", err);
  }

  if (err?.retryable) {
    console.warn("Retryable error", err);
  }

  console.error(err);
};
