import { FoodInterface } from "../interfaces/food-interface";
import { BarGraphStacked } from "./bar-graph-stacked";
import { BarGraphHorizontal } from "./bar-graph-horizontal";
import NUTRIENT_DATA_JSON from "../nutrient_amounts.json";
import { percentile } from "./graph-utilities";
import { useEffect, useState } from "react";
import { NutrientInterface } from "../interfaces/nutrient-interface";
import { Switch } from "./switch";
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

  useEffect(() => {
    const computeNutrientPercentiles = (
      nutrients: typeof foodNutrients,
      NUTRIENT_DATA: any
    ) => {
      return nutrients.map((e) => {
        const copy = structuredClone(e);
        copy["amount"] =
          Math.round(
            percentile(
              e.nutrient.id in NUTRIENT_DATA
                ? NUTRIENT_DATA[e.nutrient.id]
                : [],
              e.amount
            ) * 100
          ) / 100;

        return copy;
      });
    };
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

  const [amount, setAmount] = useState<{
    value: number;
    unit: "g" | "oz" | "lb";
  }>({
    value: 100,
    unit: "g",
  });
  const [amountErrorMessage, setAmountErrorMessage] = useState<string | null>(
    null
  );

  const parseAmount = (s: string) => {
    const alpha = s.match(/[a-z]+/i);
    if (alpha === null)
      return { error: "no unit found (accepted units: g, oz, lb)" };
    const unit = alpha[0].toLowerCase();

    if (unit === "g" || unit === "oz" || unit === "lb") {
      const validUnit: "g" | "oz" | "lb" = unit;
      const num = s.match(/[0-9]+(\.[0-9]+)?/);
      if (num === null) return { error: "no number found" };
      const number = num[0];

      return { value: +number, unit: validUnit };
    } else return { error: "invalid unit (accepted units: g, oz, lb)" };
  };

  // nutritional amounts are provided per 100g; transformation calculates
  // how to scale that data provided with an absolute amount
  const calculateAmountTransformation = (amount: {
    value: number;
    unit: "g" | "oz" | "lb";
  }) => {
    if (amount.unit === "g") return amount.value / 100;
    if (amount.unit === "oz") return (amount.value * 28.3495) / 100;
    if (amount.unit === "lb") return (amount.value * 453.592) / 100;
    return 1;
  };

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

  vitaminsMineralsData = vitaminsMineralsData.map(
    (e) => e * calculateAmountTransformation(amount)
  );

  return (
    <div className="space-y-[30px] pb-[45px]">
      <div className="flex flex-col">
        <div className="flex">
          <h1 className="truncate flex-1">{description}</h1>
          <p>#{fdcId}</p>
        </div>
        <p className="text-sm text-gray-500">{dataType}</p>
      </div>

      <BarGraphStacked
        title="Macronutrients"
        data={macrosData}
        units={macrosUnits}
        labels={macrosLabels}
        height="90px"
      />
      <BarGraphHorizontal
        title="Vitamins & Minerals"
        data={vitaminsMineralsData}
        units={vitaminsMineralsUnits}
        labels={vitaminsMineralsLabels}
      />

      <Switch
        isOn={!isShowingAbsoluteData}
        onLabel="showing absolute"
        offLabel="showing percentiles"
        onClick={() => {
          setIsShowingAbsoluteData(!isShowingAbsoluteData);
        }}
      />
      <div>
        <div className="text-xs flex">
          <p className="py-[2px]">amount:</p>
          <input
            type="text"
            className="w-[80px] px-[5px] py-[2px]"
            placeholder="100g"
            onChange={(e) => {
              const value = parseAmount(e.target.value);
              if (value.error) return setAmountErrorMessage(value.error);
              else if (value.unit && value.value) {
                setAmountErrorMessage(null);
                setAmount(value);
              }
            }}
          />
        </div>
        <p className="text-xs italic text-gray-400">{amountErrorMessage}</p>
      </div>

      <div className="flex flex-col space-y-[10px] max-w-lg">
        <h3 className="text-xs">Information</h3>
        <p className="text-xs text-gray-500">
          {dataType === "SR Legacy"
            ? `SR Legacy has been the primary food composition data type in the
            United States for decades. It provides a comprehensive list of
            values for food components, including nutrients derived from
            analyses, imputations, and the published literature. This data type
            has provided the values for most other public and private food
            composition databases and has supported a wide range of public
            policy initiatives, research studies, and diet planning and
            education activities. SR Legacy, released in April 2018, is the
            final release of this data type and will not be updated. For more
            recent data, users should search other data types in FoodData
            Central.`
            : dataType === "Foundation"
            ? `Foundation Foods includes values derived from analyses for food
              components, including nutrients on a diverse range of foods and
              ingredients as well as extensive underlying metadata. These
              metadata include the number of samples, sampling location, date of
              collection, analytical approaches used, and if appropriate,
              agricultural information such as genotype and production
              practices. The enhanced depth and transparency of Foundation Foods
              data can provide valuable insights into the many factors that
              influence variability in nutrient and food component profiles. The
              goal of Foundation Foods will be to, over time, expand the number
              of basic foods and ingredients and their underlying data.`
            : dataType === "Experimental"
            ? `Experimental Foods contains foods produced, acquired, or studied
              under unique conditions, such as alternative management systems,
              experimental genotypes, or research/analytical protocols. The
              foods in this data type may not be commercially available to the
              public or the data may expand information about the specific food.
              Experimental Foods are for research purposes and may not be
              appropriate as a reference for the consumer or for diet planning.
              Experimental Foods data may also be available through links to
              relevant agricultural research data sources, such as the AgCROS.
              The data in Experimental Foods may include (or link to) variables
              such as genetics, environmental inputs and outputs, supply chains,
              economic considerations, and nutrition research. These data will
              allow users to examine a range of factors used that may affect the
              profiles of food components, including nutrients and resulting
              dietary intakes as well as the sustainability of agricultural and
              dietary food systems.`
            : dataType === "Survey (FNDDS)"
            ? `Food and Nutrient Database for Dietary Studies 2019-2020 (FNDDS
              2019-2020) provides nutrient and food component values for the
              foods and beverages reported in What We Eat in America, the
              dietary intake component of the National Health and Nutrition
              Examination Survey (NHANES). FNDDS data releases correspond to the
              NHANES two-year data cycles. FNDDS data facilitate analyses of
              dietary intakes reported in NHANES as well as many other dietary
              research studies.`
            : dataType === "Branded"
            ? `The USDA Global Branded Food Products Database (Branded Foods),
              formerly hosted on the USDA Food Composition Databases website,
              are data from a public-private partnership whose goal is to
              enhance the open sharing of nutrient data that appear on branded
              and private label foods and are provided by the food industry.
              Members of this partnership are: Agricultural Research Service
              (ARS), Institute for the Advancement of Food and Nutrition
              Sciences (IAFNS), GS1 US, 1WorldSync, Label Insight, University of
              Maryland, Joint Institute for Food Safety and Applied Nutrition.
              Information in Branded Foods is received from food industry data
              providers. USDA supports this data type by standardizing the
              presentation of the data. Branded Foods data are used in a variety
              of ways, including research studies, food label regulatory
              efforts, and product development. Beginning in April 2020, data in
              Branded Foods will be updated on a monthly basis. Monthly updates
              can be found in the API. In addition, downloads for Branded Foods
              are generated every six months, and reflect the most-up-to-date
              version of each product at the time the download is generated.`
            : null}
          <a rel="stylesheet" href="#source1">
            <sup className="text-blue-500">[1]</sup>
          </a>
        </p>
      </div>
      <div className="flex flex-col space-y-[10px]">
        <h3 className="text-xs">References</h3>
        {[
          "SR Legacy",
          "Survey (FNDDS)",
          "Branded",
          "Experimental",
          "Foundation",
        ].includes(dataType) ? (
          <ol className="list-decimal pl-[20px]">
            <li className="text-xs text-gray-500" id="source1">
              U.S. Department of Agriculture. (n.d.). Fooddata Central about Us.
              FoodData Central. Retrieved March 26, 2023, from
              https://fdc.nal.usda.gov/about-us.html
            </li>
          </ol>
        ) : null}
      </div>
    </div>
  );
};
