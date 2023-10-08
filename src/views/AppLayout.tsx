import { SearchBar } from "components/searchbar";
import { ReactNode } from "react";
import Header from "components/Header";
import { Footer } from "components/footer";

const AppLayout = ({ content }: { content: ReactNode }) => {
  return (
    <div className="bg-gray-50">
      <Header />
      {/* search bar */}
      <div
        className="pt-[15px] pb-[30px] px-[30px]
        sm:px-[60px] md:px-[90px] xl:px-[240px] flex justify-center"
      >
        <div className="flex flex-1  max-w-[600px] min-w-0">
          <SearchBar />
        </div>
      </div>

      {/* content */}
      <div className="px-[30px] pb-[30px]">{content}</div>
      <Footer />
    </div>
  );
};

export default AppLayout;
