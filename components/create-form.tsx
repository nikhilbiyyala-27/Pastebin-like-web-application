'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateForm() {
    const [content, setContent] = useState('')
    const [ttlSeconds, setTtlSeconds] = useState<number>(0) // 0 = never
    const [maxViews, setMaxViews] = useState<number>(0) // 0 = unlimited
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/pastes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    ttl_seconds: ttlSeconds === 0 ? null : ttlSeconds,
                    max_views: maxViews === 0 ? null : maxViews
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create paste')
            }

            // Redirect to the new view page (API returns { id, url })
            router.push(`/p/${data.id}`)
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
                <label htmlFor="content" className="block text-sm font-medium text-zinc-400">
                    New Paste
                </label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your code or text here..."
                    className="w-full h-64 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none font-mono text-sm leading-relaxed text-white"
                    required
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-zinc-400 whitespace-nowrap">Expires:</label>
                        <select
                            value={ttlSeconds}
                            onChange={(e) => setTtlSeconds(Number(e.target.value))}
                            className="bg-zinc-800 border-zinc-700 text-zinc-300 rounded-lg py-2 px-3 text-sm hover:border-zinc-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer w-full"
                        >
                            <option value={0}>Never</option>
                            <option value={600}>10 Minutes</option>
                            <option value={3600}>1 Hour</option>
                            <option value={86400}>1 Day</option>
                            <option value={604800}>1 Week</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-zinc-400 whitespace-nowrap">Limit Views:</label>
                        <select
                            value={maxViews}
                            onChange={(e) => setMaxViews(Number(e.target.value))}
                            className="bg-zinc-800 border-zinc-700 text-zinc-300 rounded-lg py-2 px-3 text-sm hover:border-zinc-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer w-full"
                        >
                            <option value={0}>Unlimited</option>
                            <option value={1}>Burn after read (1)</option>
                            <option value={5}>5 Views</option>
                            <option value={10}>10 Views</option>
                            <option value={100}>100 Views</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !content}
                    className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                        'Create Paste'
                    )}
                </button>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                    {error}
                </div>
            )}
        </form>
    )
}
