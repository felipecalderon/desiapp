import {create} from 'zustand';

interface CodigodeBarra {
  value: string
  isSend: boolean
  setValue: (value: string) => void
  changeSend: (isSend: boolean) => void
}

const useStore = create<CodigodeBarra>((set) => ({
  value: '',
  isSend: false,
  setValue: (value: string) => set({ value }),
  changeSend: (isSend: boolean) => set({
    isSend: !isSend
  })
}));

export default useStore;