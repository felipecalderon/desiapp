import { Role } from "@/config/interfaces";
import { Chip } from "@nextui-org/react";

export default function RoleVista({ role }: { role: string }) {
    switch (role) {
        case Role.Admin: return <Chip
        variant="faded"
        color="primary"
        className="bg-white cursor-default">
            Administrador
        </Chip>
        
        case Role.Franquiciado: return <Chip
        variant="faded"
        color="primary"
        className="bg-white cursor-default">
            Franquiciado
        </Chip>
    
        case Role.Consignado: return <Chip
        variant="faded"
        color="success"
        className="bg-white cursor-default">
            Consignado
        </Chip>

        case Role.Tercero: return <Chip
        variant="faded"
        color="warning"
        className="bg-white cursor-default">
            Tercero
        </Chip>

        default: return <Chip
        variant="faded"
        color="default"
        className="bg-white cursor-default">
            Otro
        </Chip>
    }
}
