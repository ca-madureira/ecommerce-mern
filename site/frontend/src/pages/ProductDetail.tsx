import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { ProductType } from "../types"

export const ProductDetail = () => {
    const { productId } = useParams<{ productId: string }>()
    const [product, setProduct] = useState<ProductType>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [image, setImage] = useState("")
    const [sizeSelected, setSizeSelected] = useState<string>()


    const fetchProduct = async () => {
        setLoading(true)
        setError("")

        try {
            console.log("Buscando produto com ID:", productId)
            const response = await axios.get(`http://localhost:3000/api/products/${productId}`)
            console.log("Resposta da API:", response)

            if (response.data) {
                setProduct(response.data)
                setImage(response.data.images[0])
            } else {
                setError("Dados do produto não encontrados")
            }
        } catch (error) {
            console.error("Erro ao buscar produto:", error)
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    setError(`Produto não encontrado (ID: ${productId})`)
                } else {
                    setError(`Erro: ${error.response?.data?.message || error.message}`)
                }
            } else {
                setError("Erro desconhecido ao buscar produto")
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (productId) {
            console.log("useEffect executado para o ID:", productId)
            fetchProduct()
        }
    }, [productId])

    if (loading) return <p className="text-center mt-4">Carregando...</p>
    if (error) return <p className="text-center mt-4 text-red-500">{error}</p>
    if (!product) return <p className="text-center mt-4">Produto não encontrado</p>

    return (
        <section className="flex flex-col lg:flex-row lg:justify-between lg:items-start lg:max-w-7xl lg:mx-auto lg:px-4 lg:py-6 gap-4">

            <section className="flex ml-2 mt-2 lg:w-1/2">
                <aside className="w-[18%] flex flex-col gap-3">
                    {
                        product.images.map((image) => (
                            <article>
                                <img
                                    onClick={() => setImage(image)}
                                    src={image}
                                    className="w-full h-20 object-cover object-center rounded-md cursor-pointer border-2 border-teal-600 hover:border-teal-400"
                                />
                            </article>
                        ))
                    }
                </aside>
                <section className="w-[82%] pl-4 flex items-center justify-center">
                    <img
                        src={image}
                        alt={product.name}
                        className="w-full max-h-[75vh] object-contain rounded-lg"
                    />
                </section>
            </section>


            <section className="flex flex-col w-full lg:w-1/2 p-4 lg:p-6 space-y-4 lg:border-l lg:pl-8">
                <div className="border-b pb-4">
                    <h1 className="text-2xl lg:text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-xl lg:text-2xl text-teal-800 font-semibold">
                        {product.price !== undefined
                            ? `R$ ${product.price.toFixed(2).replace(".", ",")}`
                            : "Preço indisponível"}
                    </p>
                </div>

                <div className="py-2">
                    <h2 className="text-lg font-medium mb-2">Descrição do Produto</h2>
                    <p className="text-sm lg:text-base text-gray-700">
                        {product.description || "Sem descrição disponível."}
                    </p>
                </div>

                <div className="py-2">
                    <h2 className="text-lg font-medium mb-3">Tamanhos Disponíveis</h2>
                    <div className="flex gap-3 flex-wrap">
                        {product.sizes.map((size) => (
                            <div
                                className={`px-3 py-2 rounded-md border-2 border-teal-600 cursor-pointer
                             ${sizeSelected === size ? 'bg-teal-600 text-white' : 'text-teal-600 hover:bg-teal-50'}
                           `}
                                onClick={() => setSizeSelected(size)}
                            >
                                {size}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 lg:pt-6">
                    <button className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 w-full lg:w-2/3 font-medium text-lg">
                        Adicionar ao carrinho
                    </button>

                    <div className="mt-4 text-sm text-gray-600 flex justify-between border-t pt-3">
                        <span>Frete grátis acima de R$ 500,00</span>
                        <span>Entrega em 3-5 dias úteis</span>
                    </div>
                </div>
            </section>
        </section>
    )
}