import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/zks9uYILDPSX-UX6/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80" />
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_10px_40px_rgba(59,130,246,0.35)]">
          The Next-Gen Ticketing Platform
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-300">
          Sell tickets, manage attendees, and check in guests with lightning-fast QR scanning.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a href="#create" className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition">Create an Event</a>
          <a href="#scan" className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition">Open QR Scanner</a>
        </div>
      </div>
    </section>
  );
}
