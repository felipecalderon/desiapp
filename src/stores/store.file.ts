import { Detalle, DTE } from '@/config/interfaces'
import { create } from 'zustand'

interface FileState {
    jsonFile: Detalle[] | Detalle | null
    jsonExcel: any
    setJsonExcel: (jsonExcel: any) => void
    setJsonFile: (jsonFile: Detalle[] | Detalle | null) => void
}

export const useFileStore = create<FileState>((set) => ({
    jsonFile: null,
    jsonExcel: null,
    setJsonExcel: (jsonExcel) => set({ jsonExcel }),
    setJsonFile: (jsonFile) => set({ jsonFile }),
}))
