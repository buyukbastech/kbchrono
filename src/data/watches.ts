

export interface Watch {
  id: string;
  name: string;
  collection: string;
  tagline: string;
  description: string;
  price: string;
  image: string;
  images?: string[];
  specs: {
    movement: string;
    case_material: string;
    case_size: string;
    water_resistance: string;
    power_reserve: string;
    crystal: string;
  };
  story: string;
}

export const watches: Watch[] = [
  {
    id: "lunaire-tourbillon-42mm-—-onyx-edition",
    name: "Lunaire Tourbillon 42mm — Onyx Edition",
    collection: "Lunaire Tourbillon",
    tagline: "A new masterpiece from our atölye",
    description: "Horoloji dünyasında devrim yaratan Lunaire Tourbillon, gökyüzünün eşsiz mekanizmasını bileğinize taşıyor. Onyx kasası ve tamamen el yapımı mekanizmasıyla koleksiyonun en nadide parçası.",
    price: "₺42,500",
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800",
    images: [],
    specs: {
      movement: "Automatic Swiss Movement",
      case_material: "Grade 5 Titanium",
      case_size: "42mm",
      water_resistance: "50 meters",
      power_reserve: "60 hours",
      crystal: "Sapphire Crystal",
    },
    story: "Horoloji dünyasında devrim yaratan Lunaire Tourbillon, gökyüzünün eşsiz mekanizmasını bileğinize taşıyor. Onyx kasası ve tamamen el yapımı mekanizmasıyla koleksiyonun en nadide parçası.",
  },
];
