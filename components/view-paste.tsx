'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ViewPaste({ slug }: { slug: string }) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [content, setContent] = useState('')
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)

    const fetchPaste = async () => {
        setStatus('loading')
        try {
            const res = await fetch(`/api/pastes/${slug}`)
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to load paste')
            }

            setContent(data.content)
            setStatus('success')
        } catch (err: any) {
            setError(err.message)
            setStatus('error')
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (status === 'idle') {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-xl max-w-md w-full text-center shadow-2xl">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Secure Paste</h2>
                <p className="text-zinc-400">
                    This paste requires manual activation to view. This prevents accidental views or bot crawling from consuming burn-after-read limits.
                </p>
                <button
                    onClick={fetchPaste}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                >
                    Reveal Content
                </button>
            </div>
        )
    }

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                <p className="mt-4 text-zinc-400 animate-pulse">Decrypting...</p>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="max-w-md w-full bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-red-400">Unable to View Paste</h3>
                <p className="text-zinc-400">{error}</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-300 transition-colors mt-4"
                >
                    Create New Paste
                </button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4">
            <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-t-xl border border-zinc-800 border-b-0">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <button
                    onClick={handleCopy}
                    className="text-xs font-medium px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 transition-colors flex items-center gap-2"
                >
                    {copied ? 'Copied!' : 'Copy Content'}
                    {!copied && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    )}
                </button>
            </div>
            <div className="relative">
                <textarea
                    readOnly
                    value={content}
                    className="w-full h-[60vh] p-6 bg-zinc-950/80 border border-zinc-800 rounded-b-xl rounded-tr-none font-mono text-sm leading-relaxed text-zinc-300 focus:outline-none resize-none"
                />
            </div>
            <div className="text-center pt-8">
                <a href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
                    Create another paste
                </a>
            </div>
        </div>
    )
}
