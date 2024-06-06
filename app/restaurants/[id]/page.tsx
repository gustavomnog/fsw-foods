import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import { RestaurantImage } from "./_components/restaurant-image";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import { DeliveryInfo } from "@/app/_components/delivery-info";
import { ProductList } from "@/app/_components/product-list";

interface RestaurantPageProps {
  params: {
    id: string;
  };
}
const RestaurantPage = async ({ params: { id } }: RestaurantPageProps) => {
  const restaurant = await db.restaurant.findUnique({
    where: {
      id,
    },
    include: {
      categories: {
        orderBy: { createdAt: "desc" },
        include: {
          products: {
            where: {
              restaurantId: id,
            },
          },
        },
      },
      products: {
        take: 10,
      },
    },
  });

  if (!restaurant) {
    return notFound();
  }

  return (
    <div>
      <RestaurantImage restaurant={restaurant} />

      <div className="relative z-50 mt-[-1.5rem] flex items-center justify-between rounded-t-3xl bg-white px-5 py-5 pt-5">
        {/* TITULO */}
        <div className="flex items-center gap-[0.375rem]">
          <div className="relative h-8 w-8">
            <Image
              src={restaurant.imageUrl}
              alt={restaurant.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <h1 className="text-xl font-semibold">{restaurant.name}</h1>
        </div>

        <div className="flex items-center gap-[3px] rounded-full bg-foreground px-2 py-[2px] text-white">
          <StarIcon size={12} className="fill-yellow-500 text-yellow-500" />
          <span className="text-xs font-semibold">5.0</span>
        </div>
      </div>

      <div className="px-5">
        <DeliveryInfo restaurant={restaurant} />
      </div>

      <div className="mt-3 flex gap-4 overflow-x-scroll px-5 [&::-webkit-scrollbar]:hidden">
        {restaurant.categories.map((category) => (
          <div
            key={category.id}
            className="min-w-[167px] rounded-lg bg-[#f4f4f4] text-center"
          >
            <span className="text-xs text-muted-foreground">
              {category.name}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <h2 className="px-5 font-semibold">Mais Pedidos</h2>
        {/* TODO: mostrar produtos mais pedidos */}
        <ProductList
          products={restaurant.products.map((product) => ({
            ...product,
            restaurant: { name: restaurant.name },
          }))}
        />
      </div>

      {restaurant.categories.map((category) => (
        <div key={category.id} className="mt-6 space-y-4">
          <h2 className="px-5 font-semibold">{category.name}</h2>

          <ProductList
            products={category.products.map((product) => ({
              ...product,
              restaurant: { name: restaurant.name },
            }))}
          />
        </div>
      ))}
    </div>
  );
};

export default RestaurantPage;
