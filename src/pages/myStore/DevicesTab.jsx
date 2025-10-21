import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const DevicesTab = () => {
  const [cookies] = useCookies(["token"]);

  const [filterType, setFilterType] = useState("all");

  // Base Devices
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({
    brand: "",
    model: "",
    type: "selling",
  });
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Selling Devices
  const [sellingDevices, setSellingDevices] = useState([]);
  const [newSellingDevice, setNewSellingDevice] = useState({
    imei: "",
    price: "",
  });

  // Repair Devices
  const [repairDevices, setRepairDevices] = useState([]);
  const [newIssue, setNewIssue] = useState({ name: "", price: "" });

  // ---------------- FETCH BASE DEVICES ----------------
  const fetchDevices = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/devices", {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      setDevices(res.data);
    } catch (err) {
      console.error("Error fetching devices:", err);
    }
  };

  // ---------------- ADD NEW DEVICE ----------------
  const addDevice = async () => {
    if (!newDevice.brand || !newDevice.model)
      return alert("Please fill in brand and model.");
    try {
      await axios.post("http://localhost:3000/api/devices", newDevice, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      setNewDevice({ brand: "", model: "", type: "selling" });
      fetchDevices();
    } catch (err) {
      console.error("Error adding device:", err);
      alert(err.response?.data?.message || "Error adding device.");
    }
  };

  // ---------------- DELETE DEVICE ----------------
  const deleteDevice = async (id) => {
    if (!window.confirm("Delete this device?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/devices/${id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      if (selectedDevice === id) setSelectedDevice(null);
      fetchDevices();
    } catch (err) {
      console.error("Error deleting device:", err);
    }
  };

  // ---------------- SELECT DEVICE ----------------
  const selectDevice = (device) => {
    setSelectedDevice(device);
    if (device.type === "selling") fetchSellingDevices(device._id);
    else fetchRepairDevices(device._id);
  };

  // ---------------- SELLING DEVICES LOGIC ----------------
  const fetchSellingDevices = async (deviceId) => {
    try {
      const res = await axios.get("http://localhost:3000/api/selling-devices", {
        headers: { Authorization: `Bearer ${cookies.token}` },
        params: { deviceId },
      });
      setSellingDevices(res.data);
    } catch (err) {
      console.error("Error fetching selling devices:", err);
    }
  };

  const addSellingDevice = async () => {
    if (!newSellingDevice.imei || !newSellingDevice.price)
      return alert("Enter IMEI and price.");
    try {
      await axios.post(
        "http://localhost:3000/api/selling-devices",
        { ...newSellingDevice, deviceId: selectedDevice._id },
        { headers: { Authorization: `Bearer ${cookies.token}` } }
      );
      setNewSellingDevice({ imei: "", price: "" });
      fetchSellingDevices(selectedDevice._id);
    } catch (err) {
      console.error("Error adding selling device:", err);
    }
  };

  const deleteSellingDevice = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/selling-devices/${id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      fetchSellingDevices(selectedDevice._id);
    } catch (err) {
      console.error("Error deleting selling device:", err);
    }
  };

  // ---------------- REPAIR DEVICES LOGIC ----------------
  const fetchRepairDevices = async (deviceId) => {
    try {
      const res = await axios.get("http://localhost:3000/api/repair-devices", {
        headers: { Authorization: `Bearer ${cookies.token}` },
        params: { deviceId },
      });
      setRepairDevices(res.data);
    } catch (err) {
      console.error("Error fetching repair devices:", err);
    }
  };

  const addRepairIssue = async () => {
    if (!newIssue.name || !newIssue.price)
      return alert("Enter issue name and price.");
    try {
      await axios.post(
        "http://localhost:3000/api/repair-devices",
        {
          deviceId: selectedDevice._id,
          issues: [newIssue],
        },
        { headers: { Authorization: `Bearer ${cookies.token}` } }
      );
      setNewIssue({ name: "", price: "" });
      fetchRepairDevices(selectedDevice._id);
    } catch (err) {
      console.error("Error adding issue:", err);
    }
  };

  const deleteRepairDevice = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/repair-devices/${id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      fetchRepairDevices(selectedDevice._id);
    } catch (err) {
      console.error("Error deleting repair device:", err);
    }
  };

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    fetchDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="devices-container">
      <h2>Devices</h2>

      {/* Add Device Form */}
      <div className="add-device-form">
        <input
          type="text"
          placeholder="Brand"
          value={newDevice.brand}
          onChange={(e) =>
            setNewDevice({ ...newDevice, brand: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Model"
          value={newDevice.model}
          onChange={(e) =>
            setNewDevice({ ...newDevice, model: e.target.value })
          }
        />
        <select
          value={newDevice.type}
          onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
        >
          <option value="selling">Selling</option>
          <option value="repair">Repair</option>
        </select>
        <button onClick={addDevice}>Add Device</button>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <label>Filter by Type:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="selling">Selling Devices</option>
          <option value="repair">Repair Devices</option>
        </select>
      </div>

      {/* Base Devices Table */}
      <table className="devices-table">
        <thead>
          <tr>
            <th>Brand</th>
            <th>Model</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices
            .filter((d) => filterType === "all" || d.type === filterType)
            .map((d) => (
              <tr
                key={d._id}
                style={{
                  backgroundColor:
                    selectedDevice?._id === d._id ? "#f1f3f5" : "white",
                  cursor: "pointer",
                }}
                onClick={() => selectDevice(d)}
              >
                <td>{d.brand.charAt(0).toUpperCase() + d.brand.slice(1)}</td>
                <td>{d.model.charAt(0).toUpperCase() + d.model.slice(1)}</td>
                <td
                  style={{
                    color: d.type === "selling" ? "#2a9d8f" : "#457b9d",
                    fontWeight: "600",
                  }}
                >
                  {d.type.charAt(0).toUpperCase() + d.type.slice(1)}
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDevice(d._id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Conditional Rendering for Selling or Repair Section */}
      {selectedDevice && selectedDevice.type === "selling" && (
        <>
          <h3 style={{ marginTop: "30px", color: "#1d3557" }}>
            Selling Devices – {selectedDevice.brand} {selectedDevice.model}
          </h3>

          <div className="add-device-form">
            <input
              type="text"
              placeholder="IMEI"
              value={newSellingDevice.imei}
              onChange={(e) =>
                setNewSellingDevice({
                  ...newSellingDevice,
                  imei: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Price"
              value={newSellingDevice.price}
              onChange={(e) =>
                setNewSellingDevice({
                  ...newSellingDevice,
                  price: e.target.value,
                })
              }
            />
            <button onClick={addSellingDevice}>Add Device</button>
          </div>

          <table className="devices-table">
            <thead>
              <tr>
                <th>IMEI</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellingDevices.map((sd) => (
                <tr key={sd._id}>
                  <td>{sd.imei}</td>
                  <td>${sd.price}</td>
                  <td>{sd.status}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteSellingDevice(sd._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {selectedDevice && selectedDevice.type === "repair" && (
        <>
          <h3 style={{ marginTop: "30px", color: "#1d3557" }}>
            Repair Devices – {selectedDevice.brand} {selectedDevice.model}
          </h3>

          <div className="add-device-form">
            <input
              type="text"
              placeholder="Issue name"
              value={newIssue.name}
              onChange={(e) =>
                setNewIssue({ ...newIssue, name: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price"
              value={newIssue.price}
              onChange={(e) =>
                setNewIssue({ ...newIssue, price: e.target.value })
              }
            />
            <button onClick={addRepairIssue}>Add Issue</button>
          </div>

          <table className="devices-table">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {repairDevices.flatMap((rd) =>
                rd.issues.map((issue, index) => (
                  <tr key={index}>
                    <td>{issue.name}</td>
                    <td>${issue.price}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteRepairDevice(rd._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default DevicesTab;
