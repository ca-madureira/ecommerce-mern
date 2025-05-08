export const formatPrice = (price?: number) => {
    return typeof price === "number"
        ? `R$ ${price.toFixed(2).replace(".", ",")}`
        : "R$ 0,00";
};
