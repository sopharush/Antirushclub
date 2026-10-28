import { createContext, useContext, useState, type ReactNode } from 'react'

type ReadyState = { ready: boolean; setReady: (v: boolean) => void }

const ReadyContext = createContext<ReadyState>({ ready: false, setReady: () => {} })

export function ReadyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  return <ReadyContext.Provider value={{ ready, setReady }}>{children}</ReadyContext.Provider>
}

export const useReady = () => useContext(ReadyContext)
