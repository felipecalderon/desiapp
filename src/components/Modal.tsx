'use client'
import { Role, Store } from '@/config/interfaces'
import { Select, SelectItem, Tab, Tabs } from '@heroui/react'
import { useEffect, useState, useMemo, useCallback } from 'react'

type RequiredProps = Pick<Store, 'storeID' | 'name'>
type OptionalProps = Partial<Omit<Store, 'storeID' | 'name'>>
type CustomStore = RequiredProps & OptionalProps

interface Tiendas {
    franquiciados: CustomStore[]
    terceros: CustomStore[]
}

interface Props {
    stores: Store[]
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export default function ModalUI({ stores, onChange }: Props) {
    const [tiendas, setTiendas] = useState<Tiendas>({ franquiciados: [], terceros: [] })

    // Filtrar tiendas solo cuando cambian
    useEffect(() => {
        const franquiciados = stores.filter(({ role }) => role !== Role.Tercero)
        const terceros = stores.filter(({ role }) => role === Role.Tercero)
        setTiendas({ franquiciados, terceros })
    }, [stores])

    // Memorizar las opciones para evitar recalcularlas en cada render
    const renderSelectItems = useCallback(
        (items: CustomStore[]) => [
            <SelectItem key="todos" textValue="">
                Ver Todo
            </SelectItem>,
            ...items.map((store) => (
                <SelectItem key={store.storeID} textValue={store.name}>
                    {store.name}
                </SelectItem>
            )),
        ],
        []
    )

    const franquiciados = useMemo(() => renderSelectItems(tiendas.franquiciados), [tiendas.franquiciados, renderSelectItems])
    const terceros = useMemo(() => renderSelectItems(tiendas.terceros), [tiendas.terceros, renderSelectItems])

    return (
        <>
            <Tabs>
                <Tab key="franquiciados" title="Tiendas Principales" className="flex flex-row w-full items-center">
                    <Select label="Selecciona tienda" onChange={onChange}>
                        {franquiciados}
                    </Select>
                </Tab>
                <Tab key="terceros" title="Terceros">
                    <Select label="Seleccione una tienda tercero" onChange={onChange} className="w-56">
                        {terceros}
                    </Select>
                </Tab>
            </Tabs>
        </>
    )
}
