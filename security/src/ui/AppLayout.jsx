import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";

function AppLayout() {
  return (
    <div className="h-screen grid grid-cols-[17rem_1fr] grid-rows-[auto_1fr]">
      <Header />
      <SideBar />
      <main className="bg-slate-50 py-12 row-start-2 col-start-2 min-h-0 overflow-hidden">
        <div className="relative h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;