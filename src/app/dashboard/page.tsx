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
    console.log(configs.baseURL_CURRENT);
    const response = await fetch(`${configs.baseURL_CURRENT}/api/woo`);
    const data: ProductoConsignacion[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching the data', error);
    throw 'Conexión a la tienda d3si.cl fallida';
  }
}
export default Dashboard;