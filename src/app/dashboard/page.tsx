import BienvenidaDashboard from "@/components/Bienvenida";
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Dashboard'
}

const Dashboard = async () => { 
    return (
    <BienvenidaDashboard/>
    )
}

export default Dashboard;