import { parseString } from 'xml2js'

const findDTE = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return null
    if (obj.hasOwnProperty('DTE')) return obj.DTE

    for (const key in obj) {
        const result = findDTE(obj[key])
        if (result) return result
    }
    return null
}

export const xmlToJson = <T>(xml: string): Promise<T> => {
    return new Promise((resolve, reject) => {
        parseString(xml, { explicitArray: false, mergeAttrs: true }, (err, result) => {
            if (err) {
                reject(err)
            } else {
                const DTE = findDTE(result)
                if (!DTE) {
                    reject(new Error('No se encontró el elemento DTE'))
                }
                resolve(DTE)
            }
        })
    })
}
