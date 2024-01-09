import ListaTiendas from "@/components/ListaTiendas";
import { Store } from "@/config/interfaces";
import { fetchData } from "@/utils/fetchData";

export default async function TiendasPage() {
    const tiendas: Store[] = await fetchData('store')
    return (
        <ListaTiendas store={tiendas} />
    )
}