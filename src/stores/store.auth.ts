import { User } from '@/config/interfaces'
import {create} from 'zustand'


export interface AuthState {
  isLogged: boolean
  setIsLogged: (isLogged: boolean) => void
  user: User | null,
  setUser: (user: User | null) => void,
  isLoadingUser: boolean,
  setIsLoading: (isLoadingUser: boolean) => void,
  users: User[],
	setUsers: (users: User[]) => void;
}

const storeAuth = create<AuthState>((set) => ({
    isLogged: false,
    isLoadingUser: true,
    users: [],
    setUsers: (users: User[]) => set({users}),
    setIsLoading: (isLoadingUser: boolean) => set({isLoadingUser}),
    setIsLogged: (isLogged) => set({isLogged}),
    user: null,
    setUser: (user) => set({user})
}))

export default storeAuth