import axios from "axios";

export interface Food {
  id: number;
  data_type: string;
  description: string;
  food_category: string;
  publication_date: string;
}

export interface FoodNutrient {
  id: number;
  nutrient: string;
  amount: number;
  unit: string;
}

export interface Nutrient {
  id: number;
  name: string;
  unit_name: string;
  category: number;
}

// fetches foods containing the query string
// returns a promise that returns Food[] on resolution
export const getFoods = (query: string): Promise<Food[]> => {
  return axios
    .get(`/api/foods/?query=${query}`)
    .then((response) => response.data.results);
};

// fetches all nutrients
// returns a promise that returns Nutrient[] on resolution
export const getNutrients = (): Promise<Nutrient[]> => {
  return axios.get(`/api/nutrients/`).then((response) => response.data);
};

// fetches food
// returns a promise that returns Food on resolution
export const getFood = (id: string): Promise<Food> => {
  return axios.get(`/api/foods/${id}/`).then((response) => response.data);
};

// fetches nutrients for a food
// returns a promise that returns Nutrient[] on resolution
export const getFoodNutrients = (id: string): Promise<FoodNutrient[]> => {
  return axios
    .get(`/api/foods/${id}/nutrients/`)
    .then((response) => response.data);
};
