import { User } from "@/config/interfaces";
import { useEffect, useState } from "react";

export default function useUserLS() {
    const [localUser, setLocalUser] = useState<User | null>(null);

    useEffect(() => {
        // Verifica entorno del navegador antes de acceder al localStorage
        if (typeof window !== 'undefined') {
            // obtener la información del usuario
            const localUserData = localStorage.getItem('user');

            if (localUserData) {
                try {
                    // Si hay datos en el localStorage, analizarlos como JSON
                    const parsedUser = JSON.parse(localUserData);
                    setLocalUser(parsedUser); 
                } catch (error) {
                    console.error('Error al analizar los datos del usuario:', error);
                }
            }
        }
    }, []);

    return localUser;
}