// import Cotizacion from '@/components/Cotizacion'
import dynamic from 'next/dynamic'
const Cotizacion = dynamic(() => import('@/components/Cotizacion'), { ssr: false })
export default function CotizarPage() {
    return (
        <div className="px-10 py-6 bg-white w-full">
            <Cotizacion />
        </div>
    )
}
