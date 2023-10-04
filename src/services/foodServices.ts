import axios from "axios";

export interface Food {
  id: number;
  data_type: string;
  description: string;
  food_category: string;
  publication_date: string;
}

// fetches foods containing a the query string
// returns a promise that returns Food on resolution
export const getFoods = (query: string): Promise<Food[]> => {
  return axios
    .get(`/api/foods/?query=${query}`)
    .then((response) => response.data.results);
};
