import fs from 'fs';
import zlib from 'zlib';

function createPNG(size, bgR, bgG, bgB, accentR, accentG, accentB) {
  const width = size;
  const height = size;
  
  // Create raw RGBA buffer with filter byte (0) per row
  const rowLength = 1 + width * 4;
  const rawData = Buffer.alloc(rowLength * height);

  const cx = width / 2;
  const cy = height / 2;
  const outerR = width * 0.42;
  const eyeR = width * 0.18;
  const pupilR = width * 0.08;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter type None
    
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Check if inside outer rounded shield / eye symbol
      const isReticleRing = Math.abs(dist - outerR) < (width * 0.025);
      const isEyeOuter = Math.abs(dist - eyeR) < (width * 0.02);
      const isPupil = dist < pupilR;

      if (isReticleRing || isEyeOuter || isPupil) {
        rawData[pixelOffset] = accentR;
        rawData[pixelOffset + 1] = accentG;
        rawData[pixelOffset + 2] = accentB;
        rawData[pixelOffset + 3] = 255;
      } else {
        // Deep forensic slate background
        rawData[pixelOffset] = bgR;
        rawData[pixelOffset + 1] = bgG;
        rawData[pixelOffset + 2] = bgB;
        rawData[pixelOffset + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Header
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);

    // CRC32
    let crc = 0xffffffff;
    for (let i = 4; i < 8 + len; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        if ((crc ^ byte) & 1) {
          crc = (crc >>> 1) ^ 0xedb88320;
        } else {
          crc = crc >>> 1;
        }
        byte = byte >>> 1;
      }
    }
    crc = (crc ^ 0xffffffff) >>> 0;
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}

fs.writeFileSync('./public/pwa-192x192.png', createPNG(192, 2, 6, 23, 245, 158, 11));
fs.writeFileSync('./public/pwa-512x512.png', createPNG(512, 2, 6, 23, 245, 158, 11));
fs.writeFileSync('./public/apple-touch-icon.png', createPNG(180, 2, 6, 23, 245, 158, 11));

console.log('Successfully generated PWA PNG icons in ./public');
