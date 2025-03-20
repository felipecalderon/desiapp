// import Cotizacion from '@/components/Cotizacion'
import dynamic from 'next/dynamic'
const Cotizacion = dynamic(() => import('@/components/Cotizacion'), { ssr: false })
export default function CotizarPage() {
    return (
        <div className="max-w-5xl mx-auto p-6 bg-white">
            <Cotizacion />
        </div>
    )
}
