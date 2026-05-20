"use client";

import { motion } from "framer-motion";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import { EVENT, VIDEO_POSTER, VIDEO_SRC } from "@/lib/event-config";
import SectionReveal from "./section-reveal";

export default function Trailer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play().catch(() => undefined);
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = async () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (video.paused) {
      await video.play().catch(() => undefined);
      setPlaying(!video.paused);
    }
  };

  return (
    <SectionReveal className="relative z-20 px-5 py-14 sm:px-8">
      <div id="trailer" className="mx-auto max-w-6xl">
        <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/25 bg-black shadow-[0_24px_90px_rgba(255,105,180,.22)]">
          {VIDEO_SRC ? (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover opacity-75"
              poster={VIDEO_POSTER}
              autoPlay
              muted={muted}
              loop
              playsInline
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            >
              <source src={VIDEO_SRC} type="video/mp4" />
            </video>
          ) : (
            <img src={VIDEO_POSTER} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
          )}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,192,203,.08),rgba(0,0,0,.78)_72%)]" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/20 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-1/3 animate-scan bg-gradient-to-b from-transparent via-white/14 to-transparent" />
          <div className="absolute left-5 top-5 rounded-full border border-pink-100/40 bg-black/35 px-4 py-2 font-display text-[10px] uppercase tracking-[0.24em] text-pink-100 backdrop-blur-xl">
            camcorder 2004
          </div>

          <div className="relative z-10 flex min-h-[520px] flex-col justify-end p-6 sm:p-10">
            <div className="mb-5 flex gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={togglePlay}
                className="grid h-16 w-16 place-items-center rounded-full border border-white/50 bg-white/18 text-white shadow-chrome backdrop-blur-xl"
                aria-label={playing ? "Pause teaser video" : "Play teaser video"}
              >
                {playing ? <Pause fill="white" size={24} /> : <Play fill="white" size={24} />}
              </motion.button>
              {VIDEO_SRC && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={toggleMute}
                  className="grid h-16 w-16 place-items-center rounded-full border border-pink-100/45 bg-pink-300/18 text-white shadow-chrome backdrop-blur-xl"
                  aria-label={muted ? "Unmute teaser video" : "Mute teaser video"}
                >
                  {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </motion.button>
              )}
            </div>
            <p className="mb-3 font-display text-xs uppercase tracking-[0.28em] text-pink-200">
              official teaser
            </p>
            <h2 className="max-w-2xl text-balance font-display text-4xl font-black uppercase leading-tight text-white sm:text-6xl">
              {EVENT.teaserLine}
            </h2>
            <p className="mt-4 max-w-lg text-lg text-pink-50/82">{EVENT.teaserSubline}</p>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
