import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";

const BackLink = ({ to, text = "return" }: { to: string; text?: string }) => {
  return (
    <Link to={to}>
      <button className="font-bold hover:underline text-gray-400">
        <FontAwesomeIcon icon={faLongArrowAltLeft} className="mr-[5px]" />
        {text}
      </button>
    </Link>
  );
};

export default BackLink;
