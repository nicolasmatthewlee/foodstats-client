import { NutrientInterface } from "./nutrient-interface";

export interface FoodInterface {
  dataType: string;
  fdcId: string;
  description: string;
  foodNutrients: NutrientInterface[];
  publishedDate: string;
}
