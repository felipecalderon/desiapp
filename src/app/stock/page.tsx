import SelectStore from "@/components/FilterStore"
import InfoTotalStock from "@/components/InfoTotalStock"
import TablaProductos from "@/components/tablas/ProductTable"

export default function Productos() {
  return (
    <>
      <hr className="w-4/5 h-1 mt-6 bg-gray-200 border-0 rounded dark:bg-gray-700" />
      <div className="flex flew-row justify-between w-full mt-6 px-10">
        <SelectStore />
        <InfoTotalStock />
      </div>
      <TablaProductos />
    </>
  )
}
