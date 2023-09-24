'use client'
import useStore from '@/stores/store.barcode';
import { barcodeFunction } from '@/utils/barcode';

export default function Input() {
    const {sku, changeSend, isSend, setValue} = useStore();

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.relatedTarget === null || (e.relatedTarget && !(e.currentTarget.contains(e.relatedTarget as Node)))) {
            changeSend(isSend)
          }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            changeSend(isSend)
        }
    }
    return (
        <>
            <input
                type="text"
                value={sku}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                onKeyPress={handleKeyPress}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white bg-white text-gray-900 transition-colors duration-300"
                placeholder="Ingresa el código de barra / sku"
            />
        </>
    )
}