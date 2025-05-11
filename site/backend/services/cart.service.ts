import { Cart } from '../models/cart.model'
import { Product } from '../models/product.model'


interface addCart {
    productId: string,
    quantity: number,
    size: string
}

export const getCart = async (userId: string) => {
    const cart = await Cart.findOne({ userId }).populate({
        path: "items.productId",
        select: "name images description price",
    });


    if (!cart) {
        return { userId, items: [] };
    }


    const formattedItems = cart.items.map(item => {
        const product = item.productId as any;
        return {
            product: {
                _id: product._id,
                name: product.name,
                image: product.images?.[0] || "",
                description: product.description,
                price: product.price
            },
            quantity: item.quantity,
            size: item.size,
            _id: item._id
        };
    });

    return {
        _id: cart._id,
        userId: cart.userId,
        items: formattedItems
    };
};

export const addToCart = async (userId: string, item: addCart) => {

    if (!userId || !item.productId || !item.quantity) {
        throw new Error('Dados inválidos para adicionar ao carrinho');
    }

    const product = await Product.findById(item.productId);

    if (!product) {
        throw new Error('Produto não encontrado');
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, items: [] });
    }


    const productIdString = item.productId.toString();

    console.log("Buscando produto no carrinho:", productIdString, "tamanho:", item.size);


    const existingItem = cart.items.find(cartItem => {
        const cartItemIdString = cartItem.productId.toString();
        const sameProduct = cartItemIdString === productIdString;
        const sameSize = cartItem.size === item.size;

        console.log("Comparando com produto:", cartItemIdString, "tamanho:", cartItem.size);
        console.log("Mesmos IDs?", sameProduct, "Mesmos tamanhos?", sameSize);

        return sameProduct && sameSize;
    });

    if (!existingItem) {
        console.log("Produto não encontrado no carrinho, adicionando novo item");
        cart.items.push({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,

        });
    } else {
        console.log("Produto encontrado no carrinho, atualizando quantidade de", existingItem.quantity, "para", existingItem.quantity + item.quantity);
        existingItem.quantity += item.quantity;
    }

    await cart.save();
    console.log("Carrinho salvo com sucesso");

    return cart;
}

export const removeFromCart = async (userId: string, item: string) => {

    const cart = await Cart.findOne({ userId });

    if (!cart) {
        throw new Error('Carrinho não encontrado.');
    }


    const itemIndex = cart.items.findIndex(

        cartItem => cartItem._id!.toString() === item

    );

    console.log(itemIndex)

    if (itemIndex === -1) {
        throw new Error('Item não encontrado no carrinho.');
    }


    cart.items.splice(itemIndex, 1);

    if (cart.items.length === 0) {

        await Cart.deleteOne({ userId });
        console.log("Carrinho removido pois ficou vazio");
    } else {
        await cart.save();
    }
};


export const adjustItemQuantity = async (
    userId: string,
    { productId, size, operation }: { productId: string, size: string, operation: 'increment' | 'decrement' }
) => {
    const cart = await Cart.findOne({ userId });

    if (!cart) throw new Error("Carrinho não encontrado");

    const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId && item.size === size
    );

    if (itemIndex === -1) throw new Error("Item não encontrado no carrinho");

    if (operation === 'increment') {
        cart.items[itemIndex].quantity += 1;
    } else {
        cart.items[itemIndex].quantity -= 1;
        if (cart.items[itemIndex].quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        }
    }

    await cart.save();

    return await Cart.findOne({ userId }).populate("items.productId", "name images description price");
};


