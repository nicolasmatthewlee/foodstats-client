import { Link } from "react-router-dom";
import { SearchBar } from "components/searchbar";
import { ReactNode } from "react";
import { Footer } from "components/footer";

const AppLayout = ({ content }: { content: ReactNode }) => {
  return (
    <div className="bg-gray-50">
      {/* header and search bar */}
      <div className="text-left pt-[30px] px-[30px]">
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
        <div className="flex flex-1  max-w-[600px] min-w-0">
          <SearchBar />
        </div>
      </div>

      {/* content */}
      {content}

      <Footer />
    </div>
  );
};

export default AppLayout;
