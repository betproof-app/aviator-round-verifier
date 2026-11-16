# Aviator round verifier

Rebuilds a finished provably fair **Aviator** crash round from its seeds and shows the multiplier the game should have displayed. Two different games are sold under the name Aviator, and they use different formulas; both are supported and both were confirmed against real rounds copied from the games.

| Version | String hashed with SHA-512 | Multiplier |
|---|---|---|
| Spribe | server seed + client seeds 1, 2, 3 | `floor(97 * 2^52 / (2^52 - h)) / 100`, at least 1.00 |
| Aviator Studio | client seeds 1, 2, 3 + server seed | `floor(96 * 2^52 / (2^52 - h)) / 100`, at least 1.00 |

`h` is the first 13 hexadecimal characters of the hash read as a number (52 bits).

## Use it

In the browser: open the page at https://betproof-app.github.io/aviator-round-verifier/ and paste the seeds.

From the command line (Node 18+, no dependencies):

```bash
node verify.mjs studio <server seed> <client seed 1> <client seed 2> <client seed 3>
```

As a module:

```js
import { verifyRound } from './verify.mjs'
const r = await verifyRound({ serverSeed, clientSeeds: [c1, c2, c3], build: 'spribe' })
console.log(r.result) // the multiplier
```

## Tests

`npm test` rebuilds six real rounds: two from the Spribe version, four from the Aviator Studio version, including a 699.43x round and a round that the formula puts at 0.96 and the game shows at its floor of 1.00x.

## What it cannot do

It cannot predict a round. The server seed is shown only after the round, and SHA-512 gives no shortcut. In the Spribe version the chance of reaching a multiplier `x` is about `0.97 / x`, so every cash-out target returns about 97% of the stake in the long run.

## More

The same check, plus calculators for crash, Mines, Plinko and other instant games, is at [betproof.app](https://betproof.app/tools/aviator-verifier/).

Licence: MIT, (c) 2026 BetLot Ltd.
