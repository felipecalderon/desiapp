import { Store } from '@/config/interfaces';
import { create } from 'zustand';


interface StoreData {
	store: Store | null,
	setStore: (store: Store) => void;
}

const storeDataStore = create<StoreData>((set) => ({
	store: null,
    setStore: (store) => set({store}),
}));

export default storeDataStore;
