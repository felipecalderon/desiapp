import {create} from 'zustand';

interface AuthState {
  isLogged: boolean
  setIsLogged: (isLogged: boolean) => void
}

const storeAuth = create<AuthState>((set) => ({
    isLogged: false,
    setIsLogged: (isLogged) => set({isLogged})
}));

export default storeAuth;