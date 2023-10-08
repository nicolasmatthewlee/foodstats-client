import BackLink from "components/BackLink";
import { SearchBar } from "components/searchbar";
import AppLayout from "./AppLayout";
import { useState } from "react";
import { Food } from "services/foodServices";

const Compare = () => {
  const food1 = useState<Food | null>(null);
  const food2 = useState<Food | null>(null);

  return (
    <AppLayout
      content={
        <div>
          <BackLink to="/" />
          <h2 className="font-bold text-[24px] mt-[15px]">compare</h2>
          {/* search bars */}
          <div className="mt-[15px] max-w-full space-y-[15px] sm:space-y-[0px] sm:flex sm:space-x-[30px] justify-center">
            <div className="flex-1 max-w-[600px] min-w-0">
              <p className="font-bold">food #1</p>
              <SearchBar customOnSelect={(id: string) => console.log(id)} />
            </div>
            <div className="flex-1 max-w-[600px] min-w-0">
              <p className="font-bold">food #2</p>
              <SearchBar customOnSelect={(id: string) => console.log(id)} />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default Compare;
