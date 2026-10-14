import { randomUUID } from "crypto";

const WIN_EPOCH = 11644473600;
const S_TO_NS = 1e9;
export const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
export const SEC_MS_GEC_VERSION = "2-143.0.3650.75";

const _SHA256_INITIAL = [
  0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
  0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19
];
const _SHA256_STATE = [
  0xFD9FBEA2, 0x91243CE7, 0xBE499094, 0xCD2E1E0A,
  0x6C006F49, 0x04BD35AB, 0xFEB0A7E4, 0x03EFFBD2
];
const _SHA256_SCHEDULE = [
  0xEB24BF9E, 0x1558691F, 0xA0C09EE2, 0x0CFA32BA,
  0xA622EE8C, 0xD1DD9491, 0xC0DD25A0, 0xF9E70AB6,
  0xF0C31573, 0x7058CE4E, 0x7188E606, 0x00E5AB33,
  0xD258B060, 0x72766564
];
const _SHA256_ROUND_CONSTANTS = [
  0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
  0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
  0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
  0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
  0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
  0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
  0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
  0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
  0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
  0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
  0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
  0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
  0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
  0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
  0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
  0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
];
const _SHA256_BLOCK_CONSTANTS = [
  ..._SHA256_ROUND_CONSTANTS.slice(0, 14),
  0xC9DC06A7,
  ..._SHA256_ROUND_CONSTANTS.slice(15)
];

const _CS64_COEFFICIENTS = [
  [0xE82E91B1, 0xB32700D0], [0x44DE24C6, 0x88DFF51D], [0x3BEB65BC, 0x29514038], [0xC89C5933, 0xB328CBDF],
  [0x8D1EC211, 0xD405B4D5], [0x314EF5D5, 0x26E55F3C], [0xE92491B1, 0x607801C6], [0xF0A5B9D5, 0x82B2C1FB],
  [0x06064CF3, 0xFA51A3DA], [0xDA79FA60, 0x207CC464], [0xBED20560, 0x3C3C74F3], [0x89F9C9F8, 0xD2D14B61],
  [0x35FA38C6, 0xBB04A2C1], [0xCB49E3C6, 0xC5626167]
];

function rol16(v: number): number {
  return (((v << 16) | (v >>> 16)) >>> 0);
}

function sigma0(v: number): number {
  return (((v >>> 7) | (v << 25)) ^ ((v >>> 18) | (v << 14)) ^ (v >>> 3)) >>> 0;
}

function sigma1(v: number): number {
  return (((v >>> 17) | (v << 15)) ^ ((v >>> 19) | (v << 13)) ^ (v >>> 10)) >>> 0;
}

function sha256Rounds(state: number[], words: number[], firstRound = 0): number[] {
  let [a, b, c, d, e, f, g, h] = state;
  const constants = firstRound === 14 ? _SHA256_BLOCK_CONSTANTS : _SHA256_ROUND_CONSTANTS;
  const aligned = Math.min(64, Math.floor((firstRound + 7) / 8) * 8);

  for (let index = firstRound; index < aligned; index++) {
    const s1 = (((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))) >>> 0;
    const ch = ((e & f) ^ ((~e) & g)) >>> 0;
    const t1 = (h + s1 + ch + constants[index] + words[index]) >>> 0;
    const s0 = (((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))) >>> 0;
    const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
    const t2 = (s0 + maj) >>> 0;
    h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
  }
  for (let index = aligned; index < 64; index++) {
    const s1 = (((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))) >>> 0;
    const ch = ((e & f) ^ ((~e) & g)) >>> 0;
    const t1 = (h + s1 + ch + constants[index] + words[index]) >>> 0;
    const s0 = (((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))) >>> 0;
    const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
    const t2 = (s0 + maj) >>> 0;
    h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
  }
  return [a, b, c, d, e, f, g, h];
}

