import AdminTab from "@/components/admin-tab";
import Countdown from "@/components/countdown";
import FloatingFX from "@/components/floating-fx";
import Gallery from "@/components/gallery";
import Hero from "@/components/hero";
import InfoCards from "@/components/info-cards";
import Playlist from "@/components/playlist";
import RetroPopup from "@/components/retro-popup";
import RSVPQuiz from "@/components/rsvp-quiz";
import Trailer from "@/components/trailer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingFX />
      <div className="noise" />
      <AdminTab />
      <Hero />
      <Trailer />
      <InfoCards />
      <Countdown />
      <RSVPQuiz />
      <Gallery />
      <Playlist />
      <RetroPopup />
    </main>
  );
}
