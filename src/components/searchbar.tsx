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

// renders the search bar
// by default navigates to the page corresponding to the selection
// optional parameter customOnSelect is a function called on selection
//  that receives the id of the selection
export const SearchBar = ({
  customOnSelect = null,
  placeholder = "search foods...",
}: {
  customOnSelect?: Function | null;
  placeholder?: string;
}) => {
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState<Food[] | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [value, setValue] = useState<string>("");

  const searchDatabase = async (query: string) => {
    setSearchResults(null);
    if (query !== "") {
      setIsLoading(true);
      getFoods(query)
        .then((data) => {
          setSearchResults(data);
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="flex-1 min-w-0 relative z-10">
      {/* search input */}
      <form
        className={
          "flex shadow-md" +
          " " +
          (searchResults && searchResults.length > 0
            ? "rounded-t-lg"
            : "rounded-lg")
        }
      >
        <div className="flex items-center z-20">
          <FontAwesomeIcon
            className="text-gray-400 pl-[15px] absolute"
            icon={faMagnifyingGlass}
          ></FontAwesomeIcon>
        </div>
        <input
          type="text"
          className="flex-1 py-[10px] pl-[45px] pr-[10px] rounded-lg z-10 min-w-0"
          onChange={(e) => {
            setValue(e.target.value);
            searchDatabase(e.target.value);
          }}
          placeholder={placeholder}
          value={value}
        />
        <button
          className="px-[15px] hover:bg-gray-100 rounded-r-lg"
          onClick={(e) => {
            e.preventDefault();
            if (searchResults) {
              setValue(searchResults[0].description);
              if (customOnSelect) customOnSelect(searchResults[0].id);
              else navigate(`/foods/${searchResults[0].id}`);

              setSearchResults(null);
            }
          }}
        >
          <FontAwesomeIcon
            className="text-gray-400"
            icon={faLongArrowAltRight}
          ></FontAwesomeIcon>
        </button>
      </form>

      {isLoading && (
        <div className="absolute">
          <FontAwesomeIcon
            icon={faSpinner}
            className="animate-spin mr-[10px]"
          />
          searching...
        </div>
      )}

      {/* search results */}
      {searchResults && searchResults.length > 0 ? (
        <div className="flex flex-col shadow-lg absolute max-w-full rounded-b-lg">
          {searchResults.map((e, i) =>
            // if customOnSelect, do not render Link
            customOnSelect ? (
              <button
                key={i}
                className={
                  "flex-1 text-left truncate px-[15px] py-[5px] focus:z-10 focus:bg-amber-300 focus:outline-none hover:bg-amber-300 " +
                  " " +
                  (i % 2 === 0 ? "bg-gray-100 " : "bg-white") +
                  " " +
                  (i === searchResults.length - 1 ? "rounded-b-lg" : "")
                }
                onClick={() => {
                  setValue(e.description);
                  setSearchResults(null);
                  customOnSelect(e.id);
                }}
              >
                {e.description}
              </button>
            ) : (
              <Link to={`/foods/${e.id}`} key={e.id} className="flex">
                <button
                  className={
                    "flex-1 text-left truncate px-[15px] py-[5px] focus:z-10 focus:bg-amber-300 focus:outline-none hover:bg-amber-300 " +
                    " " +
                    (i % 2 === 0 ? "bg-gray-100 " : "bg-white") +
                    " " +
                    (i === searchResults.length - 1 ? "rounded-b-lg" : "")
                  }
                  onClick={() => {
                    setValue(e.description);
                    setSearchResults(null);
                  }}
                >
                  {e.description}
                </button>
              </Link>
            )
          )}
        </div>
      ) : null}
    </div>
  );
};
