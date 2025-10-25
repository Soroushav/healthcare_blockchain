import logo from "../assets/logo.png"
function Logo() {
  return (
    <div className="w-[200px] h-[200px] flex items-center justify-center">
        <img src={logo} alt="" className="w-full h-full object-contain"/>
    </div>
  );
}

export default Logo;