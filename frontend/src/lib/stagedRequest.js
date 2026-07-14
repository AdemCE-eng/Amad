const defaultSleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const defaultNow = () => (typeof performance === 'undefined' ? Date.now() : performance.now());

// Starts the real request synchronously, while a customer-facing stage timeline
// progresses in parallel. Success waits for both; failures stop presentation
// immediately so callers can show a genuine retry state.
export async function runStagedRequest({
  request,
  stages,
  minimumMs,
  onStage,
  sleep = defaultSleep,
  now = defaultNow,
}) {
  if (typeof request !== 'function' || !Array.isArray(stages) || stages.length === 0) {
    throw new Error('invalid_staged_request');
  }

  const startedAt = now();
  const interval = minimumMs / stages.length;
  let active = true;
  onStage?.(0);

  let requestPromise;
  try {
    // Deliberately invoked before the first timer: no artificial network delay.
    requestPromise = Promise.resolve(request());
  } catch (error) {
    active = false;
    throw error;
  }

  const timeline = (async () => {
    for (let index = 1; index < stages.length; index += 1) {
      await sleep(interval);
      if (!active) return;
      onStage?.(index);
    }
    const remaining = minimumMs - (now() - startedAt);
    if (remaining > 0) await sleep(remaining);
  })();

  try {
    const result = await requestPromise;
    await timeline;
    return result;
  } catch (error) {
    active = false;
    throw error;
  } finally {
    active = false;
  }
}
