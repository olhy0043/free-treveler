import Image from "next/image";
import { destinations } from "@/data/destinations";

const GALLERY_DESTINATION_IDS = [
  "jeju",
  "gyeongju",
  "busan",
  "tokyo",
  "paris",
  "santorini",
  "queenstown",
  "cappadocia",
];

export default function Gallery() {
  const photos = GALLERY_DESTINATION_IDS.map((id) => destinations.find((d) => d.id === id)).filter(
    (d): d is NonNullable<typeof d> => d !== undefined,
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {photos.map((destination) => (
        <div key={destination.id} className="relative h-40 overflow-hidden rounded-[14px]">
          <Image
            src={destination.image.url}
            alt={destination.image.alt}
            fill
            loading="lazy"
            unoptimized
            sizes="(min-width: 640px) 25vw, 50vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
