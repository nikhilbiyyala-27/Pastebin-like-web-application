import Link from 'next/link'

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-zinc-950 text-center">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl -z-10" />

            <div className="space-y-6 max-w-md">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h2 className="text-3xl font-bold text-white">Paste Unavailable</h2>

                <p className="text-zinc-400">
                    This paste is not accessible. It may have:
                </p>

                <ul className="text-left text-sm text-zinc-500 space-y-2 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Expired automatically (TTL reached)
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Reached its view limit (Burn after read)
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Never existed (Invalid ID)
                    </li>
                </ul>

                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-white text-zinc-950 font-bold rounded-lg hover:bg-zinc-200 transition-colors"
                >
                    Create New Paste
                </Link>
            </div>
        </main>
    )
}
