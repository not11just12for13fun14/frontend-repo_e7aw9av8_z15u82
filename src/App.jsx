import Hero from './components/Hero'
import EventCreator from './components/EventCreator'
import QRScanner from './components/QRScanner'

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <EventCreator />
      <QRScanner />
      <footer className="py-10 text-center text-slate-500 text-sm bg-black border-t border-slate-900">
        Built for modern events • Secure payments ready • Lightning-fast check-in
      </footer>
    </div>
  )
}

export default App
