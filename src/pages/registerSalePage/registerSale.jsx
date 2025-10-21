import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./registerSale.css";

function RegisterSale() {
  const navigate = useNavigate();

  return (
    <div className="reg-container">
      <nav>
        <FontAwesomeIcon
          icon={faHouse}
          className="home-icon"
          onClick={() => navigate("/dashboard")}
        />
        <h2>Register Sale</h2>
      </nav>

      <div className="grid-container">
        <div className="col1">
          <div className="cust-info">
            <div className="cust-search">
              <input type="text" placeholder="Search Using Phone Number" />
              <FontAwesomeIcon icon={faPlus} className="plus-icon" />
            </div>

            <label>Full Name</label>
            <input type="text" disabled />

            <label>Phone Number</label>
            <input type="text" disabled />

            <label>Email</label>
            <input type="text" disabled />
          </div>

          <div className="categories">
            <input type="text" placeholder="Search an item in store" />
            <label>Store</label>
            <div className="cat-container">
              <div className="cat active">Devices</div>
              <div className="cat">Cases</div>
              <div className="cat">Screen Protectors</div>
              <div className="cat">Charging Cables</div>
              <div className="cat">Charging Adapters</div>
            </div>
          </div>
        </div>

        <div className="col2">
          <div className="subcat">iPhone</div>
          <div className="subcat">Samsung</div>
          <div className="subcat">Google Pixel</div>
          <div className="subcat">LG</div>
          <div className="subcat">iPhone</div>
          <div className="subcat">Samsung</div>
          <div className="subcat">Google Pixel</div>
          <div className="subcat">LG</div>
        </div>

        <div className="col3">
          <div className="summary">
            <label>Sale Items</label>

            <div className="items-container">
              <div className="item">
                <div className="item-top">
                  <span>Item 1</span>
                  <div className="qty-control">
                    <button>-</button>
                    <span>1</span>
                    <button>+</button>
                  </div>
                </div>
                <p>Price: $99</p>
              </div>

              <div className="item">
                <div className="item-top">
                  <span>Item 2</span>
                  <div className="qty-control">
                    <button>-</button>
                    <span>2</span>
                    <button>+</button>
                  </div>
                </div>
                <p>Price: $199</p>
              </div>
            </div>

            <button className="checkout-btn">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterSale;
