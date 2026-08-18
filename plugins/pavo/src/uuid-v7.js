import { randomBytes } from 'node:crypto'

const MAX_UNIX_TIMESTAMP_MS = 0xffffffffffff
const MAX_RANDOM_VALUE = (1n << 74n) - 1n

function validateTimestamp(timestamp) {
  if (
    !Number.isSafeInteger(timestamp) ||
    timestamp < 0 ||
    timestamp > MAX_UNIX_TIMESTAMP_MS
  ) {
    throw new TypeError('UUIDv7 timestamp must be a valid 48-bit Unix timestamp.')
  }
}

function randomValueOf(random) {
  if (!(random instanceof Uint8Array) || random.length < 10) {
    throw new TypeError('UUIDv7 randomness must contain at least 10 bytes.')
  }

  let value = 0n
  for (const byte of random.subarray(0, 10)) {
    value = (value << 8n) | BigInt(byte)
  }
  return value & MAX_RANDOM_VALUE
}

function formatUuid(timestamp, randomValue) {
  const bytes = new Uint8Array(16)
  let remainingTimestamp = timestamp
  for (let index = 5; index >= 0; index -= 1) {
    bytes[index] = remainingTimestamp % 256
    remainingTimestamp = Math.floor(remainingTimestamp / 256)
  }

  let remainingRandom = randomValue
  for (let index = 15; index >= 9; index -= 1) {
    bytes[index] = Number(remainingRandom & 0xffn)
    remainingRandom >>= 8n
  }
  bytes[8] = 0x80 | Number(remainingRandom & 0x3fn)
  remainingRandom >>= 6n
  bytes[7] = Number(remainingRandom & 0xffn)
  remainingRandom >>= 8n
  bytes[6] = 0x70 | Number(remainingRandom & 0x0fn)

  const hexadecimal = Array.from(bytes, (value) =>
    value.toString(16).padStart(2, '0'),
  ).join('')
  return [
    hexadecimal.slice(0, 8),
    hexadecimal.slice(8, 12),
    hexadecimal.slice(12, 16),
    hexadecimal.slice(16, 20),
    hexadecimal.slice(20),
  ].join('-')
}

export function createUuidV7Generator({
  now = () => Date.now(),
  random = () => randomBytes(10),
} = {}) {
  let lastTimestamp = -1
  let lastRandomValue = -1n

  return function generateUuidV7(timestamp = now(), randomBytesValue = random()) {
    validateTimestamp(timestamp)
    let effectiveTimestamp = timestamp
    let randomValue = randomValueOf(randomBytesValue)

    if (effectiveTimestamp <= lastTimestamp) {
      effectiveTimestamp = lastTimestamp
      randomValue = lastRandomValue + 1n
      if (randomValue > MAX_RANDOM_VALUE) {
        if (effectiveTimestamp >= MAX_UNIX_TIMESTAMP_MS) {
          throw new TypeError('UUIDv7 monotonic sequence exhausted.')
        }
        effectiveTimestamp += 1
        randomValue = 0n
      }
    }

    lastTimestamp = effectiveTimestamp
    lastRandomValue = randomValue
    return formatUuid(effectiveTimestamp, randomValue)
  }
}

export const uuidv7 = createUuidV7Generator()
