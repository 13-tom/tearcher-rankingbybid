export type StarPack = {
  id: string;
  stars: number;
  priceCents: number;
  label: string;
};

export const STAR_PACKS: StarPack[] = [
  { id: "small", stars: 10, priceCents: 200, label: "10 stars - $2" },
  { id: "medium", stars: 25, priceCents: 400, label: "25 stars - $4" },
  { id: "large", stars: 60, priceCents: 800, label: "60 stars - $8" },
];

export function getStarPack(id: string): StarPack | undefined {
  return STAR_PACKS.find((pack) => pack.id === id);
}

export const MAX_BOOST_PER_ACTION = 5;

export const TEACHER_LISTING_FEE_CENTS = 500; // $5 to add a teacher
