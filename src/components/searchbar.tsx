import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltRight,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getFoods, Food } from "../services/foodServices";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export const SearchBar = () => {
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState<Food[] | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const searchDatabase = async (query: string) => {
    setIsLoading(true);
    setSearchResults(null);
    getFoods(query)
      .then((data) => {
        setSearchResults(data);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="px-[30px] flex flex-col space-y-[30px]">
      <div className="z-20">
        {/* search input */}
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
            onChange={(e) => {
              searchDatabase(e.target.value);
            }}
            placeholder="search foods..."
          />
          <button
            className="px-[10px] hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              if (searchResults) navigate(`/foods/${searchResults[0].id}`);
            }}
          >
            <FontAwesomeIcon
              className="text-gray-400"
              icon={faLongArrowAltRight}
            ></FontAwesomeIcon>
          </button>
        </form>

        {isLoading && (
          <div>
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin mr-[10px]"
            />
            searching...
          </div>
        )}

        {/* search results */}
        {searchResults && searchResults.length > 0 ? (
          <div className="flex flex-col border-2 border-t-0">
            {searchResults.map((e, i) => (
              <Link to={`/foods/${e.id}`} key={e.id} className="flex">
                <button
                  className={
                    "flex-1 text-left truncate px-[10px] py-[2px] focus:z-10 focus:bg-amber-200 focus:outline-none hover:bg-amber-200 " +
                    (i % 2 === 0 ? " bg-gray-100 " : "bg-white")
                  }
                  onClick={() => {
                    setSearchResults(null);
                  }}
                >
                  {e.description}
                </button>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
