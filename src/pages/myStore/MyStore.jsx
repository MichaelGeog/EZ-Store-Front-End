import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import DevicesTab from "./DevicesTab";
import AccessoriesTab from "./AccessoriesTab";
import CustomersTab from "./CustomersTab";
import "./MyStore.css";

function MyStore() {
  const [activeTab, setActiveTab] = useState("devices");
  const navigate = useNavigate();

  const renderTab = () => {
    switch (activeTab) {
      case "devices":
        return <DevicesTab />;
      case "accessories":
        return <AccessoriesTab />;
      case "customers":
        return <CustomersTab />;
      default:
        return <DevicesTab />;
    }
  };

  return (
    <div className="myStore-container">
      {/* Header with Home Icon */}
      <div className="myStore-header">
        <h1>My Store</h1>
        <FontAwesomeIcon
          icon={faHouse}
          className="home-icon2"
          title="Go to Dashboard"
          onClick={() => navigate("/dashboard")}
        />
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "devices" ? "active" : ""}`}
          onClick={() => setActiveTab("devices")}
        >
          Devices
        </button>

        <button
          className={`tab-btn ${activeTab === "accessories" ? "active" : ""}`}
          onClick={() => setActiveTab("accessories")}
        >
          Accessories
        </button>

        <button
          className={`tab-btn ${activeTab === "customers" ? "active" : ""}`}
          onClick={() => setActiveTab("customers")}
        >
          Customers
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">{renderTab()}</div>
    </div>
  );
}

export default MyStore;