function expandSha256Schedule(words: number[], firstWord = 16): void {
  for (let index = firstWord; index < 64; index++) {
    const x = words[index - 2], y = words[index - 15];
    const s1 = (((x >>> 17) | (x << 15)) ^ ((x >>> 19) | (x << 13)) ^ (x >>> 10)) >>> 0;
    const s0 = (((y >>> 7) | (y << 25)) ^ ((y >>> 18) | (y << 14)) ^ (y >>> 3)) >>> 0;
    words[index] = (s1 + words[index - 7] + s0 + words[index - 16]) >>> 0;
  }
}

function sha256Init(data: Buffer): number[] {
  const words = new Array(14).fill(0);
  words.push(Buffer.from(data.subarray(0, 3)).readUIntBE(0, 3));
  words.push(Buffer.from(data.subarray(3, 7)).readUInt32BE(0));
  for (let index = 16; index < 30; index++) {
    let value = _SHA256_SCHEDULE[index - 16];
    if (index - 2 >= 14) value += (index === 16 ? (sigma1(words[index - 2]) ^ 0x000B92C0) : sigma1(words[index - 2])) >>> 0;
    if (index - 7 >= 14) value += words[index - 7];
    if (index - 15 >= 14) value += (index === 29 ? (sigma0(words[index - 15]) ^ 0x059C0B80) : sigma0(words[index - 15])) >>> 0;
    words.push(value >>> 0);
  }
  words.push((sigma1(words[28]) + words[23] + sigma0(words[15]) + words[14] + 0xC9DC06A7 - _SHA256_ROUND_CONSTANTS[14]) >>> 0);
  expandSha256Schedule(words, 31);
  const working = sha256Rounds(_SHA256_STATE, words, 14);
  return _SHA256_INITIAL.map((x, i) => (x + working[i]) >>> 0);
}

function sha256Digest(data: Buffer): Buffer {
  const length = 57 + data.length;
  const padZeroLen = (55 - length) % 64 >= 0 ? (55 - length) % 64 : (55 - length) % 64 + 64;
  const bitBuf = Buffer.alloc(8);
  bitBuf.writeBigUInt64BE(BigInt(length * 8));
  const padded = Buffer.concat([data.subarray(7), Buffer.from([0x80]), Buffer.alloc(padZeroLen), bitBuf]);

  let state = sha256Init(data.subarray(0, 7));
  for (let offset = 0; offset < padded.length; offset += 64) {
    const words: number[] = [];
    for (let i = 0; i < 64; i += 4) words.push(padded.readUInt32BE(offset + i));
    expandSha256Schedule(words);
    const working = sha256Rounds(state, words);
    state = state.map((x, i) => (x + working[i]) >>> 0);
  }
  const out = Buffer.alloc(32);
  state.forEach((w, i) => out.writeUInt32BE(w, i * 4));
  return out;
}

