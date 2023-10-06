import { Visualizations } from "components/visualizations";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getFoodNutrients,
  getFood,
  FoodNutrient,
  Food,
} from "services/foodServices";
import AppLayout from "./AppLayout";

const FoodDetail = () => {
  const { id } = useParams();
  const [foodData, setFoodData] = useState<Food | null>(null);
  const [nutrientsData, setNutrientsData] = useState<FoodNutrient[] | null>(
    null
  );
  const [pageState, setPageState] = useState<
    "loading" | "loaded" | "error" | "not found"
  >("loading");

  useEffect(() => {
    const fetchData = async () => {
      setFoodData(null);
      setPageState("loading");
      if (id) {
        const foodPromise = getFood(id).then((data) => setFoodData(data));
        const nutrientPromise = getFoodNutrients(id).then((data) =>
          setNutrientsData(data)
        );
        await Promise.all([foodPromise, nutrientPromise])
          .then(() => setPageState("loaded"))
          .catch(() => setPageState("error"));
      }
    };
    fetchData();
  }, [id]);

  return (
    <AppLayout
      content={
        <div>
          {foodData && nutrientsData && (
            <Visualizations
              data={{
                id: foodData.id,
                data_type: foodData.data_type,
                description: foodData.description,
                publication_date: foodData.publication_date,
                foodNutrients: nutrientsData,
              }}
            />
          )}
          {pageState === "loading" && (
            <div className="pb-[30px]">loading...</div>
          )}
          {pageState === "error" && (
            <div className="pb-[30px]">an unknown error occurred</div>
          )}
          {pageState === "not found" && (
            <div className="pb-[30px]">no data found for #{id}</div>
          )}
        </div>
      }
    />
  );
};

export default FoodDetail;
