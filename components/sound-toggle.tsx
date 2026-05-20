"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";

export default function SoundToggle() {
  const audioRef = useRef<{ context: AudioContext; interval: number } | null>(null);
  const [enabled, setEnabled] = useState(false);

  const toggle = async () => {
    if (enabled) {
      stopSound();
      setEnabled(false);
      return;
    }

    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    const context = new AudioCtor();
    await context.resume();
    const interval = window.setInterval(() => playRingtone(context), 5200);
    audioRef.current = { context, interval };
    playRingtone(context);
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
      onClick={() => void toggle()}
      className="fixed right-4 top-4 z-50 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-black/35 px-3 text-xs font-black uppercase tracking-[0.12em] text-white shadow-chrome backdrop-blur-xl transition active:scale-95"
      aria-label={enabled ? "Disable sound" : "Enable sound"}
      title={enabled ? "Disable sound" : "Enable sound"}
    >
      {enabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
      <span className="hidden sm:inline">{enabled ? "sound on" : "sound off"}</span>
    </button>
  );
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

function playRingtone(context: AudioContext) {
  const notes = [988, 1174, 1318, 1174, 1567, 1318];
  const now = context.currentTime;
  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.12);
    gain.gain.setValueAtTime(0.0001, now + index * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.075, now + index * 0.12 + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 0.11);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now + index * 0.12);
    oscillator.stop(now + index * 0.12 + 0.12);
  });
}
