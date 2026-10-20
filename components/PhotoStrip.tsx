import Image from "next/image";

const PHOTOS = [
  { src: "/media/strip-1.jpg", alt: "Train arriving at a GBR platform" },
  { src: "/media/strip-2.jpg", alt: "GBR crew in the driver's cab" },
  { src: "/media/strip-3.jpg", alt: "Signalling screens at a GBR control centre" },
  { src: "/media/strip-4.jpg", alt: "Passengers boarding a GBR service" },
];

export default function PhotoStrip() {
  return (
    <section aria-label="Life at GBR" className="grid grid-cols-2 md:grid-cols-4">
      {PHOTOS.map((photo) => (
        <div key={photo.src} className="relative h-40 w-full bg-gray-300">
          <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
        </div>
      ))}
    </section>
  );
}
