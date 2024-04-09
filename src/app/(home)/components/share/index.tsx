"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import {
    Share,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

function ShareButton() {
    const { toast } = useToast()
    const [_, copy] = useCopyToClipboard()

    function onShare() {
        copy('https://github.com/fiqryq/ollama-ui')
            .then(() => {
                toast({
                    title: 'Link copied successfully',
                    description: "https://github.com/fiqryq/ollama-ui",
                })
            })
            .catch(error => {
                toast({
                    variant: 'destructive',
                    description: `Failed to copy!', ${error}`,
                })
            })
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm"
            onClick={() => onShare()}
        >
            <Share className="size-3.5" />
            Share
        </Button>
    )
}

export default ShareButton