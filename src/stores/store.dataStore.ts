import { Store } from '@/config/interfaces';
import { create } from 'zustand';

interface StoreData {
	stores: Store[]
	store: Store | null,
	setStore: (store: Store | null) => void;
	setStores: (stores: Store[]) => void
	cleanStore: () => void;
}

const storeDataStore = create<StoreData>((set) => ({
	stores: [],
	store: null,
    setStore: (store) => set({store}),
	setStores: (stores) => set({stores}),
	cleanStore: () => set({store: null}),
}));

export default storeDataStore;
