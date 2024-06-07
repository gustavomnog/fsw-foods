"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SearchIcon } from "lucide-react";
import { ChangeEvent, FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";

export const Search = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    return search && router.push(`/restaurants?search=${search}`);
  };
  return (
    <form className="flex gap-2" onSubmit={handleSearchSubmit}>
      <Input
        placeholder="Buscar restaurantes"
        className="border-none"
        onChange={handleChange}
        value={search}
      />
      <Button size="icon" type="submit">
        <SearchIcon size={20} />
      </Button>
    </form>
  );
};
