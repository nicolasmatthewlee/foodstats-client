import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { Beeswarm } from "../components/beeswarm";

import SR_NUTRIENT_DATA from "../nutrient_amounts.json";
import NUTRIENT_LIST from "../nutrient_name.json";
import SR_NUTRIENT_DATA_LABELS from "../nutrient_amounts_labels.json";
import SR_ID_TO_DESCRIPTION from "../sr_fdc_id_to_description.json";
import NUTRIENT_ID_TO_UNIT from "../nutrient_id_to_unit.json";

// currently, data only available for SR_LEGACY nutrients
type ValidNutrient = keyof typeof SR_NUTRIENT_DATA;
type ValidID = keyof typeof SR_ID_TO_DESCRIPTION;

export const NutrientPage = () => {
  const { id } = useParams();

  let validId;
  let labels: string[] = [];
  if (id && id in SR_NUTRIENT_DATA) {
    validId = id as ValidNutrient;

    labels = SR_NUTRIENT_DATA_LABELS[validId].labels.map((n: any) => {
      const id = String(n) as ValidID;
      return SR_ID_TO_DESCRIPTION[id];
    });
  }

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
          data={SR_NUTRIENT_DATA_LABELS[validId].data.slice(0, 100)}
          dataLabels={labels.slice(0, 100)}
          unit={NUTRIENT_ID_TO_UNIT[validId]}
          separation={0.8}
        />
      ) : (
        <h1>nothing to show</h1>
      )}
    </div>
  );
};
