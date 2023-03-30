import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { Beeswarm } from "../components/beeswarm";
import SR_NUTRIENT_DATA from "../nutrient_amounts.json";
import NUTRIENT_LIST from "../nutrient_name.json";

// currently, data only available for SR_LEGACY nutrients
type ValidNutrient = keyof typeof SR_NUTRIENT_DATA;

export const NutrientPage = () => {
  const { id } = useParams();

  let validId;
  if (id && id in SR_NUTRIENT_DATA) validId = id as ValidNutrient;

  return (
    <div className="px-[30px] pb-[30px] space-y-[30px]">
      <Link to="/">
        <button className="hover:underline text-sm">
          <FontAwesomeIcon icon={faLongArrowAltLeft} className="mr-[10px]" />
          nutrients
        </button>
      </Link>
      {validId ? (
        <Beeswarm
          title={NUTRIENT_LIST[validId]}
          data={validId ? SR_NUTRIENT_DATA[validId].slice(0, 100) : []}
          unit=""
          separation={0.8}
        />
      ) : (
        <h1>nothing to show</h1>
      )}
    </div>
  );
};
