import AgregarUsuariosATienda from "@/components/AgregarUsuarioenTienda"
import CrearUsuarios from "@/components/CrearUsuarios"
import ListaDeUsuarios from "@/components/ListaUsuarios"

const UsuariosPage = () => {
    return (
        <>
            <div className="flex flex-row">
            <CrearUsuarios />
            <AgregarUsuariosATienda />
            </div>
            <ListaDeUsuarios />
        </>
    )
}

export default UsuariosPage