function cs64Digest(data: Buffer, digest: Buffer): [number, number] {
  const keyA = digest.readUInt32LE(0) | 1;
  const keyB = digest.readUInt32LE(4) | 1;
  const factors = [
    Number((BigInt(keyA) * 0x82893933n) & 0xFFFFFFFFn) >>> 0,
    Number((BigInt(keyB) * 0x82893933n) & 0xFFFFFFFFn) >>> 0
  ];
  const terms = _CS64_COEFFICIENTS.map(([coef], index) => Number((BigInt(coef) * BigInt(factors[index % 2])) & 0xFFFFFFFFn) >>> 0);
  const offsets = _CS64_COEFFICIENTS.map(([, off]) => off);

  const padLen = (-data.length - 1) & 3;
  const padded = Buffer.concat([Buffer.from([0]), data, Buffer.alloc(padLen)]);
  const leWords: number[] = [];
  for (let i = 0; i < padded.length; i += 4) leWords.push(padded.readUInt32LE(i));
  if (leWords.length % 2 !== 0) leWords.push(0);

  for (let index = 0; index < leWords.length; index++) {
    const word = leWords[index];
    const key = index % 2 === 0 ? keyA : keyB;
    const factorOffset = index % 2 === 0 ? 0xEF0569FB : 0xC31713DB;
    let termBig = BigInt(word) * BigInt(key);
    let offsetBig = BigInt(rol16(word)) * BigInt(factorOffset);
    if (index === 0) {
      termBig += 0xF2F90B1An * BigInt(factors[0]);
      offsetBig += 0x0B1A0000n;
    }
    terms.push(Number(termBig & 0xFFFFFFFFn) >>> 0);
    offsets.push(Number(offsetBig & 0xFFFFFFFFn) >>> 0);
  }

  let swapAcc = 0, swapLast = 0, state = 0, acc = 0;
  for (let index = 0; index < terms.length; index += 2) {
    const x = terms[index], y = terms[index + 1];
    const t = rol16((offsets[index] + x) >>> 0);
    const q = Number((BigInt(t) * 0x76F50F34n) & 0xFFFFFFFFn) >>> 0;
    swapAcc = (swapAcc + Number((BigInt(rol16(q)) * 0xC3EFEA97n + BigInt(q)) & 0xFFFFFFFFn)) >>> 0;

    const t2 = rol16((offsets[index + 1] + y) >>> 0);
    const q2 = Number((BigInt(t2) * 0x1881CE3Cn) & 0xFFFFFFFFn) >>> 0;
    swapLast = Number((BigInt(rol16(q2)) * 0x35BD1EC9n + BigInt(q2)) & 0xFFFFFFFFn) >>> 0;
    swapAcc = (swapAcc + swapLast) >>> 0;

    state = Number((BigInt(state) * BigInt(keyA) + BigInt(x)) & 0xFFFFFFFFn) >>> 0;
    state = Number((BigInt(rol16(state)) * 0xCF98B111n) & 0xFFFFFFFFn) >>> 0;
    state = Number((BigInt(rol16(state)) * 0x87085B9Fn) & 0xFFFFFFFFn) >>> 0;
    state = Number((BigInt(rol16(state)) * 0x12CEB96Dn) & 0xFFFFFFFFn) >>> 0;
    state = Number((BigInt(rol16(state)) * 0x257E1D83n) & 0xFFFFFFFFn) >>> 0;
    acc = (acc + state) >>> 0;

    const t3 = Number((BigInt(state) * BigInt(keyB) + BigInt(y)) & 0xFFFFFFFFn) >>> 0;
    const t4 = Number((BigInt(rol16(t3)) * 0xA27416F5n) & 0xFFFFFFFFn) >>> 0;
    const t5 = Number((BigInt(rol16(t4)) * 0xD38396FFn) & 0xFFFFFFFFn) >>> 0;
    state = Number((BigInt(rol16(Number((BigInt(rol16(t5)) * 0x7C932B89n) & 0xFFFFFFFFn) >>> 0)) * 0xBFA49F69n) & 0xFFFFFFFFn) >>> 0;
    acc = (acc + state) >>> 0;
  }
  return [(swapLast ^ state) >>> 0, (swapAcc ^ acc) >>> 0];
}

/**
 * Generates the Sec-MS-GEC v2 token required for Microsoft Edge Read Aloud TTS.
 */
export function generateSecMsGecV2(unixTimestamp?: number): string {
  let ticks = (unixTimestamp !== undefined ? unixTimestamp : Date.now() / 1000) + WIN_EPOCH;
  ticks -= ticks % 300;
  ticks *= S_TO_NS / 100;
  const strToHash = Buffer.from(Math.round(ticks) + TRUSTED_CLIENT_TOKEN, "ascii");
  const digest = sha256Digest(strToHash);
  const cs64Words = cs64Digest(strToHash, digest);
  const cs64Buf = Buffer.alloc(8);
  cs64Buf.writeUInt32LE(cs64Words[0], 0);
  cs64Buf.writeUInt32LE(cs64Words[1], 4);
  return cs64Buf.toString("hex").toUpperCase() + "-" + digest.toString("hex").toUpperCase();
}

/**
 * Returns the authenticated WebSocket URL for Edge TTS speech synthesis.
 */
export function getEdgeSynthUrl(connectionId?: string): string {
  const reqId = connectionId || randomUUID().replace(/-/g, "");
  const token = generateSecMsGecV2();
  return `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&Sec-MS-GEC=${token}&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}&ConnectionId=${reqId}`;
}
