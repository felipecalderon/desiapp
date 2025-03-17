import React from "react";
import { Chip } from "@heroui/react";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { Store } from "@/config/interfaces";


export default function BotonSiNo({ store, vendio }: { store: Store, vendio: boolean }) {
    const haVendido = (vendio: boolean) => {
        if (vendio) return <FaCheck size={14} />
        else return <FaXmark size={14} />
    }
    return (
        <Chip
            startContent={haVendido(vendio)}
            variant="faded"
            color={vendio ? 'success' : 'danger'}
            className="bg-white cursor-default hover:scale-110 transition-all"
        >
            <span className={`font-semibold ${vendio ? 'text-blue-700' : 'text-slate-700'}`}>{store.location}</span>
        </Chip>
    );
}
