// import { useContext, useMemo } from "react";
// import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCashRegister,
  faScrewdriverWrench,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import "./dashboard.css";
function Dashboard() {
  // const { admin, logout } = useContext(AuthContext);

  // // simulate computed data (useMemo to optimize)
  // const welcomeMessage = useMemo(() => {
  //   console.log("Computing welcome message...");
  //   return `Welcome back, ${admin?.firstName || "Admin"} from ${
  //     admin?.businessName
  //   }!`;
  // }, [admin]);

  return (
    <div className="dashboard">
      <div className="logo-section">
        <img src="/fullLogo.png" alt="EZ Store Logo" className="logo" />
      </div>

      <ul className="menu">
        <li className="menu-item">
          <FontAwesomeIcon icon={faCashRegister} className="icon" />
          <span>Register Sale</span>
        </li>
        <li className="menu-item">
          <FontAwesomeIcon icon={faScrewdriverWrench} className="icon" />
          <span>Repair</span>
        </li>
        <li className="menu-item">
          <FontAwesomeIcon icon={faWarehouse} className="icon" />
          <span>Inventory</span>
        </li>
      </ul>
    </div>
  );
}

export default Dashboard;
