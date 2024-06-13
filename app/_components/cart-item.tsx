import React, { useContext } from "react";
import { CartContext, CartProduct } from "../_context/cart";
import Image from "next/image";
import { calculateProductTotalPrice, formatCurrency } from "../_helpers/price";
import { Button } from "./ui/button";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";

interface CartItemProps {
  cartProduct: CartProduct;
}

export const CartItem = ({ cartProduct }: CartItemProps) => {
  const {
    handleDecreaseProductQuantity,
    handleIncreaseProductQuantity,
    handleRemoveProductFromCart,
  } = useContext(CartContext);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative  h-20 w-20">
          <Image
            src={cartProduct.imageUrl}
            alt={cartProduct.name}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <div className="space-y-1">
          <h3 className="text-xs">{cartProduct.name}</h3>

          <div className="flex items-center gap-1">
            <h4 className="text-sm font-semibold">
              {formatCurrency(
                calculateProductTotalPrice(cartProduct) * cartProduct.quantity,
              )}
            </h4>
            {cartProduct.discountPercentage > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(
                  Number(cartProduct.price) * cartProduct.quantity,
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-center">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 border border-solid border-muted-foreground"
              onClick={() => handleDecreaseProductQuantity(cartProduct.id)}
            >
              <ChevronLeftIcon size={16} />
            </Button>

            <span className="block w-4 text-sm">{cartProduct.quantity}</span>

            <Button
              size="icon"
              className="h-7 w-7 border border-solid border-muted-foreground"
              onClick={() => handleIncreaseProductQuantity(cartProduct.id)}
            >
              <ChevronRightIcon size={16} />
            </Button>
          </div>
        </div>
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 border border-solid border-muted-foreground"
        onClick={() => handleRemoveProductFromCart(cartProduct.id)}
      >
        <TrashIcon size={16} />
      </Button>
    </div>
  );
};
