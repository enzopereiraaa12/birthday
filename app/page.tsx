import AdminTab from "@/components/admin-tab";
import Countdown from "@/components/countdown";
import FloatingFX from "@/components/floating-fx";
import Gallery from "@/components/gallery";
import Hero from "@/components/hero";
import InfoCards from "@/components/info-cards";
import JeuTab from "@/components/jeu-tab";
import MarqueeBar from "@/components/marquee-bar";
import QueueGate from "@/components/queue-gate";
import QuizTab from "@/components/quiz-tab";
import ReserveBar from "@/components/reserve-bar";
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
      <QuizTab />
      <JeuTab />
      <ReserveBar />
      <Hero />
      <MarqueeBar />
      <Trailer />
      <InfoCards />
      <Countdown />
      <QueueGate />
      <MarqueeBar reverse items={["GUEST LIST", "VIP ACCESS", "ADMIT ONE", "TOUCH OF PINK", "PLACES LIMITÉES", "22 ANS"]} />
      <Gallery />
    </main>
  );
}
