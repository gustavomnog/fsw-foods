"use server";

import { db } from "@/app/_lib/prisma";

export const searchForrestaurants = (search: string) => {
  const restaurants = db.restaurant.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  return restaurants;
};
