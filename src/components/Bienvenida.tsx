import FechaFormateada from '@/components/FechaFormat'
import HoraFormateada from '@/components/HoraFormateada'

const BienvenidaDashboard = () => {
    return (
        <div className="p-4 rounded-md">
            <h1 className="text-xl font-bold text-gray-800">¡Bienvenido Amun Outdoor!</h1>
            <p className="text-gray-600">
                {' '}
                <FechaFormateada /> / <HoraFormateada />
            </p>
            <hr className="my-3 opacity-20" />
            <h2 className="text-lg text-gray-800">Ventas del mes: 12</h2>
            <h2 className="text-lg text-gray-800">Total: $1.500.000 IVA Inc.</h2>
        </div>
    )
}

export default BienvenidaDashboard
