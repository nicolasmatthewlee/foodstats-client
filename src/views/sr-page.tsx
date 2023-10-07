import { Treemap } from "components/treemap";
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
