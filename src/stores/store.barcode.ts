import {create} from 'zustand'

interface CodigodeBarra {
  sku: string
  isSend: boolean
  setValue: (sku: string) => void
  changeSend: (isSend: boolean) => void
}

const useBarcode = create<CodigodeBarra>((set) => ({
  sku: '',
  isSend: false,
  setValue: (sku: string) => set({ sku }),
  changeSend: (isSend: boolean) => set({
    isSend: !isSend
  })
}))

export default useBarcode