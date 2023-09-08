// asi vienen los productos desde woo
export interface ProductoWooBase {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    description: string;
    short_description: string;
    price: string;
    stock_quantity: number;
    categories: {id: number, name: string}[]
    images: { src: string, name: string, alt: string }[];
    attributes: { name: string, options: string[] }[];
    variations: number[];
    status: string;
}
  
//asi parsearé los productos para consignación
 export interface ProductoConsignacion {
    id: number;
    name: string;
    variations: number[];
    image: string;
    status: string;
    tallas?: VariacionesWoo[]
}

//asi se definen los atributos, ej: {id: 1, name: "talla", option: "3"}
export interface AtributosdelProducto {
    id: number;
    name: string;
    option: string;
}

//así se definen las variaciones que tiene cada producto
export interface VariacionesWoo {
  attributes?: AtributosdelProducto[];  
  numero?: string; 
  price: string;
  regular_price: string;
  sku: string;
  stock_quantity: number;
}