import { Disc3, Music2 } from "lucide-react";
import { PLAYLIST_EMBED_SRC } from "@/lib/event-config";
import SectionReveal from "./section-reveal";

export default function Playlist() {
  return (
    <SectionReveal className="relative z-20 px-5 pb-24 pt-12 sm:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/20 bg-black/28 p-5 shadow-glossy backdrop-blur-2xl sm:p-7">
        <div className="mb-6 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-pink-300/18 text-pink-100">
            <Disc3 className="animate-spin" style={{ animationDuration: "6s" }} />
          </div>
          <div>
            <p className="font-display text-xs uppercase tracking-[0.28em] text-pink-200">playlist</p>
            <h2 className="font-display text-2xl font-black uppercase text-white">MSN player deluxe</h2>
          </div>
        </div>

        {PLAYLIST_EMBED_SRC ? (
          <iframe
            src={PLAYLIST_EMBED_SRC}
            className="h-40 w-full rounded-[1.2rem]"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        ) : (
          <div className="flex min-h-36 items-center gap-4 rounded-[1.4rem] border border-pink-100/20 bg-white/10 p-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-pink-200 to-pink-500 text-white shadow-chrome">
              <Music2 />
            </div>
            <div>
              <p className="font-bold text-white">Spotify / Apple Music embed</p>
              <p className="mt-1 text-sm leading-6 text-pink-50/72">
                Colle ton lien embed dans <span className="font-bold text-pink-100">PLAYLIST_EMBED_SRC</span>.
              </p>
            </div>
          </div>
        )}
      </div>
    </SectionReveal>
  );
}
