import { useState } from "react";
import { FoodInterface } from "../interfaces/food-interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltRight,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

interface Props {
  api: string;
}

export const SearchBar = ({ api }: Props) => {
  const [searchValue, setSearchValue] = useState<String>("");
  const [searchResults, setSearchResults] = useState<FoodInterface[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<Boolean>(false);

  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const searchDatabase = async () => {
    setSearchResults([]);
    setIsLoading(true);
    try {
      const response = await fetch(
        `${api}/api/foods/search?query=${searchValue}`
      );
      const json = await response.json();
      if (json.foods) setSearchResults(json.foods);

      setShowSearchResults(true);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-[30px] pt-[15px] flex flex-col space-y-[30px]">
      <div className="z-20">
        <form className="flex border-2">
          <div className="flex items-center">
            <FontAwesomeIcon
              className="text-gray-400 pl-[10px] absolute"
              icon={faMagnifyingGlass}
            ></FontAwesomeIcon>
          </div>
          <input
            type="text"
            className="flex-1 py-[3px] pl-[35px] pr-10px"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="search..."
            onClick={() => setShowSearchResults(true)}
          />
          <button
            className="px-[10px] hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              searchDatabase();
            }}
          >
            <FontAwesomeIcon
              className="text-gray-400"
              icon={faLongArrowAltRight}
            ></FontAwesomeIcon>
          </button>
        </form>
        {isLoading ? <div className="pt-[30px]">loading...</div> : null}
        {showSearchResults && searchResults.length > 0 ? (
          <div className="flex flex-col border-2 border-t-0">
            {searchResults.map((e, i) => (
              <Link to={`/foods/${e.fdcId}`} key={e.fdcId} className="flex">
                <button
                  className={
                    "flex-1 text-left truncate px-[10px] py-[2px] focus:z-10 focus:bg-amber-200 focus:outline-none hover:bg-amber-200 " +
                    (i % 2 === 0 ? " bg-gray-100 " : "bg-white")
                  }
                  onClick={() => {
                    setShowSearchResults(false);
                  }}
                >
                  {e.description}
                </button>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
      {/* searchResultsOverlay */}
      {showSearchResults && (
        <div
          className="w-full h-full fixed top-[-30px] left-0"
          onClick={() => setShowSearchResults(false)}
        ></div>
      )}
    </div>
  );
};
