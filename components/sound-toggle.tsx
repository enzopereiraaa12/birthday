"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";

export default function SoundToggle() {
  const audioRef = useRef<{ context: AudioContext; interval: number } | null>(null);
  const [enabled, setEnabled] = useState(false);

  const toggle = () => {
    if (enabled) {
      stopSound();
      setEnabled(false);
      return;
    }

    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    const context = new AudioCtor();
    const interval = window.setInterval(() => playSparkle(context), 2400);
    audioRef.current = { context, interval };
    playSparkle(context);
    setEnabled(true);
  };

  const stopSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    window.clearInterval(audio.interval);
    void audio.context.close();
    audioRef.current = null;
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed right-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/12 text-white shadow-chrome backdrop-blur-xl transition active:scale-95"
      aria-label={enabled ? "Disable sound" : "Enable sound"}
      title={enabled ? "Disable sound" : "Enable sound"}
    >
      {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

function playSparkle(context: AudioContext) {
  const now = context.currentTime;
  [660, 990, 1320].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.08);
    gain.gain.setValueAtTime(0, now + index * 0.08);
    gain.gain.linearRampToValueAtTime(0.045, now + index * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.42);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now + index * 0.08);
    oscillator.stop(now + index * 0.08 + 0.45);
  });
}
