import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { Beeswarm } from "components/beeswarm";
import AppLayout from "./AppLayout";
import BackLink from "components/BackLink";

import SR_NUTRIENT_DATA from "nutrient_amounts.json";
import NUTRIENT_LIST from "nutrient_name.json";
import SR_NUTRIENT_DATA_LABELS from "nutrient_amounts_labels.json";
import SR_ID_TO_DESCRIPTION from "sr_fdc_id_to_description.json";
import NUTRIENT_ID_TO_UNIT from "nutrient_id_to_unit.json";

// currently, data only available for SR_LEGACY nutrients
type ValidNutrient = keyof typeof SR_NUTRIENT_DATA;
type ValidID = keyof typeof SR_ID_TO_DESCRIPTION;

export const Nutrient = () => {
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
    <AppLayout
      content={
        <div className="space-y-[15px]">
          <BackLink to="/nutrients/" />
          {validId ? (
            <Beeswarm
              title={NUTRIENT_LIST[validId]}
              data={SR_NUTRIENT_DATA_LABELS[validId].data}
              dataLabels={labels}
              unit={NUTRIENT_ID_TO_UNIT[validId]}
              separation={0.8}
            />
          ) : (
            <h1>no data available</h1>
          )}
        </div>
      }
    />
  );
};

export default Nutrient;
