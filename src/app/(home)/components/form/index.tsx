"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { useSettings } from '@/context/LayoutProvider'
import { Switch } from "@/components/ui/switch"
import { Input } from '@/components/ui/input'

function SettingsForm() {
    const [model, applyModelList] = useState<Array<object>>([])
    const { settings, applySettings } = useSettings()

    const fetchData = async () => {
        try {
            const response = await fetch('/api/model', {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const model = await response.json()

            applyModelList(model)

        } catch (error) {
            return error
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <form className="grid w-full items-start gap-6">
            <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                    Settings
                </legend>
                <div className="grid gap-3">
                    <Label htmlFor="model">Model</Label>
                    <Select onValueChange={(model) => applySettings(prev => ({
                        ...prev,
                        model: model
                    }))}>
                        <SelectTrigger
                            id="model"
                            className="items-start [&_[data-description]]:hidden"
                        >
                            <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                            {model.map((items: Record<string, any>) => {
                                return (
                                    <SelectItem value={items.model} key={items.name} className="cursor-pointer">
                                        <div className="text-muted-foreground">
                                            <div className="grid gap-0.5">
                                                <p>
                                                    {items.name}
                                                </p>
                                                <p className="text-xs" data-description>
                                                    {items.model}
                                                </p>
                                            </div>
                                        </div>
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </fieldset>
            <fieldset className="flex flex-row items-center justify-between rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                    Custom prompt
                </legend>
                <div className="space-y-0.5">
                    <p className='text-sm text-muted-foreground'>
                        To activate this feature, enable the option for using a custom prompt.
                    </p>
                </div>
                <Switch
                    checked={settings.custom}
                    onCheckedChange={() => applySettings(prev => ({
                        ...prev,
                        custom: !settings.custom
                    }))}
                />
            </fieldset>
            {settings.custom ? (
                <fieldset className="grid gap-6 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">
                        Messages
                    </legend>
                    <div className="grid gap-3">
                        <Label htmlFor="temperature">Temperature</Label>
                        <Input id="temperature" type="number" placeholder="0.4" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="top-p">Top P</Label>
                            <Input id="top-p" type="number" placeholder="0.7" />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="top-k">Top K</Label>
                            <Input id="top-k" type="number" placeholder="0.0" />
                        </div>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="role">Role</Label>
                        <Select defaultValue="system">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="system">System</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="assistant">Assistant</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            placeholder="You are a..."
                            className="min-h-[9.5rem]"
                        />
                    </div>
                </fieldset>
            ) : null}
        </form>
    )
}

export default SettingsForm