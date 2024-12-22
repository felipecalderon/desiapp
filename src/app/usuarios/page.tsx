'use client'
import AgregarUsuariosATienda from '@/app/settings/components/AgregarUsuarioenTienda'
import CrearTienda from '@/app/settings/components/CrearTienda'
import CrearUsuarios from '@/app/settings/components/CrearUsuarios'
import ListaTiendas from '@/app/settings/components/ListaTiendas'
import ListaDeUsuarios from '@/app/settings/components/ListaUsuarios'
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react'

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
