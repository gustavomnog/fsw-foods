import React, { useContext, useState } from "react";
import { CartContext } from "../_context/cart";
import { CartItem } from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/price";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { createOrder } from "../_actions/order";
import { OrderStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/app/_components/ui/alert-dialog";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { useRouter } from "next/navigation";

interface CartProps {
  // eslint-disable-next-line no-unused-vars
  setIsOpen(isOpen: boolean): void;
}

const Cart = ({ setIsOpen }: CartProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { data } = useSession();
  const {
    products,
    subtotalPrice,
    totalDiscount,
    totalPrice,
    handleClearCart,
  } = useContext(CartContext);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleFinishOrderClick = async () => {
    if (!data?.user) return;
    setIsSubmitLoading(true);
    const restaurant = products[0].restaurant;

    try {
      await createOrder({
        subtotalPrice,
        totalDiscount,
        totalPrice,
        deliveryFee: restaurant.deliveryFee,
        deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
        restaurant: {
          connect: { id: restaurant.id },
        },
        status: OrderStatus.CONFIRMED,
        user: {
          connect: { id: data.user.id },
        },
        products: {
          createMany: {
            data: products.map((product) => ({
              productId: product.id,
              quantity: product.quantity,
            })),
          },
        },
      });

      handleClearCart();
      setIsOpen(false);

      toast({
        title: "Pedido finalizado com sucesso!",
        description: "Você pode acompanhá-lo na tela dos seus pedidos.",
        action: (
          <ToastAction
            altText="Meus pedidos"
            onClick={() => router.push("/my-orders")}
          >
            Meus pedidos
          </ToastAction>
        ),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <>
      <div className=" flex h-full flex-col py-5">
        {products.length > 0 ? (
          <>
            <div className="flex-auto space-y-4">
              {products.map((item) => (
                <CartItem key={item.id} cartProduct={item} />
              ))}
            </div>

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
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button
              className="mt-6 w-full"
              onClick={() => setIsConfirmDialogOpen(true)}
              disabled={isSubmitLoading}
            >
              {isSubmitLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando pedido
                </>
              ) : (
                <>Finalizar pedido</>
              )}
            </Button>
          </>
        ) : (
          <h2 className="text-left font-medium">Sua sacola está vazia.</h2>
        )}
      </div>

      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja finalizar seu pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao finalizar seu pedido, você concorda com os termos e condições
              da nossa plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinishOrderClick}>
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Cart;
