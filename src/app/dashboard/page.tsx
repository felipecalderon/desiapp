import TablaProductos from "@/components/ProductTable";
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Dashboard'
}

const Dashboard = async () => { 
    return (
    <TablaProductos/>
    )
}

export default Dashboard;