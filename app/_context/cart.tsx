/* eslint-disable no-unused-vars */
"use client";

import { Prisma, Product } from "@prisma/client";
import React, { ReactNode, createContext, useMemo, useState } from "react";
import { calculateProductTotalPrice } from "../_helpers/price";

export interface CartProduct
  extends Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          deliveryFee: true;
        };
      };
    };
  }> {
  quantity: number;
}

interface ICartContext {
  products: CartProduct[];
  subtotalPrice: number;
  totalPrice: number;
  totalQuantity: number;
  totalDelivery: number;
  totalDiscount: number;
  addProductToCart({
    product,
    quantity,
    emptyCart,
  }: {
    product: Product;
    quantity: number;
    emptyCart?: boolean;
  }): void;
  handleIncreaseProductQuantity: (productId: string) => void;
  handleDecreaseProductQuantity: (productId: string) => void;
  handleRemoveProductFromCart: (productId: string) => void;
}

export const CartContext = createContext<ICartContext>({
  products: [],
  subtotalPrice: 0,
  totalPrice: 0,
  totalDelivery: 0,
  totalQuantity: 0,
  totalDiscount: 0,
  addProductToCart: () => {},
  handleIncreaseProductQuantity: () => {},
  handleDecreaseProductQuantity: () => {},
  handleRemoveProductFromCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);

  const subtotalPrice = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + Number(product.price) * product.quantity;
    }, 0);
  }, [products]);

  const totalPriceProducts = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + calculateProductTotalPrice(product) * product.quantity;
    }, 0);
  }, [products]);

  const totalQuantity = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + product.quantity;
    }, 0);
  }, [products]);

  const totalDiscount = subtotalPrice - totalPriceProducts;
  const totalDelivery = Number(products[0]?.restaurant.deliveryFee);
  const totalPrice =
    totalPriceProducts + Number(products[0]?.restaurant.deliveryFee);

  const addProductToCart = ({
    product,
    quantity,
    emptyCart,
  }: {
    product: CartProduct;
    quantity: number;
    emptyCart?: boolean;
  }) => {
    if (emptyCart) {
      return setProducts([{ ...product, quantity }]);
    }

    const isProductAlreadyOnCart = products.some(
      (cartProduct) => cartProduct.id === product.id,
    );

    if (isProductAlreadyOnCart) {
      return setProducts((prev) =>
        prev.map((cartProduct) => {
          if (cartProduct.id === product.id) {
            return {
              ...cartProduct,
              quantity: cartProduct.quantity + quantity,
            };
          }

          return cartProduct;
        }),
      );
    }

    setProducts((prev) => [...prev, { ...product, quantity }]);
  };

  const handleIncreaseProductQuantity = (productId: string) => {
    setProducts((prev) =>
      prev.map((cartProduct) => {
        if (cartProduct.id === productId) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + 1,
          };
        }

        return cartProduct;
      }),
    );
  };

  const handleDecreaseProductQuantity = (productId: string) => {
    setProducts((prev) =>
      prev.map((cartProduct) => {
        if (cartProduct.id === productId) {
          if (cartProduct.quantity === 1) return cartProduct;

          return {
            ...cartProduct,
            quantity: cartProduct.quantity - 1,
          };
        }

        return cartProduct;
      }),
    );
  };

  const handleRemoveProductFromCart = (productId: string) => {
    setProducts((prev) =>
      prev.filter((cartProduct) => cartProduct.id !== productId),
    );
  };

  return (
    <CartContext.Provider
      value={{
        products,
        subtotalPrice,
        totalPrice,
        totalDiscount,
        totalDelivery,
        totalQuantity,
        addProductToCart,
        handleIncreaseProductQuantity,
        handleDecreaseProductQuantity,
        handleRemoveProductFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
0;
export default ICartContext;
