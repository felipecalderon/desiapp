export const barcodeFunction = (sku : string) => {
    if(sku.length === 13){
        const codigo = sku.slice(0, 12)
        return codigo
    }
    return sku
}

