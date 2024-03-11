import { Sales } from "@/config/interfaces";
import storeSales from "@/stores/store.sales";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";

const FiltroVentas = () => {
  const { sales, setFilterMonth, setFilterYear, updateTotals } = storeSales();

  // Preparación de datos para meses y años
  const months = useMemo(() => ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"], []);
  const years = useMemo(() => Array.from(new Set(sales.map(sale => new Date(sale.createdAt).getFullYear()))).sort(), [sales]);

  // Gestores de cambio de selección
  const monthSelectionChange = (key: React.Key) => {
    if(!key) setFilterMonth(null)
    else setFilterMonth(key.toString().toLowerCase());
    updateTotals()
  };
  
  const yearSelectionChange = (key: React.Key) => {
    if(!key) setFilterYear(null)
    else setFilterYear(key.toString());
    updateTotals()
  };

  const [nombreFecha, setFecha] = useState<{ mes: string | undefined, year: string | undefined }>({
    mes: undefined,
    year: undefined
  })

  useEffect(() => {
    const fechaActual = new Date();
    const formateador = new Intl.DateTimeFormat('es-ES', { month: 'long' });
    const mesActual = formateador.format(fechaActual);
    const anioActual = fechaActual.getFullYear().toString()
    setFilterMonth(mesActual)
    setFilterYear(anioActual)

    const mesCapitalizado = mesActual.charAt(0).toUpperCase() + mesActual.slice(1).toLowerCase();
    
    setFecha({
      mes: mesCapitalizado,
      year: anioActual
    })
  }, [])
  
  if(nombreFecha.mes) return (
    <div className="flex flex-row gap-6 justify-center mb-3">
      <Autocomplete onSelectionChange={monthSelectionChange} defaultSelectedKey={nombreFecha.mes} onClick={(e) => e.stopPropagation()}
        label="Filtrar por mes" className="max-w-xs" color="primary">
        {months.map(month => (
          <AutocompleteItem key={month} value={month}>{month}</AutocompleteItem>
        ))}
      </Autocomplete>
      <Autocomplete onSelectionChange={yearSelectionChange} defaultSelectedKey={nombreFecha.year} onClick={(e) => e.stopPropagation()}
      label="Filtrar por año" className="max-w-xs" color="primary">
        {years.map(year => (
          <AutocompleteItem key={year} value={year.toString()}>{year.toString()}</AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};

export default FiltroVentas