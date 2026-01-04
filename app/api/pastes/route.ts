import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { getNow } from '@/lib/time'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { content, ttl_seconds, max_views } = body

        if (!content || typeof content !== 'string' || content.length === 0) {
            return NextResponse.json({ error: 'Content is required and must be a non-empty string' }, { status: 400 })
        }

        let expiresAt: Date | null = null
        const now = await getNow()

        if (ttl_seconds !== undefined && ttl_seconds !== null) {
            if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
                return NextResponse.json({ error: 'ttl_seconds must be an integer >= 1' }, { status: 400 })
            }
            expiresAt = new Date(now.getTime() + ttl_seconds * 1000)
        }

        let maxViews: number | null = null
        if (max_views !== undefined && max_views !== null) {
            if (!Number.isInteger(max_views) || max_views < 1) {
                return NextResponse.json({ error: 'max_views must be an integer >= 1' }, { status: 400 })
            }
            maxViews = max_views
        }

        const slug = nanoid(10) // Short ID

        const paste = await prisma.paste.create({
            data: {
                slug,
                content,
                createdAt: now,
                expiresAt,
                maxViews,
                views: 0
            }
        })

        // Construct full URL
        const origin = new URL(request.url).origin
        const url = `${origin}/p/${paste.slug}`

        return NextResponse.json({
            id: paste.slug,
            url
        })

    } catch (error) {
        console.error('Error creating paste:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
