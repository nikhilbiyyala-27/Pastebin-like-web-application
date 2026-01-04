
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getNow } from '@/lib/time'
import CopyButton from '@/components/copy-button'

export default async function PastePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    try {
        const paste = await prisma.paste.findUnique({
            where: { slug: id }
        })

        if (!paste) {
            notFound()
        }

        const now = await getNow()

        // Check Expiry
        if (paste.expiresAt && now > paste.expiresAt) {
            notFound()
        }

        // Check View Limit
        if (paste.maxViews !== null && paste.views >= paste.maxViews) {
            notFound()
        }

        // Increment View Count
        const whereClause: any = { slug: id }
        if (paste.maxViews !== null) {
            whereClause.views = { lt: paste.maxViews }
        }

        try {
            const result = await prisma.paste.updateMany({
                where: whereClause,
                data: { views: { increment: 1 } }
            })

            if (result.count === 0) {
                notFound()
            }
        } catch (e) {
            console.error('Update failed:', e)
            notFound()
        }

        return (
            <main className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-zinc-950">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10" />

                <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent mb-12 opacity-50 absolute top-8 left-8">
                    Pastebin
                </h1>

                <div className="w-full max-w-4xl mx-auto space-y-4">
                    <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-t-xl border border-zinc-800 border-b-0">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-xs font-mono text-zinc-500 hidden sm:block">
                                {paste.maxViews ? `View ${paste.views + 1}/${paste.maxViews}` : 'Unlimited Views'}
                                {paste.expiresAt && ` • Expires ${paste.expiresAt.toLocaleString()}`}
                            </div>
                            <CopyButton />
                        </div>
                    </div>
                    <div className="relative">
                        <textarea
                            readOnly
                            value={paste.content}
                            className="w-full h-[60vh] p-6 bg-zinc-950/80 border border-zinc-800 rounded-b-xl rounded-tr-none font-mono text-sm leading-relaxed text-zinc-300 focus:outline-none resize-none"
                        />
                    </div>
                    <div className="text-center pt-8">
                        <a href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
                            Create another paste
                        </a>
                    </div>
                </div>
            </main>
        )

    } catch (error) {
        console.error('Error fetching paste:', error)
        notFound()
    }
}
