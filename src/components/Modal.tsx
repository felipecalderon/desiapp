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
    const { cleanStore, setStore } = storeDataStore();
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
        const franquiciados = stores.filter(({ Users }) => Users.some(({ role }) => role !== Role.Tercero))
        const terceros = stores.filter(({ Users }) => Users.some(({ role }) => role === Role.Tercero))
        setTiendas({ franquiciados, terceros })
    }, [stores])

    const evento = {
        target: {
            value: ''
        }
    } as ChangeEvent<HTMLSelectElement>
    return (
        <>
            <Tabs>
                <Tab key="franquiciados" title="Tiendas Principales" className="flex flex-row w-full items-center">
                    <Select
                        label="Selecciona tienda"
                        onChange={onChange}
                        className=""
                    >
                        {renderSelectItems(tiendas.franquiciados)}
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
                        {renderSelectItems(tiendas.terceros)}
                    </Select>
                </Tab>
            </Tabs>
        </>
    )
}