import SingleProduct from '@/components/SingleProduct'

export default async function Producto({ params }: { params: { id: string } }) {
    return <SingleProduct />
}
