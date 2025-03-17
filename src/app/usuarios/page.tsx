'use client'
import AgregarUsuariosATienda from '@/components/AgregarUsuarioenTienda'
import CrearTienda from '@/components/CrearTienda'
import CrearUsuarios from '@/components/CrearUsuarios'
import ListaTiendas from '@/components/ListaTiendas'
import ListaDeUsuarios from '@/components/ListaUsuarios'
import { Card, CardBody, Tab, Tabs } from "@heroui/react"

const UsuariosPage = () => {
    return (
        <>
            <div className="flex min-w-full flex-col">
                <Tabs color="primary">
                    <Tab key="usuarios" title="Gestionar usuarios">
                        <Card fullWidth={true}>
                            <CardBody>
                                <div className="flex flex-row">
                                    <CrearUsuarios />
                                    <AgregarUsuariosATienda />
                                </div>
                                <ListaDeUsuarios />
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab key="tiendas" title="Gestionar tiendas">
                        <Card>
                            <CardBody>
                                <div className="flex flex-row">
                                    <CrearTienda />
                                    <AgregarUsuariosATienda />
                                </div>
                                <ListaTiendas />
                            </CardBody>
                        </Card>
                    </Tab>
                </Tabs>
            </div>
        </>
    )
}

export default UsuariosPage
