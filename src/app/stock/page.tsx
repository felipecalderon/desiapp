import SelectStore from "@/components/FilterStore"
import InfoTotalStock from "@/components/InfoTotalStock"
import TablaProductos from "@/components/tablas/ProductTable"

export default function Productos() {
  return (
    <>
      <div className="flex flew-row justify-between w-full mt-6 px-10">
        <SelectStore />
        <InfoTotalStock />
      </div>
      <TablaProductos />
    </>
  )
}
