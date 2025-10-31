import {
  HiArchiveBoxArrowDown,
  HiMagnifyingGlass,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCalendarDateRange,
  HiOutlineCog6Tooth,
  HiOutlineHeart,
  HiOutlineHome,
} from "react-icons/hi2";
import { NavLink, useNavigate } from "react-router-dom";
// import { useLogout } from "../features/authentication/useLogout";
import Spinner from "./Spinner";

const list = `hover:bg-red-50 w-full transition duration-300 rounded-md border-l-8 border-transparent hover:border-red-400`;

const link =
  "flex gap-3 items-center text-xl text-stone-600  transition duration-300 hover:text-stone-800 px-11 py-4 group";

const iconStyle =
  "text-stone-500 transition duration-300 group-hover:text-red-900 font-extrabold text-2xl";
function MainNav() {
//   const { logout, isLoading } = useLogout();
  const navigate = useNavigate();
//   if (isLoading) return <Spinner />;
  return (
    <ul className=" w-full space-y-2">
      <p className="text-stone-400 text-lg py-3 px-14">Menu</p>
      <li className={list}>
        <NavLink className={link} to="/dashboard">
          <HiOutlineHome className={iconStyle} />
          Homepage
        </NavLink>
      </li>
      <li
        className={list}
        onClick={(e) => {
          e.preventDefault();
          navigate("/favourite");
        }}
      >
        <NavLink className={link}>
          <HiOutlineHeart className={iconStyle} />
          Request
        </NavLink>
      </li>
      <li
        className={list}
        onClick={(e) => {
          e.preventDefault();
          navigate("/watchlist");
        }}
      >
        <NavLink className={link}>
          <HiOutlineCalendarDateRange className={iconStyle} /> Validate
        </NavLink>
      </li>

      <p className="text-stone-400 text-lg py-3 px-14">General</p>
      <li className={list}>
        <NavLink className={link}>
          <HiOutlineCog6Tooth className={iconStyle} />
          Settings
        </NavLink>
      </li>
      <li
        className={list}
        onClick={(e) => {
          e.preventDefault();
        //   logout();
        }}
      >
        <NavLink className={link}>
          <HiOutlineArrowRightOnRectangle className={iconStyle} />
          Logout
        </NavLink>
      </li>
    </ul>
  );
}

export default MainNav;