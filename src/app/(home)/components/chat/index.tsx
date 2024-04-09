"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Paperclip, Mic, CornerDownLeft, Loader2 } from 'lucide-react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import React, { useState } from 'react'
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useSettings } from '@/context/LayoutProvider'
import { useToast } from "@/components/ui/use-toast"
import { Ollama } from "@langchain/community/llms/ollama";

interface InterfaceState {
    loading: boolean
    error: boolean
    streaming: boolean
    message: string
}

interface GeneratedResponse {
    messages: {
        content: string
        role: string
    }
}

const formSchema = z.object({
    content: z.string().min(1, {
        message: "Please enter your messages.",
    }),
})

function ChatBlock() {
    const [interfaceState, applyInterfaceState] = useState<InterfaceState>({
        streaming: false,
        loading: false,
        error: false,
        message: ''
    })

    const [generatedResponse, applyGeneratedResponse] = useState<Array<{
        role: 'user' | 'assistant',
        message: string
    }>>([]);

    const [streamingAnswer, applyStreamingAnswer] = useState<string>('');

    const { settings } = useSettings()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        },
    })
    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {

            if (settings.model === '') {
                toast({
                    description: "Kindly choose a model first.",
                })
                return
            }

            form.reset()

            applyGeneratedResponse(prevResponses => [
                ...prevResponses,
                { role: 'user', message: data.content },
            ]);

            let questionArray = []
            let response: string = '';

            const ollama = new Ollama({
                baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
                model: settings.model,
                callbacks: [
                    {
                        handleLLMStart() {
                            applyInterfaceState(prev => ({ ...prev, loading: true, streaming: true }))
                        }
                    },
                    {
                        handleLLMEnd() {
                            applyStreamingAnswer('')
                            applyInterfaceState(prev => ({ ...prev, loading: false, streaming: false }))
                        }
                    },
                    {
                        handleLLMError() {
                            applyInterfaceState(prev => ({ ...prev, loading: false, streaming: false, error: true }))
                            toast({
                                variant: 'destructive',
                                description: "Apologies, unable to generate response.",
                            })
                        }
                    }
                ]
            });

            const stream = await ollama.stream(data.content)

            questionArray.push(data.content)

            for await (const chunk of stream) {
                response += chunk;
                applyStreamingAnswer(response);
            }

            applyGeneratedResponse(prevResponses => [
                ...prevResponses,
                { role: 'assistant', message: response }
            ]);

        } catch (error) {
            applyInterfaceState(prev => ({ ...prev, error: true, }));
            toast({
                variant: 'destructive',
                description: "Apologies, unable to generate response.",
            });
        }
    }


    return (
        <div className="relative flex no-scrollbar h-full max-h-screen overflow-y-auto min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <Badge variant='outline' className="absolute right-3 top-3">
                Output
            </Badge>
            <div className="flex-1 pb-3">
                <div>
                    {generatedResponse.map((item, index) => (
                        <div key={index}>
                            {item.role === 'user' ? (
                                <fieldset className="flex flex-row items-center justify-between border p-4 bg-slate-100 rounded-lg mb-3">
                                    <legend className="-ml-1 px-1 text-sm font-medium">
                                        You
                                    </legend>
                                    <div className="space-y-0.5">
                                        <p className='text-sm text-muted-foreground'>
                                            {item.message}
                                        </p>
                                    </div>
                                </fieldset>
                            ) : (
                                <fieldset className="flex flex-row items-center justify-between border p-4 bg-slate-100 rounded-lg mb-3">
                                    <legend className="-ml-1 px-1 text-sm font-medium">
                                        Ollama
                                    </legend>
                                    <div className="space-y-0.5">
                                        <p className='text-sm text-muted-foreground'>
                                            {item.message}

                                        </p>
                                    </div>
                                </fieldset>
                            )}

                        </div>
                    ))}
                    {interfaceState.streaming ? (
                        <fieldset className="flex flex-row items-center justify-between border p-4 bg-slate-100 rounded-lg mb-3">
                            <legend className="-ml-1 px-1 text-sm font-medium">
                                Ollama
                            </legend>
                            <div className="space-y-0.5">
                                <p className='text-sm text-muted-foreground'>
                                    {streamingAnswer}
                                </p>
                            </div>
                        </fieldset>
                    ) : null}
                </div>
            </div>
            <div className='sticky w-full bottom-0'>
                <Form {...form}>
                    <form
                        className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
                        x-chunk="dashboard-03-chunk-1"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            id="message"
                                            placeholder="Message Ollama..."
                                            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center p-3 pt-0">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Paperclip className="size-4" />
                                        <span className="sr-only">Attach file</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Attach File</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Mic className="size-4" />
                                        <span className="sr-only">Use Microphone</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Use Microphone</TooltipContent>
                            </Tooltip>
                            <Button disabled={interfaceState.loading} type="submit" size="sm" className="ml-auto gap-1.5">
                                {interfaceState.loading ? 'Generating response' : 'Send Message'}
                                {interfaceState.loading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<CornerDownLeft className="size-3.5" />)}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default ChatBlock