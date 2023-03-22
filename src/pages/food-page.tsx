import { Visualizations } from "../components/visualizations";
import { FoodInterface } from "../interfaces/food-interface";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Props {
  api: string;
}

export const FoodPage = ({ api }: Props) => {
  const { id } = useParams();
  const [data, setData] = useState<FoodInterface | null>(null);
  const [pageState, setPageState] = useState<
    "loading" | "loaded" | "error" | "not found"
  >("loading");

  useEffect(() => {
    const getFood = async () => {
      setData(null);
      setPageState("loading");
      try {
        const response = await fetch(`${api}/api/foods/${id}`);

        if (response.status === 404) return setPageState("not found");

        const json = await response.json();
        setData(json);
        setPageState("loaded");
      } catch (e) {
        console.log(e);
        setPageState("error");
      }
    };
    getFood();
  }, [id]);

  return (
    <div className="px-[30px]">
      {data && <Visualizations data={data} />}
      {pageState === "loading" && <div className="pb-[30px]">loading...</div>}
      {pageState === "error" && (
        <div className="pb-[30px]">an unknown error occurred</div>
      )}
      {pageState === "not found" && (
        <div className="pb-[30px]">no data found for #{id}</div>
      )}
    </div>
  );
};
