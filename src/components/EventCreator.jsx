import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function EventCreator() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', venue: '' })

  const load = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/events`)
      const data = await res.json()
      setEvents(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      setForm({ title: '', description: '', venue: '' })
      await load()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="create" className="relative py-16 bg-slate-900">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-semibold text-white">Create an event</h2>
          <p className="text-slate-300 mt-2">Set up your event in seconds.</p>

          <form onSubmit={create} className="mt-6 space-y-4">
            <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Title" className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700 text-white placeholder-slate-400" required />
            <input value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder="Description" className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700 text-white placeholder-slate-400" />
            <input value={form.venue} onChange={e=>setForm({...form, venue:e.target.value})} placeholder="Venue" className="w-full px-4 py-3 rounded-lg bg-slate-800/70 border border-slate-700 text-white placeholder-slate-400" />
            <button disabled={loading} className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium disabled:opacity-60">{loading? 'Creating...' : 'Create Event'}</button>
          </form>
        </div>
        <div>
          <h3 className="text-white font-semibold">Your events</h3>
          <ul className="mt-4 space-y-3">
            {events.map(ev => (
              <li key={ev.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                <div className="text-white font-medium">{ev.title}</div>
                <div className="text-slate-400 text-sm">{ev.venue || '—'}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
