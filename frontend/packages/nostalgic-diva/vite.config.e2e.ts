import react from '@vitejs/plugin-react';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// A quiet mono sine wave as a 16-bit PCM WAV.
function createWav(seconds: number, frequency = 440): Buffer {
	const sampleRate = 8000;
	const samples = Math.round(seconds * sampleRate);
	const buffer = Buffer.alloc(44 + samples * 2);

	buffer.write('RIFF', 0);
	buffer.writeUInt32LE(36 + samples * 2, 4);
	buffer.write('WAVE', 8);
	buffer.write('fmt ', 12);
	buffer.writeUInt32LE(16, 16);
	buffer.writeUInt16LE(1, 20); // PCM
	buffer.writeUInt16LE(1, 22); // mono
	buffer.writeUInt32LE(sampleRate, 24);
	buffer.writeUInt32LE(sampleRate * 2, 28);
	buffer.writeUInt16LE(2, 32);
	buffer.writeUInt16LE(16, 34);
	buffer.write('data', 36);
	buffer.writeUInt32LE(samples * 2, 40);
	for (let i = 0; i < samples; i++) {
		const value = Math.sin((2 * Math.PI * frequency * i) / sampleRate);
		buffer.writeInt16LE(Math.round(value * 1000), 44 + i * 2);
	}

	return buffer;
}

const fixturesDir = resolve(__dirname, 'node_modules/.e2e-fixtures');
mkdirSync(fixturesDir, { recursive: true });
writeFileSync(resolve(fixturesDir, 'short.wav'), createWav(1.5, 440));
writeFileSync(resolve(fixturesDir, 'long.wav'), createWav(30, 660));

// Serves the e2e harness in `e2e/app`, using the library source directly.
export default defineConfig({
	root: resolve(__dirname, 'e2e/app'),
	publicDir: fixturesDir,
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	plugins: [react()],
});
