import TablaProductos from "@/components/ProductTable";
import { configs } from "@/config/constants";
import { ProductoConsignacion } from "@/config/interfaces";
import { cleanProducts, connectWoo } from "@/utils/woo";

const Dashboard = async () => { 
    const data = await fetchWooData()
    return (
    <TablaProductos productos={data} />
    )
}

const fetchWooData = async () => {
  try {
    const consultaProductos = await connectWoo('products?per_page=99')
    const productosConsignacion = await cleanProducts(consultaProductos)
    if(!productosConsignacion) return []
    return productosConsignacion;
  } catch (error) {
    throw `Error en api interna: ${configs.baseURL_CURRENT}`;
  }
}
export default Dashboard;