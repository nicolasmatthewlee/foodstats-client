import { Link } from "react-router-dom";
import SR_NUTRIENT_DATA from "nutrient_amounts.json";
import NUTRIENT_LIST from "nutrient_name.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltRight } from "@fortawesome/free-solid-svg-icons";

export const HomePage = () => {
  const nutrients: { [key: string]: string } = NUTRIENT_LIST;

  // sort only based on alpha characters
  const compareAlpha = (a: string, b: string) => {
    const alphaA = a.toLowerCase().replaceAll(/[^a-z]/g, "");
    const alphaB = b.toLowerCase().replaceAll(/[^a-z]/g, "");
    return alphaA.localeCompare(alphaB);
  };
  let alphabetizedNames = Object.values(nutrients).sort(
    compareAlpha
  ) as string[];

  // get unique names
  alphabetizedNames = alphabetizedNames.filter((x, i, a) => a.indexOf(x) === i);

  return (
    <div className="px-[30px] pb-[30px]">
      <h2 className="font-bold">by nutrient</h2>
      <ul className="list-disc px-[20px] text-sm">
        {alphabetizedNames.map((name: string) => {
          const n = Object.keys(nutrients).filter((n) => {
            return nutrients[n] === name;
          })[0];

          // currently, data only available for SR_LEGACY nutrients
          if (!(n in SR_NUTRIENT_DATA)) return null;

          return (
            <li key={n}>
              <Link to={`/nutrients/${n}`} className="hover:underline">
                {nutrients[n]}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link to="/datasets/sr-legacy">
        <button className="flex items-center mt-[20px] hover:underline">
          <h2 className="font-bold">explore SR Legacy</h2>
          <FontAwesomeIcon className="ml-[10px]" icon={faLongArrowAltRight} />
        </button>
      </Link>
    </div>
  );
};
