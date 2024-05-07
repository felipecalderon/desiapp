'use client'
import { Role, Store } from "@/config/interfaces";
import storeDataStore from "@/stores/store.dataStore";
import { Select, SelectItem, Tab, Tabs } from "@nextui-org/react";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";

type RequiredProps = Pick<Store, 'storeID' | 'name'>;
type OptionalProps = Partial<Omit<Store, 'storeID' | 'name'>>;
type CustomStore = RequiredProps & OptionalProps;

interface Tiendas {
    franquiciados: CustomStore[]
    terceros: CustomStore[]
}

interface Props {
    stores: Store[]
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void
}

export default function ModalUI({ stores, onChange }: Props) {
    const [tiendas, setTiendas] = useState<Tiendas>({
        franquiciados: [],
        terceros: [],
    })

    const renderSelectItems = (items: CustomStore[]) => [
        <SelectItem key="todos" value="">
            Ver Todo
        </SelectItem>,
        ...items.map((store) => (
            <SelectItem key={store.storeID} value={store.storeID}>
                {store.name}
            </SelectItem>
        )),
    ];

    useEffect(() => {
        const franquiciados = stores.filter(({ role }) => role !== Role.Tercero)
        const terceros = stores.filter(({ role }) => role === Role.Tercero)
        setTiendas({ franquiciados, terceros })
        console.log(franquiciados.length);
    }, [stores])

    const franquiciados = renderSelectItems(tiendas.franquiciados)
    const terceros = renderSelectItems(tiendas.terceros)
    console.log(terceros.length);
    return (
        <>
            <Tabs>
                <Tab key="franquiciados" title="Tiendas Principales" className="flex flex-row w-full items-center">
                    <Select
                        label="Selecciona tienda"
                        onChange={onChange}
                        className=""
                    >
                        {franquiciados}
                    </Select>
                    {/* <IoMdCloseCircle className="w-6 h-6 ml-2 text-red-700 bg-white rounded-full" 
                    onClick={() => {
                        onChange(evento)
                        cleanStore()
                    }}/>  */}
                </Tab>
                <Tab key="terceros" title="Terceros">
                    <Select
                        label="Seleccione una tienda tercero"
                        onChange={onChange}
                        className="w-56"
                        
                    >
                        {terceros}
                    </Select>
                </Tab>
            </Tabs>
        </>
    )
}