'use client'

import { useState } from 'react'
import { LinkIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function CopyButton({ url }: { url?: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            const textToCopy = url || window.location.href
            await navigator.clipboard.writeText(textToCopy)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy', err)
        }
    }

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-all sm:text-sm"
            title="Copy link to clipboard"
        >
            {copied ? (
                <>
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    <span>Copied!</span>
                </>
            ) : (
                <>
                    <LinkIcon className="w-4 h-4" />
                    <span>Copy Link</span>
                </>
            )}
        </button>
    )
}
