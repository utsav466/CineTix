import Hero from "@/components/home/Hero";
import NowShowing from "@/components/home/NowShowing";
import ComingSoon from "@/components/home/ComingSoon";

export default function HomePage() {
  return (
    <main className="home-page">
      <Hero />

      <div className="home-content">
        <NowShowing />
        <ComingSoon />
      </div>
    </main>
  );
}