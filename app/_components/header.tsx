import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";

export const Header = () => {
  return (
    <div className="flex justify-between px-6 pt-6">
      <Image src="/logo.png" alt="FSW Foods" height={30} width={100} />
      <Button
        size="icon"
        variant="outline"
        className="border-none bg-transparent"
      >
        <MenuIcon />
      </Button>
    </div>
  );
};
