import Image, { ImageProps } from "next/image";

export const PromoBanner = (props: ImageProps) => {
  return (
    <Image
      width={0}
      height={0}
      className="h-auto w-full object-contain"
      sizes="100vw"
      quality={100}
      {...props}
    />
  );
};
