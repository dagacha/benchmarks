const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioCtx();
  }
}

function playLaser() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(880, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.1);
}

function playExplosion(size) {
  if (!audioCtx) return;
  const bufferSize = audioCtx.sampleRate * 0.3;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = size > 100 ? 800 : 400;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  const vol = size > 100 ? 0.3 : 0.15;
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
  source.start(audioCtx.currentTime);
}

function playHit() {
  if (!audioCtx) return;
  const bufferSize = audioCtx.sampleRate * 0.05;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1);
  }
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  const gain = audioCtx.createGain();
  source.connect(gain);
  gain.connect(audioCtx.destination);
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  source.start(audioCtx.currentTime);
}

function playPowerup() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(523, audioCtx.currentTime);
  osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1);
  osc.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2);
  osc.frequency.setValueAtTime(1047, audioCtx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.4);
}

function playUnleashDrone() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(80, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.5);
  gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.5);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.5);
}

function playBossWarning() {
  if (!audioCtx) return;
  for (let i = 0; i < 3; i++) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime + i * 0.2);
    osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + i * 0.2 + 0.15);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime + i * 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.2 + 0.2);
    osc.start(audioCtx.currentTime + i * 0.2);
    osc.stop(audioCtx.currentTime + i * 0.2 + 0.2);
  }
}
