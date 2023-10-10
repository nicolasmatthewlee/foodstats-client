import BackLink from "components/BackLink";
import { SearchBar } from "components/searchbar";
import AppLayout from "./AppLayout";
import { useEffect, useState } from "react";
import {
  Food,
  FoodNutrient,
  getFood,
  getFoodNutrients,
} from "services/foodServices";
import { Visualizations } from "components/visualizations";

const Compare = () => {
  const [foodIds, setFoodIds] = useState<(string | null)[]>([null, null]);
  const [foods, setFoods] = useState<(Food | null)[]>([null, null]);
  const [foodNutrients, setFoodNutrients] = useState<(FoodNutrient[] | null)[]>(
    []
  );

  useEffect(() => {
    Promise.all(
      foodIds.map((id, i) => {
        if (!id) return Promise.resolve(null);
        else
          return Promise.all([
            getFood(id).then((data) => {
              let copy = [...foods];
              copy[i] = data;
              setFoods(copy);
            }),
            getFoodNutrients(id).then((data) => {
              let copy = [...foodNutrients];
              copy[i] = data;
              setFoodNutrients(copy);
            }),
          ]);
      })
    );
  }, [foodIds]);

  return (
    <AppLayout
      content={
        <div>
          <BackLink to="/" />
          <h2 className="font-bold text-[24px] mt-[15px]">compare</h2>
          {/* search bars */}
          <div className="mt-[15px] max-w-full space-y-[15px] sm:space-y-[0px] sm:flex sm:space-x-[30px] justify-center">
            {new Array(2).fill(null).map((_, i) => (
              <div className="flex-1 max-w-[600px] min-w-0" key={i}>
                <p className="font-bold">food #{i + 1}</p>
                <SearchBar
                  customOnSelect={(id: string) => {
                    let copy = [...foodIds];
                    copy[i] = id;
                    setFoodIds(copy);
                  }}
                />
              </div>
            ))}
          </div>
          {/* data visualizations */}
          <div className="flex mt-[30px] space-x-[30px] min-w-0">
            {foodIds.map((_, i) => {
              return (
                foods[i] &&
                foodNutrients[i] && (
                  <Visualizations
                    data={{
                      data_type: (foods[i] as Food).data_type,
                      description: (foods[i] as Food).description,
                      id: (foods[i] as Food).id,
                      publication_date: (foods[i] as Food).publication_date,
                      foodNutrients: foodNutrients[i] as FoodNutrient[],
                    }}
                  />
                )
              );
            })}
          </div>
        </div>
      }
    />
  );
};

export default Compare;
