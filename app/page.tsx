import AdminTab from "@/components/admin-tab";
import Countdown from "@/components/countdown";
import FloatingFX from "@/components/floating-fx";
import Gallery from "@/components/gallery";
import Hero from "@/components/hero";
import InfoCards from "@/components/info-cards";
import MarqueeBar from "@/components/marquee-bar";
import QueueGate from "@/components/queue-gate";
import ReserveBar from "@/components/reserve-bar";
import RetroPopup from "@/components/retro-popup";
import ScrollManager from "@/components/scroll-manager";
import Trailer from "@/components/trailer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ScrollManager />
      <FloatingFX />
      <div className="aurora-bg" />
      <div className="noise" />
      <AdminTab />
      <ReserveBar />
      <Hero />
      <MarqueeBar />
      <Trailer />
      <InfoCards />
      <Countdown />
      <QueueGate />
      <MarqueeBar reverse items={["GUEST LIST", "PINK VIP", "ADMIT ONE", "DRESS CODE PINK", "PLACES LIMITÉES", "22 ANS"]} />
      <Gallery />
      <RetroPopup />
    </main>
  );
}
