import { Treemap } from "components/treemap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";

import DATA from "../sr_category_sizes.json";

export const SRPage = () => {
  return (
    <div className="flex flex-col px-[30px] mb-[30px] space-y-[30px]">
      <Link to="/">
        <button className="hover:underline text-sm">
          <FontAwesomeIcon icon={faLongArrowAltLeft} className="mr-[10px]" />
          back
        </button>
      </Link>
      <Treemap title="SR Legacy" height="500px" data={DATA} />
      <Link to="/">
        <button className="hover:underline text-sm">
          <FontAwesomeIcon icon={faLongArrowAltLeft} className="mr-[10px]" />
          back
        </button>
      </Link>
    </div>
  );
};
