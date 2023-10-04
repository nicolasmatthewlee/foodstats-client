import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltRight } from "@fortawesome/free-solid-svg-icons";
import LANDSCAPE_1 from "assets/images/landscape1.png";
import LANDSCAPE_2 from "assets/images/landscape2.png";
import LANDSCAPE_3 from "assets/images/landscape3.png";
import { SearchBar } from "components/searchbar";
import { Footer } from "components/footer";

export const Landing = () => {
  return (
    <div>
      {/* header and search bar */}
      <div
        className="text-left pt-[30px] px-[30px]
      md:pt-[100px]"
      >
        <Link to="/" className="flex">
          <h1 className="inline text-[40px] font-bold text-center flex-1">
            foodstats.net
          </h1>
        </Link>
      </div>
      <div
        className="pt-[15px] pb-[25px] px-[30px]
        sm:px-[60px] md:px-[90px] xl:px-[240px] flex justify-center"
      >
        <div className="flex flex-1  max-w-[600px]">
          <SearchBar />
        </div>
      </div>

      <div
        className="px-[30px] pb-[30px]
      md:pt-[50px]"
      >
        <div className="grid gap-[20px] sm:grid-cols-2 md:grid-cols-3">
          {[
            { header: "compare", image: LANDSCAPE_1, link: "/compare/" },
            { header: "nutrients", image: LANDSCAPE_2, link: "/nutrients/" },
            { header: "about", image: LANDSCAPE_3, link: "/about/" },
          ].map((e) => (
            <div className="inline-block w-full">
              <Link to={e.link}>
                <div
                  className="relative bg-gray-100 rounded-lg bg-cover bg-center pb-[50%]
                  sm:pb-[100%] lg:pb-[75%]"
                  style={{ backgroundImage: `url(${e.image})` }}
                >
                  <h2 className="absolute font-bold text-white text-[30px] ml-[30px] mt-[15px]">
                    {e.header}
                  </h2>
                </div>
              </Link>
            </div>
          ))}
          {/* placeholder for md screens */}
          <div
            className="relative bg-gray-100 rounded-lg bg-cover bg-center pb-[50%] hidden
            sm:pb-[100%] sm:inline md:hidden"
          />
        </div>
        <Link to="/datasets/sr-legacy">
          <button className="flex items-center mt-[20px] hover:underline">
            <h2 className="font-bold">explore SR Legacy</h2>
            <FontAwesomeIcon className="ml-[10px]" icon={faLongArrowAltRight} />
          </button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};
