// Aviator round verifier: rebuilds a finished provably fair crash round from its seeds.
// Two different games are sold as "Aviator" and they use different formulas (both checked against real rounds):
//   spribe  hash = SHA-512(server seed + client seed 1 + 2 + 3), result = floor(97 * 2^52 / (2^52 - h)) / 100
//   studio  hash = SHA-512(client seed 1 + 2 + 3 + server seed), result = floor(96 * 2^52 / (2^52 - h)) / 100
// h = the first 13 hex characters of the hash as a number. The result is never shown below 1.00.
// Works in browsers and in Node 18+ (Web Crypto). No dependencies.
const E = 2n ** 52n
export const BUILDS = {
  spribe: { numerator: 97n, serverLast: false },
  studio: { numerator: 96n, serverLast: true },
}

export async function sha512Hex(text) {
  const buf = await globalThis.crypto.subtle.digest('SHA-512', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Returns the hash, the 13 hex characters used, the raw value before the 1.00 floor and the multiplier shown.
export async function verifyRound({ serverSeed, clientSeeds, build = 'spribe' }) {
  const b = BUILDS[build]
  if (!b) throw new Error(`unknown build "${build}", use spribe or studio`)
  const clients = clientSeeds.map((s) => s.trim()).join('')
  const server = serverSeed.trim()
  const hash = await sha512Hex(b.serverLast ? clients + server : server + clients)
  const hex = hash.slice(0, 13)
  const hundredths = Number((b.numerator * E) / (E - BigInt('0x' + hex)))
  return { hash, hex, raw: hundredths / 100, result: Math.max(1, hundredths / 100) }
}

// Chance that a round reaches at least `x` (ignoring rounding to hundredths): numerator / 100 / x.
export const chanceToReach = (x, build = 'spribe') => Number(BUILDS[build].numerator) / 100 / x

// Command line: node verify.mjs <spribe|studio> <server seed> <client seed 1> <client seed 2> <client seed 3>
if (typeof process !== 'undefined' && process.argv[1] && import.meta.url === new URL('file://' + process.argv[1]).href) {
  const [build, serverSeed, ...clientSeeds] = process.argv.slice(2)
  if (!serverSeed || clientSeeds.length === 0) {
    console.log('usage: node verify.mjs <spribe|studio> <server seed> <client seed 1> <client seed 2> <client seed 3>')
    process.exit(1)
  }
  const r = await verifyRound({ serverSeed, clientSeeds, build })
  console.log(`hash   ${r.hash}\nhex    ${r.hex}\nresult ${r.result.toFixed(2)}x${r.raw < 1 ? ` (formula ${r.raw.toFixed(2)}, shown at the 1.00 floor)` : ''}`)
}
