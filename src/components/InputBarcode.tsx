'use client'
import useStore from '@/services/storeZustand';

function Input() {
    const value = useStore((state) => state.value);
    const setValue = useStore((state) => state.setValue);
    const changeSend = useStore((state) => state.changeSend);
    const isSend = useStore((state) => state.isSend);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.relatedTarget === null || (e.relatedTarget && !(e.currentTarget.contains(e.relatedTarget as Node)))) {
            changeSend(isSend)
          }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            changeSend(isSend)
        }
    };
    return (
        <>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                onKeyPress={handleKeyPress}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white bg-white text-gray-900 transition-colors duration-300"
                placeholder="Ingresa el código de barra / sku"
            />
        </>
    );
}

export default Input;