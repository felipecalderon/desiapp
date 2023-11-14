import SelectStore from "@/components/SelectStore"
import InfoTotalStock from "@/components/InfoTotalStock"
import GenerarTablaStock from "@/components/tablas/GenerarTabla"

export default function Productos() {
  return (
    <>
      <hr className="w-4/5 h-1 mt-6 bg-gray-200 border-0 rounded dark:bg-gray-700" />
      <div className="flex flew-row justify-between w-full mt-6 px-10">
        <InfoTotalStock />
      </div>
      <GenerarTablaStock />
    </>
  )
}
