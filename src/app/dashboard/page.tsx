import TablaProductos from "@/components/ProductTable";
import { configs } from "@/config/constants";
import { ProductoConsignacion } from "@/config/interfaces";
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Dashboard'
}

const Dashboard = async () => {
  const data = await fetchWooData()
  return (
  <TablaProductos productos={data} />
  )
}

const fetchWooData = async () => {
  try {
    const response = await fetch(`${configs.baseURL_CURRENT}1/api/woo`);
    if (!response.ok) {
      const text = await response.text();
      throw 'Error de conexión a la api de Woocommerce'
    }
    const data: ProductoConsignacion[] = await response.json();
    return data;
  } catch (error) {
    console.log('Error en api interna:', configs.baseURL_CURRENT);
    return [];
  }
}
export default Dashboard;