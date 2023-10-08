import { Link } from "react-router-dom";

const Header = ({ text = "foodstats.net" }: { text?: string }) => {
  return (
    <div className="text-left pt-[30px] px-[30px]">
      <Link to="/" className="flex">
        <h1 className="inline text-[40px] font-bold text-center flex-1">
          {text}
        </h1>
      </Link>
    </div>
  );
};

export default Header;
