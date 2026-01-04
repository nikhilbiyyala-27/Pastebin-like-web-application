import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getNow } from '@/lib/time'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params

    try {
        // 1. Fetch paste
        const paste = await prisma.paste.findUnique({
            where: { slug }
        })

        if (!paste) {
            return NextResponse.json({ error: 'Paste not found' }, { status: 404 })
        }

        // 2. Check Expiry (TTL)
        const now = await getNow()

        if (paste.expiresAt && now > paste.expiresAt) {
            // Requirement: All unavailable cases must return HTTP 404
            return NextResponse.json({ error: 'Paste not found or expired' }, { status: 404 })
        }

        // 3. Check View Limits
        if (paste.maxViews !== null && paste.views >= paste.maxViews) {
            // Requirement: All unavailable cases must return HTTP 404
            return NextResponse.json({ error: 'Paste not found or limit reached' }, { status: 404 })
        }

        // 4. Increment View Count
        // We structure the query based on the current state to avoid passing null to lt.
        const whereClause: any = { slug }

        if (paste.maxViews !== null) {
            whereClause.views = { lt: paste.maxViews }
        }

        try {
            const result = await prisma.paste.updateMany({
                where: whereClause,
                data: { views: { increment: 1 } }
            })

            if (result.count === 0) {
                // Concurrent limit reached (or record deleted)
                return NextResponse.json({ error: 'Paste not found or limit reached' }, { status: 404 })
            }
        } catch (e) {
            console.error('Update failed:', e)
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }

        // 5. Return Response
        // Requirement: remaining_views may be null if unlimited
        let remaining_views: number | null = null
        if (paste.maxViews !== null) {
            // We just incremented views by 1 from the fetched `paste.views`.
            // So current views is paste.views + 1.
            // Remaining = maxViews - currentViews
            remaining_views = Math.max(0, paste.maxViews - (paste.views + 1))
        }

        return NextResponse.json({
            content: paste.content,
            remaining_views,
            expires_at: paste.expiresAt
        })

    } catch (error) {
        console.error('Error fetching paste:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
