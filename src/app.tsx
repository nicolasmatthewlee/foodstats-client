import { SearchBar } from "./components/searchbar";
import { Footer } from "./components/footer";
import { Routes, Route, Link } from "react-router-dom";
import { FoodPage } from "./pages/food-page";

function App() {
  const api = "https://foodstats.net";

  return (
    <div>
      <div className="text-left pt-[30px] px-[30px]">
        <Link to="/">
          <h1 className="inline text-[40px] ">FoodStats</h1>
        </Link>
      </div>

      <SearchBar api={api} />
      <Routes>
        <Route path="/" element={null} />
        <Route path="/foods/:id" element={<FoodPage api={api} />} />
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
