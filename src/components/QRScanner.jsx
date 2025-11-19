import { useEffect, useRef, useState } from 'react'

// Lightweight QR scanner using native BarcodeDetector if available (Chrome/Edge),
// otherwise fall back to input for token entry.
const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function QRScanner() {
  const videoRef = useRef(null)
  const [supported, setSupported] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [manual, setManual] = useState('')
  const [active, setActive] = useState(false)

  useEffect(() => {
    if ('BarcodeDetector' in window) {
      const formats = ['qr_code']
      // @ts-ignore
      const detector = new window.BarcodeDetector({ formats })
      setSupported(true)
    }
  }, [])

  useEffect(() => {
    if (!supported || !active) return

    let stream
    let raf
    // @ts-ignore
    const detector = new window.BarcodeDetector({ formats: ['qr_code'] })

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        const scan = async () => {
          if (!videoRef.current) return
          try {
            const bitmaps = await createImageBitmap(videoRef.current)
            const codes = await detector.detect(bitmaps)
            if (codes.length) {
              const token = codes[0].rawValue
              handleToken(token)
            }
          } catch (e) {}
          raf = requestAnimationFrame(scan)
        }
        scan()
      } catch (e) {
        setError('Camera access denied or unavailable')
      }
    }
    start()

    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, [supported, active])

  const handleToken = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/api/checkin/${encodeURIComponent(token)}`, { method: 'POST' })
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError('Failed to check in')
    }
  }

  const submitManual = (e) => {
    e.preventDefault()
    if (manual.trim()) handleToken(manual.trim())
  }

  return (
    <section id="scan" className="py-16 bg-black">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-2xl font-semibold text-white">QR Check-in</h2>
          <p className="text-slate-400 mt-2">Scan attendee QR codes to check them in instantly.</p>

          <div className="mt-6 space-y-4">
            <button onClick={()=>setActive(v=>!v)} className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium">{active ? 'Stop Scanner' : 'Start Scanner'}</button>
            {supported ? (
              <div className="rounded-xl overflow-hidden border border-slate-800">
                <video ref={videoRef} className="w-full aspect-video bg-slate-900" muted playsInline />
              </div>
            ) : (
              <div className="text-slate-400 text-sm">QR detection not supported in this browser. Use manual code entry.</div>
            )}

            <form onSubmit={submitManual} className="flex gap-2">
              <input value={manual} onChange={e=>setManual(e.target.value)} placeholder="Enter QR token" className="flex-1 px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500" />
              <button className="px-4 py-3 rounded-lg bg-white/10 text-white">Check In</button>
            </form>

            {result && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white">
                <pre className="whitespace-pre-wrap text-sm text-slate-300">{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
            {error && <div className="text-red-400 text-sm">{error}</div>}
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black p-6 border border-slate-800">
          <h3 className="text-white font-semibold">How it works</h3>
          <ul className="mt-4 space-y-3 text-slate-300 text-sm">
            <li>• Create an event</li>
            <li>• Add ticket types and sell orders</li>
            <li>• Each attendee gets a unique QR token</li>
            <li>• Scan or enter token to check-in on site</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
