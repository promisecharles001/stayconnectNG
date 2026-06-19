const fs = require('fs');
const zlib = require('zlib');

// Generate a simple 1024x1024 square PNG with solid color #059669
const WIDTH = 1024;
const HEIGHT = 1024;
const R = 0x05;
const G = 0x96;
const B = 0x69;
const A = 0xFF;

function crc32(buffer) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < buffer.length; i++) {
    crc = table[(crc ^ buffer[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ -1) >>> 0;
}

function writeChunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const combined = Buffer.concat([typeBuffer, data]);
  const crc = crc32(combined);
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32BE(data.length, 0);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);
  return Buffer.concat([lengthBuffer, typeBuffer, data, crcBuffer]);
}

// PNG signature
const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

// IHDR chunk
const ihdrData = Buffer.alloc(13);
ihdrData.writeUInt32BE(WIDTH, 0);
ihdrData.writeUInt32BE(HEIGHT, 4);
ihdrData[8] = 8; // bit depth
ihdrData[9] = 6; // color type: RGBA
ihdrData[10] = 0; // compression
ihdrData[11] = 0; // filter method
ihdrData[12] = 0; // interlace
const ihdr = writeChunk('IHDR', ihdrData);

// Generate raw image data
const rowSize = 1 + WIDTH * 4; // 1 filter byte + RGBA per pixel
const rawData = Buffer.alloc(rowSize * HEIGHT);

for (let y = 0; y < HEIGHT; y++) {
  const rowOffset = y * rowSize;
  rawData[rowOffset] = 0; // filter: none
  for (let x = 0; x < WIDTH; x++) {
    const pixelOffset = rowOffset + 1 + x * 4;
    rawData[pixelOffset] = R;
    rawData[pixelOffset + 1] = G;
    rawData[pixelOffset + 2] = B;
    rawData[pixelOffset + 3] = A;
  }
}

// Compress with zlib
const compressed = zlib.deflateSync(rawData);
const idat = writeChunk('IDAT', compressed);

// IEND chunk
const iend = writeChunk('IEND', Buffer.alloc(0));

// Write file
const png = Buffer.concat([signature, ihdr, idat, iend]);
fs.writeFileSync('assets/logo.png', png);
console.log('Generated assets/logo.png (1024x1024)');
