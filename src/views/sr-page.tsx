import { Treemap } from "components/treemap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import BackLink from "components/BackLink";
import DATA from "../sr_category_sizes.json";
import AppLayout from "./AppLayout";

export const SRPage = () => {
  return (
    <AppLayout
      content={
        <div className="flex flex-col space-y-[15px]">
          <BackLink to="/" />
          <Treemap title="SR Legacy" height="500px" data={DATA} />
        </div>
      }
    />
  );
};
