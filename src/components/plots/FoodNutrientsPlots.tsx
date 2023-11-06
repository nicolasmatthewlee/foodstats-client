import { useState, useEffect } from "react";
import { getFoodNutrients, getNutrients } from "services/foodServices";
import { Nutrient } from "services/foodServices";
import { BarGraphHorizontal } from "components/bar-graph-horizontal";

// renders plots for all possible nutrients organized by category
// id : the id of the food
// categories : an array of category IDs to include
const FoodNutrientsPlots = ({
  id,
  categories = [1, 2, 3, 4, 5, 6, 7, 8, 13, 14],
}: {
  id: string;
  categories?: number[];
}) => {
  const [categorizedNutrients, setCategorizedNutrients] = useState<Record<
    number,
    Nutrient[]
  > | null>(null);

  // 1. get all possible nutrients and food nutrients
  useEffect(() => {
    Promise.all([getNutrients(), getFoodNutrients(id)]).then((data) => {
      let allNutrients = data[0] as (Nutrient & { amount?: number | null })[];
      const foodNutrients = data[1];

      // add value to allNutrients, if present in foodNutrients
      for (let nutrient of allNutrients) {
        nutrient["amount"] = null;
        for (let value of foodNutrients) {
          if (value.nutrient === nutrient.name) {
            nutrient["amount"] = value.amount;
          }
        }
      }

      // categorize nutrients
      let categorized: Record<number, Nutrient[]> = {};
      for (let e of allNutrients) {
        if (categorized[e.category]) categorized[e.category].push(e);
        else categorized[e.category] = [e];
      }

      setCategorizedNutrients(categorized);
    });
  }, [id]);

  return (
    <div>
      {categorizedNutrients &&
        categories.map((category, key) => {
          const data: (number | null)[] = [];
          const labels: string[] = [];
          const units: string[] = [];
          categorizedNutrients[category].forEach((e: any, i) => {
            data[i] = e.amount;
            labels[i] = e.name;
            units[i] = e.unit_name;
          });

          return (
            <div key={key}>
              <BarGraphHorizontal
                title={String(category)}
                data={data}
                labels={labels}
                units={units}
              />
            </div>
          );
        })}
    </div>
  );
};

export default FoodNutrientsPlots;
