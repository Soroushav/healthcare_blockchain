import Logo from "./Logo";
import MainNav from "./MainNav";

function SideBar() {
  return (
    <aside className="row-span-full flex flex-col items-center gap-1 py-1  border-r-gray-300 border-x-2">
      <Logo />
      <MainNav/>
    </aside>
  );
}

export default SideBar;