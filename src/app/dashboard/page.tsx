'use client'
import TablaProductos from "@/components/ProductTable";
import { configs } from "@/config/constants";
import { ProductoConsignacion } from "@/config/interfaces";

const Dashboard = async () => {
  try {    
    const data = await fetchWooData()
    return (
    <TablaProductos productos={data} />
    )
  } catch (error) {
    console.log(error);
    return <TablaProductos productos={[]} />
  }
}

const fetchWooData = async () => {
  try {
    const response = await fetch(`${configs.baseURL_CURRENT}/api/woo`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      const text = await response.text();
      throw 'Error de conexión a la api de Woocommerce'
    }
    const data: ProductoConsignacion[] = await response.json();
    return data;
  } catch (error) {
    throw `Error en api interna: ${configs.baseURL_CURRENT}`;
  }
}
export default Dashboard;