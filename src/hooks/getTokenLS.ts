import { useEffect, useState } from "react";

export default function useTokenLS() {
    const [localUser, setLocalUser] = useState<string | null>(null);

    useEffect(() => {
        // Verifica entorno del navegador antes de acceder al localStorage
        if (typeof window !== 'undefined') {
            // obtener la información del token
            const localTokenData = localStorage.getItem('token');
            if (localTokenData) setLocalUser(localTokenData)
        }
    }, []);

    return localUser;
}