

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

export const watches: Watch[] = [];
