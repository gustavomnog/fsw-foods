import { Header } from "@/app/_components/header";
import { ProductItem } from "@/app/_components/product-item";
import { db } from "@/app/_lib/prisma";
import React from "react";

const RecommendedProduct = async () => {
  // TODO: pegar produtos com mais pedidos

  const products = await db.product.findMany({
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
    take: 10,
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });
  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <h2 className="tex-lg mb-6 font-semibold">Pedidos Recomendados</h2>

        <div className="grid grid-cols-2 gap-6">
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              className="min-w-full"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RecommendedProduct;
