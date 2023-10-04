import { SearchBar } from "components/searchbar";
import { Footer } from "components/footer";
import { Routes, Route, Link } from "react-router-dom";
import { FoodPage } from "views/food-page";
import { HomePage } from "views/home-page";
import { NutrientPage } from "views/nutrient-page";
import { SRPage } from "views/sr-page";

function App() {
  return (
    <div>
      <div className="text-left pt-[30px] px-[30px]">
        <Link to="/">
          <h1 className="inline text-[40px]">
            Food<b>Stats</b>
          </h1>
        </Link>
      </div>
      <div className="pt-[15px] pb-[25px]">
        <SearchBar />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/foods/:id" element={<FoodPage />} />
        <Route path="/nutrients/:id" element={<NutrientPage />} />
        <Route path="/datasets/sr-legacy" element={<SRPage />} />
        <Route
          path="*"
          element={<div className="p-[30px] pt-0">page not found</div>}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
