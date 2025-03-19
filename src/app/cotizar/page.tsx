import Image from 'next/image'

export default function CotizarPage() {
    return (
        <div className="max-w-5xl mx-auto p-6 bg-white">
            {/* Logo and Header */}
            <div className="flex flex-col md:flex-row justify-between mb-6">
                <div className="md:w-3/5 mb-4 md:mb-0 flex flex-col">
                    <div className="flex items-center justify-start gap-3">
                        <Image src="/media/two-brands-color.png" alt="Logo" width={144} height={64} className="object-contain" />
                        <h2 className="text-5xl font-semibold text-sky-800">D3SI SPA</h2>
                    </div>
                    <div className="text-sm font-medium">
                        <p className="uppercase">VENTA AL POR MAYOR DE VESTUARIO, CALZADO, TECNOLOGÍA Y ACCESORIOS</p>
                        <p>ALMAGRO 593, PURÉN, LA ARAUCANÍA</p>
                        <p>alejandro.contreras@d3si.cl</p>
                    </div>
                </div>
                <div className="md:w-2/5 flex flex-col md:flex-row justify-end">
                    <div className="border-4 border-red-600 p-3">
                        <p className="font-bold">R.U.T.: 77.058.146-K</p>
                        <p className="font-bold">COTIZACIÓN ELECTRÓNICA</p>
                        <p className="font-bold">N° 1951</p>
                    </div>
                </div>
            </div>

            {/* Client Information */}
            <div className="bg-slate-100 p-4 mb-6 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p>
                            <span className="font-semibold">R.U.T.:</span> 69.200.000-6
                        </p>
                        <p>
                            <span className="font-semibold">RAZÓN SOCIAL:</span> I. Municipalidad de Purén
                        </p>
                        <p>
                            <span className="font-semibold">GIRO:</span> Administración Pública
                        </p>
                    </div>
                    <div>
                        <p>
                            <span className="font-semibold">COMUNA:</span> Purén
                        </p>
                        <p>
                            <span className="font-semibold">EMAIL:</span> contacto@munipuren.cl
                        </p>
                    </div>
                </div>
            </div>

            {/* Quote Details Table */}
            <div className="mb-6">
                <h2 className="font-bold text-lg bg-gray-200 p-2 mb-2">Detalle de la cotización</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-left">Ítem</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Modelos disponibles</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Cantidad</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Precio Neto</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Subtotal Neto</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">1</td>
                                <td className="border border-gray-300 px-4 py-2">Notebook HP 15"</td>
                                <td className="border border-gray-300 px-4 py-2">10</td>
                                <td className="border border-gray-300 px-4 py-2">$450.000</td>
                                <td className="border border-gray-300 px-4 py-2">$4.500.000</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">2</td>
                                <td className="border border-gray-300 px-4 py-2">Monitor Samsung 24"</td>
                                <td className="border border-gray-300 px-4 py-2">15</td>
                                <td className="border border-gray-300 px-4 py-2">$180.000</td>
                                <td className="border border-gray-300 px-4 py-2">$2.700.000</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">3</td>
                                <td className="border border-gray-300 px-4 py-2">Impresora Multifuncional</td>
                                <td className="border border-gray-300 px-4 py-2">5</td>
                                <td className="border border-gray-300 px-4 py-2">$320.000</td>
                                <td className="border border-gray-300 px-4 py-2">$1.600.000</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">4</td>
                                <td className="border border-gray-300 px-4 py-2">Escritorio Ejecutivo</td>
                                <td className="border border-gray-300 px-4 py-2">8</td>
                                <td className="border border-gray-300 px-4 py-2">$250.000</td>
                                <td className="border border-gray-300 px-4 py-2">$2.000.000</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">5</td>
                                <td className="border border-gray-300 px-4 py-2">Silla Ergonómica</td>
                                <td className="border border-gray-300 px-4 py-2">20</td>
                                <td className="border border-gray-300 px-4 py-2">$120.000</td>
                                <td className="border border-gray-300 px-4 py-2">$2.400.000</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">6</td>
                                <td className="border border-gray-300 px-4 py-2">Smartphone Samsung A53</td>
                                <td className="border border-gray-300 px-4 py-2">25</td>
                                <td className="border border-gray-300 px-4 py-2">$280.000</td>
                                <td className="border border-gray-300 px-4 py-2">$7.000.000</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">7</td>
                                <td className="border border-gray-300 px-4 py-2">Tablet Samsung Tab S7</td>
                                <td className="border border-gray-300 px-4 py-2">15</td>
                                <td className="border border-gray-300 px-4 py-2">$350.000</td>
                                <td className="border border-gray-300 px-4 py-2">$5.250.000</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">8</td>
                                <td className="border border-gray-300 px-4 py-2">Proyector Epson</td>
                                <td className="border border-gray-300 px-4 py-2">3</td>
                                <td className="border border-gray-300 px-4 py-2">$580.000</td>
                                <td className="border border-gray-300 px-4 py-2">$1.740.000</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">9</td>
                                <td className="border border-gray-300 px-4 py-2">Disco Duro Externo 2TB</td>
                                <td className="border border-gray-300 px-4 py-2">12</td>
                                <td className="border border-gray-300 px-4 py-2">$85.000</td>
                                <td className="border border-gray-300 px-4 py-2">$1.020.000</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">10</td>
                                <td className="border border-gray-300 px-4 py-2">Teclado y Mouse Inalámbrico</td>
                                <td className="border border-gray-300 px-4 py-2">30</td>
                                <td className="border border-gray-300 px-4 py-2">$40.450</td>
                                <td className="border border-gray-300 px-4 py-2">$1.213.500</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Discounts/Charges Table */}
            <div className="mb-6">
                <h2 className="font-bold text-lg bg-gray-200 p-2 mb-2">Descuentos/Cargos</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-left">Tipo (descuento/cargo)</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Porcentaje de descuento (neto)</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">Descuento por volumen</td>
                                <td className="border border-gray-300 px-4 py-2">5%</td>
                                <td className="border border-gray-300 px-4 py-2">$2.021.175</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">Cargo por despacho</td>
                                <td className="border border-gray-300 px-4 py-2">1%</td>
                                <td className="border border-gray-300 px-4 py-2">$404.235</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Observations */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="font-semibold">Otras observaciones:</div>
                <div className="md:col-span-3">
                    <input
                        type="text"
                        className="w-full border border-gray-300 p-2 rounded"
                        placeholder="Ingrese observaciones adicionales aquí"
                    />
                </div>
            </div>

            {/* Footer with Bank Info and Totals */}
            <div className="flex flex-col md:flex-row">
                {/* Bank Transfer Info */}
                <div className="md:w-3/4 pr-4 mb-4 md:mb-0">
                    <div className="border border-gray-300 p-4">
                        <h3 className="font-bold mb-2">Datos de Transferencia Bancaria</h3>
                        <p>Banco de Chile</p>
                        <p>Cta Cte 144 032 6403</p>
                        <p>Razón Social: D3SI SpA</p>
                        <p>Rut: 77.058.146-K</p>
                        <p>alejandro.contreras@d3si.cl</p>
                    </div>
                </div>

                {/* Totals */}
                <div className="md:w-1/4">
                    <div className="border border-gray-300">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="border-b border-gray-300 px-4 py-2 font-semibold">MONTO NETO:</td>
                                    <td className="border-b border-gray-300 px-4 py-2 text-right">$40.423.500</td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-300 px-4 py-2 font-semibold">IVA: 19%</td>
                                    <td className="border-b border-gray-300 px-4 py-2 text-right">$7.680.465</td>
                                </tr>
                                <tr className="bg-gray-100">
                                    <td className="px-4 py-2 font-bold">MONTO TOTAL:</td>
                                    <td className="px-4 py-2 text-right font-bold">$48.103.965</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
