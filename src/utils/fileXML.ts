import { parseString } from 'xml2js'

export const xmlToJson = <T>(xml: string): Promise<T> => {
    return new Promise((resolve, reject) => {
        parseString(xml, { explicitArray: false, mergeAttrs: true }, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
