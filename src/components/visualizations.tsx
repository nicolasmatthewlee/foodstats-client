import { FoodInterface } from "../interfaces/food-interface";
import { BarGraph } from "./bar-graph";
import { BarGraphStacked } from "./bar-graph-stacked";
import { BarGraphHorizontal } from "./bar-graph-horizontal";
import NUTRIENT_DATA_JSON from "../nutrient_amounts.json";
import { percentile } from "./graph-utilities";
import { useEffect, useState } from "react";
import { NutrientInterface } from "../interfaces/nutrient-interface";
const NUTRIENT_DATA = Object(NUTRIENT_DATA_JSON);

interface Props {
  data: FoodInterface;
}

export const Visualizations = ({
  data: { dataType, fdcId, description, foodNutrients, publishedDate },
}: Props) => {
  const findNutrientByName = (name: string, data: NutrientInterface[]) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].nutrient.name === name) return data[i];
    }
    return false;
  };

  const getDataUnitsLabels = (
    nutrients: string[],
    dataSource: typeof foodNutrients,
    absoluteUnits: Boolean = true
  ): [number[], string[], string[]] => {
    let data: number[] = [];
    let units: string[] = [];
    let labels: string[] = [];

    for (let n of nutrients) {
      const nutrient = findNutrientByName(n, dataSource);
      if (nutrient) {
        const label =
          nutrient.nutrient.name === "Carbohydrate, by difference"
            ? "Carbohydrate"
            : nutrient.nutrient.name === "Total lipid (fat)"
            ? "Fat"
            : nutrient.nutrient.name;
        labels.push(label);
        data.push(nutrient.amount);
        if (absoluteUnits) units.push(nutrient.nutrient.unitName);
        else units.push("%");
      }
    }

    return [data, units, labels];
  };

  const [foodNutrientPercentiles, setFoodNutrientPercentiles] = useState<
    NutrientInterface[]
  >([]);

  const [isShowingAbsoluteData, setIsShowingAbsoluteData] =
    useState<Boolean>(true);

  const computeNutrientPercentiles = (
    nutrients: typeof foodNutrients,
    NUTRIENT_DATA: any
  ) => {
    return nutrients.map((e) => {
      const copy = structuredClone(e);
      copy["amount"] =
        Math.round(
          percentile(
            e.nutrient.id in NUTRIENT_DATA ? NUTRIENT_DATA[e.nutrient.id] : [],
            e.amount
          ) * 100
        ) / 100;

      return copy;
    });
  };
  useEffect(() => {
    setFoodNutrientPercentiles(
      computeNutrientPercentiles(foodNutrients, NUTRIENT_DATA)
    );
  }, [foodNutrients]);

  const macros = [
    "Total lipid (fat)",
    "Carbohydrate, by difference",
    "Water",
    "Protein",
    "Alcohol, ethyl",
    "Ash",
  ];
  const minerals = [
    "Calcium, Ca",
    "Iron, Fe",
    "Magnesium, Mg",
    "Phosphorus, P",
    "Potassium, K",
    "Sodium, Na",
    "Zinc, Zn",
    "Copper, Cu",
    "Manganese, Mn",
    "Selenium, Se",
  ];

  const vitamins = [
    "Vitamin C, total ascorbic acid",
    "Thiamin",
    "Riboflavin",
    "Niacin",
    "Pantothenic acid",
    "Vitamin B-6",
    "Folate, total",
    "Folic acid",
    "Folate, food",
    "Folate, DFE",
    "Vitamin B-12",
    "Vitamin B-12, added",
    "Vitamin A, RAE",
    "Retinol",

    "Vitamin A, IU",
    "Vitamin E (alpha-tocopherol)",
    "Vitamin E, added",
    "Vitamin D (D2 + D3), International Units",
    "Vitamin D (D2 + D3)",
    "Vitamin D3 (cholecalciferol)",
    "Vitamin K (phylloquinone)",
    "Vitamin K (Dihydrophylloquinone)",
  ];

  const vitaminE = [
    "Tocopherol, beta",
    "Tocopherol, gamma",
    "Tocopherol, delta",
    "Tocotrienol, alpha",
    "Tocotrienol, beta",
    "Tocotrienol, gamma",
    "Tocotrienol, delta",
  ];

  const otherNutrients = [
    "Choline, total",
    "Betaine",
    "Carotene, beta",
    "Carotene, alpha",
    "Cryptoxanthin, beta",
    "Lycopene",
    "Lutein + zeaxanthin",
  ];

  let [macrosData, macrosUnits, macrosLabels] = getDataUnitsLabels(
    macros,
    foodNutrients
  );

  let [vitaminsMineralsData, vitaminsMineralsUnits, vitaminsMineralsLabels] =
    getDataUnitsLabels(
      minerals.concat(...vitamins),
      isShowingAbsoluteData ? foodNutrients : foodNutrientPercentiles,
      isShowingAbsoluteData ? true : false
    );

  return (
    <div className="space-y-[30px] pb-[30px]">
      <div className="flex flex-col">
        <div className="flex">
          <h1 className="truncate flex-1">{description}</h1>
          <p>#{fdcId}</p>
        </div>
        <p className="text-sm text-gray-500">{dataType}</p>
      </div>
      <div className="h-[80px]">
        <BarGraphStacked
          title="Macronutrients"
          data={macrosData}
          units={macrosUnits}
          labels={macrosLabels}
        />
      </div>

      <BarGraphHorizontal
        title="Vitamins & Minerals"
        data={vitaminsMineralsData}
        units={vitaminsMineralsUnits}
        labels={vitaminsMineralsLabels}
      />
      <button
        className="hover:bg-gray-100 text-sm px-[7px] py-[2px] rounded-sm"
        onClick={() => {
          setIsShowingAbsoluteData(!isShowingAbsoluteData);
        }}
      >
        {isShowingAbsoluteData ? "percentiles" : "absolute"}
      </button>
    </div>
  );
};
