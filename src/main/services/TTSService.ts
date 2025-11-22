/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable indent */
import { ChildProcess, fork } from 'child_process';
import { app } from 'electron';
import path from 'path';
import say from 'say';

export type Language = 'en' | 'ru' | 'es';

interface WorkerMessage {
  ready?: boolean;
  audio?: string;
  sampleRate?: number;
  error?: string;
}

class TTSService {
  private worker: ChildProcess | null = null;

  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    const workerPath = this.getWorkerPath();

    this.worker = fork(workerPath, [], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    });

    this.worker.stderr?.on('data', (data) => {
      console.error('Worker error:', data.toString());
    });

    const readyPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        return reject(new Error('Worker timeout'));
      }, 30000);

      const messageHandler = (msg: WorkerMessage) => {
        if (msg.ready) {
          clearTimeout(timeout);
          this.worker?.off('message', messageHandler);
          resolve();
        }
      };

      this.worker?.on('message', messageHandler);
    });

    await readyPromise;
    this.initialized = true;
  }

  async makeAudio(language: Language, phrase: string): Promise<Buffer> {
    if (!this.initialized) {
      throw new Error('TTSService not initialized. Call init() first.');
    }

    if (language === 'ru') {
      return this.generateRussianAudio(phrase);
    }

    return this.generateKokoroAudio(language, phrase);
  }

  private async generateKokoroAudio(language: Language, phrase: string): Promise<Buffer> {
    const voice = language === 'en' ? 'af_sky' : 'ef_dora';

    return new Promise((resolve, reject) => {
      const messageHandler = (msg: WorkerMessage) => {
        if (msg.error) {
          this.worker?.off('message', messageHandler);
          reject(new Error(msg.error));
          return;
        }

        if (msg.audio) {
          const sampleRate = msg.sampleRate || 24000;
          this.worker?.off('message', messageHandler);

          const audioBuffer = Buffer.from(msg.audio, 'base64');
          const audioData = new Float32Array(
            audioBuffer.buffer,
            audioBuffer.byteOffset,
            audioBuffer.length / 4,
          );
          const samples = this.convertToInt16(audioData);
          const wavBuffer = this.createWavFile(samples, sampleRate);

          resolve(wavBuffer);
        }
      };

      this.worker?.on('message', messageHandler);
      this.worker?.send({ text: phrase, voice });
    });
  }

  private async generateRussianAudio(phrase: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const tempFile = path.join(app.getPath('temp'), `tts-${Date.now()}.wav`);

      say.export(phrase, 'Yuri', 1.0, tempFile, (err) => {
        if (err) {
          reject(err);
          return;
        }

        const fs = require('fs');
        const wavBuffer = fs.readFileSync(tempFile);
        fs.unlinkSync(tempFile);

        resolve(wavBuffer);
      });
    });
  }

  private convertToInt16(audioData: Float32Array): Int16Array {
    const samples = new Int16Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      samples[i] = Math.max(-32768, Math.min(32767, audioData[i] * 32767));
    }
    return samples;
  }

  private createWavFile(samples: Int16Array, sampleRate: number): Buffer {
    const dataSize = samples.length * 2;
    const header = Buffer.alloc(44);

    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataSize, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20);
    header.writeUInt16LE(1, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * 2, 28);
    header.writeUInt16LE(2, 32);
    header.writeUInt16LE(16, 34);
    header.write('data', 36);
    header.writeUInt32LE(dataSize, 40);

    return Buffer.concat([header, Buffer.from(samples.buffer)]);
  }

  private getWorkerPath(): string {
    return app.isPackaged
      ? path.join(
          process.resourcesPath,
          'app.asar.unpacked',
          'dist',
          'main',
          'workers',
          'tts-worker.cjs',
        )
      : path.join(__dirname, '../workers/tts-worker.cjs');
  }

  destroy(): void {
    this.worker?.kill();
    this.worker = null;
    this.initialized = false;
  }
}

export const ttsService = new TTSService();
