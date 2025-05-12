export const generateUUID = () =>
    '1xxxxxxxxxxxx'.replace(/[x]/g, () => {
        const r = Math.floor(Math.random() * 10)
        return r.toString()
    })
