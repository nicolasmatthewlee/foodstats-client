export interface NutrientInterface {
  type: string;
  nutrient: {
    id: number;
    name: string;
    unitName: string;
  };
  amount: number;
}
