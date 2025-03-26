import { Producto } from '@/config/interfaces'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ClientData {
    rut: string
    razonsocial: string
    giro: string
    comuna: string
    email: string
}

interface QuoteItem extends Producto {
    quantity: number
    price: number
    availableModels: string
}

export interface Images {
    id: string
    src: string
    alt: string
}

interface Totals {
    netAmount: number
    IVA: number
    descuentos: number
    cargos: number
    total: number
}

interface CompanyInfo {
    name: string
    address: string
    email: string
    rut: string
}

interface BankInfo {
    bank: string
    account: string
    companyName: string
    rut: string
    email: string
}

interface FacturaInfo {
    nroFactura: number
    logoSrc: string
}

export interface CotizacionProps {
    quoteItems: QuoteItem[]
    horizontalImages: Images[]
    gridImages: Images[]
    clientData: ClientData
    totals: Totals
    companyInfo: CompanyInfo
    bankInfo: BankInfo
    facturaInfo: FacturaInfo
}

interface CotizacionActions {
    setClientData: (data: Partial<ClientData>) => void
    setQuoteItems: (quoteItems: QuoteItem[]) => void
    addQuoteItem: (quoteItem: QuoteItem) => void
    updateQuoteItem: (productId: string, data: Partial<QuoteItem>) => void
    removeQuoteItem: (productId: string) => void
    setTotals: (totals: Totals) => void
    updateTotals: (data: Partial<Totals>) => void
    setHorizontalImages: (images: Images[]) => void
    setGridImages: (images: Images[]) => void
    setCompanyInfo: (info: CompanyInfo) => void
    updateCompanyInfo: (data: Partial<CompanyInfo>) => void
    setBankInfo: (info: BankInfo) => void
    updateBankInfo: (data: Partial<BankInfo>) => void
    setFacturaInfo: (data: Partial<FacturaInfo>) => void
    resetCotizacion: () => void
}

export const useCotizacionStore = create(
    persist<CotizacionProps & CotizacionActions>(
        (set) => ({
            clientData: {
                comuna: '',
                email: '',
                giro: '',
                razonsocial: '',
                rut: '',
            },
            quoteItems: [],
            totals: {
                IVA: 0,
                netAmount: 0,
                total: 0,
                descuentos: 0,
                cargos: 0,
            },
            horizontalImages: [],
            gridImages: [],
            companyInfo: {
                name: 'D3SI SPA',
                address: 'ALMAGRO 593, PURÉN, LA ARAUCANÍA',
                email: 'alejandro.contreras@d3si.cl',
                rut: '77.058.146-K',
            },
            bankInfo: {
                bank: 'Banco de Chile',
                account: 'Cta Cte 144 032 6403',
                companyName: 'D3SI SpA',
                rut: '77.058.146-K',
                email: 'alejandro.contreras@d3si.cl',
            },
            facturaInfo: {
                nroFactura: 5101,
                logoSrc: '/media/two-brands-color.png',
            },

            // Acciones para actualizar cada campo
            setClientData: (data: Partial<ClientData>) => set((state) => ({ clientData: { ...state.clientData, ...data } })),
            setQuoteItems: (quoteItems: QuoteItem[]) => set({ quoteItems }),
            addQuoteItem: (quoteItem: QuoteItem) => set((state) => ({ quoteItems: [...state.quoteItems, quoteItem] })),
            updateQuoteItem: (productId: string, data: Partial<QuoteItem>) =>
                set((state) => ({
                    quoteItems: state.quoteItems.map((item) => (item.productID === productId ? { ...item, ...data } : item)),
                })),
            removeQuoteItem: (productId: string) =>
                set((state) => ({
                    quoteItems: state.quoteItems.filter((item) => item.productID !== productId),
                })),
            setTotals: (totals: Totals) => set({ totals }),
            updateTotals: (data: Partial<Totals>) => set((state) => ({ totals: { ...state.totals, ...data } })),
            setHorizontalImages: (images: Images[]) => set({ horizontalImages: images }),
            setGridImages: (images: Images[]) => set({ gridImages: images }),
            setCompanyInfo: (info: CompanyInfo) => set({ companyInfo: info }),
            updateCompanyInfo: (data: Partial<CompanyInfo>) =>
                set((state) => ({
                    companyInfo: { ...state.companyInfo, ...data },
                })),
            setBankInfo: (info: BankInfo) => set({ bankInfo: info }),
            updateBankInfo: (data: Partial<BankInfo>) =>
                set((state) => ({
                    bankInfo: { ...state.bankInfo, ...data },
                })),
            setFacturaInfo: (data) => set((state) => ({ facturaInfo: { ...state.facturaInfo, ...data } })),
            resetCotizacion: () =>
                set((state) => ({
                    ...state,
                    facturaInfo: {
                        ...state.facturaInfo,
                        nroFactura: state.facturaInfo.nroFactura + 1,
                    },
                    clientData: {
                        comuna: '',
                        email: '',
                        giro: '',
                        razonsocial: '',
                        rut: '',
                    },
                    quoteItems: [],
                    horizontalImages: [],
                    gridImages: [],
                    totals: {
                        IVA: 0,
                        netAmount: 0,
                        total: 0,
                        cargos: 0,
                        descuentos: 0,
                    },
                })),
        }),
        {
            name: 'cotizacion',
            getStorage: () => localStorage,
        }
    )
)
