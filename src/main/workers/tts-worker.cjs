(async () => {
  const { KokoroTTS } = await import('kokoro-js');
  // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
  const path = require('path');

  const modelPath = path.join(__dirname, '../../../node_modules/kokoro-models');

  console.log('Worker starting...');
  const tts = await KokoroTTS.from_pretrained(modelPath, { dtype: 'q4' });
  console.log('Model loaded!');
  console.log('supported voices', Object.keys(tts));
  console.log('Sending ready signal...');
  console.log('process.send exists?', typeof process.send);

  if (process.send) {
    process.send({ ready: true });
    console.log('Ready signal sent!');
  } else {
    console.error('ERROR: process.send not available!');
  }

  process.on('message', async (msg) => {
    console.log('Received message:', msg);
    try {
      const { text, voice } = msg;
      console.log('Generating audio...');

      const audio = await tts.generate(text, { voice });
      console.log('Audio generated, converting to buffer...');

      const buffer = Buffer.from(audio.audio.buffer);
      console.log('Sending response, buffer size:', buffer.length);

      process.send({
        audio: buffer.toString('base64'),
        sampleRate: audio.sampleRate,
      });

      console.log('Response sent!');
    } catch (error) {
      console.log('Error during generation:', error);
      process.send({ error: error.message });
    }
  });
})();
