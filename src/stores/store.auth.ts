import {create} from 'zustand';

export type Menu = {
  name: string
  path: string
}

export interface AuthState {
  isLogged: boolean
  setIsLogged: (isLogged: boolean) => void
  adminMenu: Menu[],
  storeManagerMenu: Menu[],
  storeSellerMenu: Menu[],
  supplierMenu: Menu[],
}

const storeAuth = create<AuthState>((set) => ({
    isLogged: false,
    setIsLogged: (isLogged) => set({isLogged}),
    adminMenu: [
        { name: 'Home', path: '/' },
        { name: 'Stock', path: '/stock' },
        { name: 'Invoice', path: '/facturacion' },
        { name: 'Order', path: '/comprar' },
        { name: 'Quote', path: '/none' },
        { name: 'Returns', path: '/devoluciones' },
        { name: 'History', path: '/historial' },
        { name: 'Settings', path: '/settings' },
        { name: 'Legal', path: '/legales' }
      ],
      supplierMenu: [
        { name: 'Home', path: '/' },
        { name: 'Stock', path: '/stock' },
        { name: 'Invoice', path: '/facturacion' },
        { name: 'Order', path: '/comprar' },
        { name: 'Quote', path: '/none' },
        { name: 'Returns', path: '/devoluciones' },
        { name: 'History', path: '/historial' },
        { name: 'Settings', path: '/settings' },
        { name: 'Legal', path: '/legales' }
      ],
    storeManagerMenu: [
        { name: 'Inicio', path: '/' },
        { name: 'Vender', path: '/vender' },
        { name: 'Stock', path: '/stock' },
        { name: 'Facturación', path: '/facturacion' },
        { name: 'Comprar', path: '/comprar' },
        { name: 'Devoluciones', path: '/devoluciones' },
        { name: 'Historial', path: '/historial' },
        { name: 'Legales', path: '/legales' }
      ],
    storeSellerMenu: [
        { name: 'Comprar', path: '/comprar' },
        { name: 'Historial', path: '/historial' }
      ]
}));

export default storeAuth;