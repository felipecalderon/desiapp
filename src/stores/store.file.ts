import { DTE } from '@/config/interfaces'
import { create } from 'zustand'

interface FileState {
    jsonFile: DTE | null
    setJsonFile: (jsonFile: DTE | null) => void
}

export const useFileStore = create<FileState>((set) => ({
    jsonFile: null,
    setJsonFile: (jsonFile) => set({ jsonFile }),
}))
