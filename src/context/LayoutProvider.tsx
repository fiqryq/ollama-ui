"use client"
import React, { createContext, useContext, useState } from 'react'

interface SettingsInterface {
    model: string
    custom?: boolean
}

interface LayoutContextInterface {
    settings: SettingsInterface
    applySettings: React.Dispatch<React.SetStateAction<SettingsInterface>>
}

const LayoutContext = createContext<LayoutContextInterface | undefined>(undefined)

function LayoutProvider({ children }: { children: React.ReactNode }) {

    const [settings, applySettings] = useState<SettingsInterface>({
        model: '',
        custom: false
    })

    return (
        <LayoutContext.Provider value={{ settings, applySettings }}>
            {children}
        </LayoutContext.Provider>
    )
}

export function useSettings(): LayoutContextInterface {
    const context = useContext(LayoutContext)
    if (!context) {
        throw new Error('useSettings must be used within a LayoutProvider')
    }
    return context
}


export default LayoutProvider