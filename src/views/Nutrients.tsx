import { Link, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { getNutrients, Nutrient } from "services/foodServices";
import AppLayout from "./AppLayout";

const Nutrients = () => {
  const location = useLocation();
  const [nutrients, setNutrients] = useState<{ [key: string]: Nutrient[] }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. retrieve and sort nutrients
  useEffect(() => {
    setIsLoading(true);
    getNutrients()
      .then((data) => {
        const alphabetized: { [key: string]: Nutrient[] } = {};
        data.forEach((n) => {
          const alphaMatch = n.name.toLowerCase().match(/[a-zA-Z]/);
          if (alphaMatch) {
            if (alphabetized[alphaMatch[0]])
              alphabetized[alphaMatch[0]].push(n);
            else alphabetized[alphaMatch[0]] = [n];
          }
        });

        setNutrients(alphabetized);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AppLayout
      content={
        <div>
          <h2 className="font-bold text-[24px]">nutrients</h2>
          <div className="mb-[15px] mt-[5px] grid grid-cols-[repeat(auto-fill,minmax(20px,1fr))]">
            {Object.keys(nutrients)
              .sort()
              .map((firstLetter: string, i) => (
                <HashLink
                  to={`#${firstLetter}`}
                  className="capitalize w-[20px] text-center hover:font-bold"
                  key={i}
                >
                  {firstLetter}
                </HashLink>
              ))}
          </div>

          {isLoading && (
            <div>
              <FontAwesomeIcon
                icon={faSpinner}
                className="animate-spin mr-[10px]"
              />
              fetching nutrients...
            </div>
          )}

          <div className="columns-2 md:columns-3 lg:columns-5 xl:columns-6">
            {Object.keys(nutrients)
              .sort()
              .map((firstLetter: string, i) => {
                return (
                  <div
                    key={i}
                    id={`${firstLetter}`}
                    className={
                      "px-[10px] pb-[4px] rounded-lg" +
                      " " +
                      (location.hash === `#${firstLetter}`
                        ? "bg-amber-300"
                        : "")
                    }
                  >
                    <h3 className="capitalize font-bold text-[24px]">
                      {firstLetter}
                    </h3>
                    <ul>
                      {nutrients[firstLetter].map((nutrient, i) => (
                        <li key={i}>
                          <Link to={`/nutrients/${nutrient.id}`}>
                            <p className="min-w-0 truncate hover:font-bold">
                              {nutrient.name}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
          </div>
        </div>
      }
    />
  );
};

export default Nutrients;
