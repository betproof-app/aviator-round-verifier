// Real rounds copied from the round history of the games (seeds and the multiplier the screen showed).
import assert from 'node:assert/strict'
import { verifyRound, chanceToReach } from './verify.mjs'

const ROUNDS = [
  // Spribe build
  { build: 'spribe', serverSeed: 'vvDhbIJqchGmogq5GNkp4tybRtgOz1VT6AGJRHyC', clientSeeds: ['46a2b9c6a20192af12db', '8883e5257bd69fbe986e', 'a3f4826cd9d18a3f3bd3'], hex: '16105e79a0ca5', shown: 1.06 },
  { build: 'spribe', serverSeed: 'U6e1y4NvMnqY7LHJwRC0nA8CgnRfNqqe26s9v5BI', clientSeeds: ['787b9f1ba17d3c850cad', '4ca7f4f94049f1aa1bfb', '58eadaf02bb2a41aecfa'], hex: 'bf66dee34b41a', shown: 3.84 },
  // Aviator Studio build
  { build: 'studio', serverSeed: 'b651d5a9ba8de6d1b53d327c55e288257ac07ff7b4ff738acaeffeae3e84b15c', clientSeeds: ['uHUAPCgzWQptzd2aAd5J', 'cabJy3Z4dBK5XqjNAdtz', '5PjMtshuy1Qm9sMlAdlW'], hex: 'fac1cf0e88d1f', shown: 46.87 },
  { build: 'studio', serverSeed: 'f72e9bc1978e2aabd2c49a0bc202724789267273e71c0328260ca3c21eb0baa4', clientSeeds: ['yKzC0vXakI5t_Yu8AdrX', 'RIAbLhjINmGhYy8yAdsF', 'YSm_Q97lTwRwKVkAAdpn'], hex: '194177d4477ed', shown: 1.06 },
  { build: 'studio', serverSeed: 'eb977797c6379c583cddbd3d477dbcacef423bab65d7e89ee09a050431d8fab5', clientSeeds: ['JO6sQK61TVVzXSzuAzhH', '6yufUNVbegT8tTXMAzZK', 'SDDnsfI89wF1MfN5Azfq'], hex: 'ffa60cbd50689', shown: 699.43 },
  // A round at the floor: the formula gives 0.96, the game shows 1.00
  { build: 'studio', serverSeed: '9892f6cc4ed553e85fcc59abb9ce1bf0350b9b780dbc49f295b9bfee01677ede', clientSeeds: ['6yufUNVbegT8tTXMAzZK', 'JO6sQK61TVVzXSzuAzhH', 'HPFHtfzs716DPIrsAzLh'], hex: '0202516634207', shown: 1.0 },
]

for (const r of ROUNDS) {
  const out = await verifyRound(r)
  assert.equal(out.hex, r.hex, `hash prefix for ${r.shown}x`)
  assert.equal(out.result, r.shown, `result for ${r.shown}x`)
}
assert.ok(Math.abs(chanceToReach(2) - 0.485) < 1e-9)
console.log(`ok: ${ROUNDS.length} real rounds rebuilt`)
