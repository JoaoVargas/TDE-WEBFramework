interface MockRequestOptions {
  signal?: AbortSignal
  minDelayMs?: number
  maxDelayMs?: number
  debugLabel?: string
  respectAbort?: boolean
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

function logDebug(message: string, details?: unknown) {
  if (!import.meta.env.DEV) {
    return
  }

  if (typeof details === 'undefined') {
    console.warn(`[mockApi] ${message}`)
    return
  }

  console.warn(`[mockApi] ${message}`, details)
}

export async function mockRequest<T>(
  factory: () => T | Promise<T>,
  options: MockRequestOptions = {},
): Promise<T> {
  const {
    signal,
    minDelayMs = DEFAULT_MIN_DELAY_MS,
    maxDelayMs = DEFAULT_MAX_DELAY_MS,
    debugLabel = 'anonymous-request',
    respectAbort = true,
  } = options

  if (respectAbort && signal?.aborted) {
    const abortedError = createAbortError()
    logDebug(`${debugLabel} aborted before start`, abortedError)
    throw abortedError
  }

  const delayMs = getDelayMs(minDelayMs, maxDelayMs)
  logDebug(`${debugLabel} started`, { delayMs, respectAbort })

  await new Promise<void>((resolve, reject) => {
    let settled = false

    const abortHandler = () => {
      if (!respectAbort || settled) {
        return
      }

      settled = true
      clearTimeout(timer)
      signal?.removeEventListener('abort', abortHandler)

      const abortedError = createAbortError()
      logDebug(`${debugLabel} aborted while waiting`, abortedError)
      reject(abortedError)
    }

    const timer = setTimeout(() => {
      if (settled) {
        return
      }

      settled = true
      signal?.removeEventListener('abort', abortHandler)
      resolve()
    }, delayMs)

    if (respectAbort) {
      signal?.addEventListener('abort', abortHandler)
    }
  })

  if (respectAbort && signal?.aborted) {
    const abortedError = createAbortError()
    logDebug(`${debugLabel} aborted after wait`, abortedError)
    throw abortedError
  }

  try {
    const result = await factory()
    logDebug(`${debugLabel} resolved`)
    return result
  } catch (error) {
    logDebug(`${debugLabel} failed`, error)
    throw error
  }
}
