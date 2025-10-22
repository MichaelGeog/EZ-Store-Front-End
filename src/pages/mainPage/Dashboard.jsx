import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCashRegister, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="logo-section">
        <img src="/fullLogo.png" alt="EZ Store Logo" className="logo" />
      </div>

      <ul className="menu">
        <li className="menu-item" onClick={() => navigate("/register-sale")}>
          <FontAwesomeIcon icon={faCashRegister} className="icon" />
          <span>Register Sale</span>
        </li>

        {/* <li className="menu-item">
          <FontAwesomeIcon icon={faScrewdriverWrench} className="icon" />
          <span>Repair</span>
        </li> */}

        <li className="menu-item" onClick={() => navigate("/my-store")}>
          <FontAwesomeIcon icon={faWarehouse} className="icon" />
          <span>My Store</span>
        </li>
      </ul>
    </div>
  );
}

export default Dashboard;
