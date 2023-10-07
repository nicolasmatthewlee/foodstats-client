import { SearchBar } from "components/searchbar";
import { Footer } from "components/footer";
import { Routes, Route } from "react-router-dom";
import FoodDetail from "views/FoodDetail";
import Landing from "views/Landing";
import Nutrients from "views/Nutrients";
import Nutrient from "views/Nutrient";
import { SRPage } from "views/sr-page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/foods/:id" element={<FoodDetail />} />
      <Route path="/nutrients/" element={<Nutrients />} />
      <Route path="/nutrients/:id" element={<Nutrient />} />
      <Route path="/datasets/sr-legacy" element={<SRPage />} />
      <Route
        path="*"
        element={<div className="p-[30px] pt-0">page not found</div>}
      />
    </Routes>
  );
}

export default App;
