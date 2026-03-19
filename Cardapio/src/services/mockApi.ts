type MockRequestOptions = {
  signal?: AbortSignal
  minDelayMs?: number
  maxDelayMs?: number
}

const DEFAULT_MIN_DELAY_MS = 180
const DEFAULT_MAX_DELAY_MS = 650

function getDelayMs(minDelayMs: number, maxDelayMs: number) {
  if (maxDelayMs <= minDelayMs) {
    return minDelayMs
  }

  return Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs
}

function createAbortError() {
  return new DOMException('Request aborted', 'AbortError')
}

export async function mockRequest<T>(
  factory: () => T | Promise<T>,
  options: MockRequestOptions = {},
): Promise<T> {
  const {
    signal,
    minDelayMs = DEFAULT_MIN_DELAY_MS,
    maxDelayMs = DEFAULT_MAX_DELAY_MS,
  } = options

  if (signal?.aborted) {
    throw createAbortError()
  }

  await new Promise<void>((resolve, reject) => {
    const delay = getDelayMs(minDelayMs, maxDelayMs)
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abortHandler)
      resolve()
    }, delay)

    const abortHandler = () => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', abortHandler)
      reject(createAbortError())
    }

    signal?.addEventListener('abort', abortHandler)
  })

  if (signal?.aborted) {
    throw createAbortError()
  }

  return factory()
}
