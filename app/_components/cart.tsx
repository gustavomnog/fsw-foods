import React, { useContext } from "react";
import { CartContext } from "../_context/cart";
import { CartItem } from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/price";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const Cart = () => {
  const { products, subtotalPrice, totalDiscount, totalPrice } =
    useContext(CartContext);

  return (
    <div className="py-5">
      <div className="space-y-4">
        {products.map((item) => (
          <CartItem key={item.id} cartProduct={item} />
        ))}
      </div>

      {products.length > 0 && (
        <>
          <div className="mt-6">
            <Card>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotalPrice)}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Descontos</span>
                  <span>- {formatCurrency(totalDiscount)}</span>
                </div>

                <Separator className="h-[0.5px]" />

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Entrega</span>

                  {Number(products[0].restaurant.deliveryFee) === 0 ? (
                    <span className="uppercase text-primary ">Grátis</span>
                  ) : (
                    formatCurrency(Number(products[0].restaurant.deliveryFee))
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Total</span>
                  <span>
                    {formatCurrency(
                      totalPrice + Number(products[0].restaurant.deliveryFee),
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button className="mt-6 w-full">Finalizar pedido</Button>
        </>
      )}
    </div>
  );
};

export default Cart;
