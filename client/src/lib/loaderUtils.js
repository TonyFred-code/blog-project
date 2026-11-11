async function withMinDelay(promise, delay = 300) {
  const start = Date.now();

  const result = await promise;

  const elapsed = Date.now() - start;
  const remaining = Math.max(0, delay - elapsed);

  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }

  return result;
}

export { withMinDelay };
