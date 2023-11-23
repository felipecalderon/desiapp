import { url } from '@/config/constants';
import storeAuth from '@/stores/store.auth';
import { useCallback, useEffect, useState } from 'react';

export default function useUploadFile() {
	const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState('Seleccione archivo para subir')
    const uploadFile = useCallback(async (file: File, fileType: string, storeID: string) => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('storeID', storeID)
        formData.append('fileType', fileType)
        formData.append('uploadFile', file);

        try {
            const response = await fetch(`${url.backend}/upload`, {
                method: 'POST',
                body: formData, // Usar FormData
            });
            const data = await response.json()
            if(data.error) return setError(data.error)
            setMessage(data.message)
            console.log({data});
        } finally {
            setLoading(false);
        }
    }, []);

    return { uploadFile, isLoading, error, message };
}
