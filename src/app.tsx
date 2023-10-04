import { SearchBar } from "components/searchbar";
import { Footer } from "components/footer";
import { Routes, Route } from "react-router-dom";
import { FoodPage } from "views/food-page";
import { Landing } from "views/Landing";
import Nutrients from "views/Nutrients";
import { NutrientPage } from "views/nutrient-page";
import { SRPage } from "views/sr-page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/foods/:id" element={<FoodPage />} />
      <Route path="/nutrients/" element={<Nutrients />} />
      <Route path="/nutrients/:id" element={<NutrientPage />} />
      <Route path="/datasets/sr-legacy" element={<SRPage />} />
      <Route
        path="*"
        element={<div className="p-[30px] pt-0">page not found</div>}
      />
    </Routes>
  );
}

export default App;
