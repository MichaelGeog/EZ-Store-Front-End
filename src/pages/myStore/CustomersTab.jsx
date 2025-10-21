import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const CustomersTab = () => {
  const [cookies] = useCookies(["token"]);
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  const [searchPhone, setSearchPhone] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  // ---------------- FETCH ALL CUSTOMERS ----------------
  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/customers", {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  // ---------------- SEARCH BY PHONE ----------------
  const searchCustomer = async () => {
    if (!searchPhone.trim())
      return alert("Please enter a phone number to search.");

    try {
      const res = await axios.get(
        "http://localhost:3000/api/customers/search",
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
          params: { phone: searchPhone },
        }
      );
      setSearchResult(res.data);
    } catch (err) {
      console.error("Search error:", err);
      alert(err.response?.data?.message || "Customer not found.");
    }
  };

  const clearSearch = () => {
    setSearchPhone("");
    setSearchResult(null);
  };

  // ---------------- ADD CUSTOMER ----------------
  const addCustomer = async () => {
    if (!newCustomer.fullName || !newCustomer.phone)
      return alert("Full name and phone number are required.");

    try {
      await axios.post("http://localhost:3000/api/customers", newCustomer, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      setNewCustomer({ fullName: "", phone: "", email: "" });
      fetchCustomers();
    } catch (err) {
      console.error("Error adding customer:", err);
      alert(err.response?.data?.message || "Error adding customer.");
    }
  };

  // ---------------- DELETE CUSTOMER ----------------
  const deleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;
    try {
      await axios.delete(`http://localhost:3000/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      fetchCustomers();
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  };

  // ---------------- EDIT CUSTOMER ----------------
  const startEdit = (customer) => {
    setEditId(customer._id);
    setEditData({
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email,
    });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/customers/${id}`, editData, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      setEditId(null);
      fetchCustomers();
    } catch (err) {
      console.error("Error updating customer:", err);
      alert(err.response?.data?.message || "Error updating customer.");
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({ fullName: "", phone: "", email: "" });
  };

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- TABLE RENDERING LOGIC ----------------
  const displayedCustomers = searchResult ? [searchResult] : customers;

  return (
    <div className="devices-container">
      <h2>Customers</h2>

      {/* Search Bar */}
      <div className="add-device-form" style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search by phone number"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <button
          style={{ backgroundColor: "#1d3557", color: "white" }}
          onClick={searchCustomer}
        >
          Search
        </button>
        {searchResult && (
          <button
            style={{ backgroundColor: "#6c757d", color: "white" }}
            onClick={clearSearch}
          >
            Clear
          </button>
        )}
      </div>

      {/* Add Customer Form */}
      <div className="add-device-form">
        <input
          type="text"
          placeholder="Full name"
          value={newCustomer.fullName}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, fullName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Phone number"
          value={newCustomer.phone}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, phone: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={newCustomer.email}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, email: e.target.value })
          }
        />
        <button onClick={addCustomer}>Add Customer</button>
      </div>

      {/* Customers Table */}
      <table className="devices-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {displayedCustomers.map((c) => (
            <tr key={c._id}>
              {editId === c._id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editData.fullName}
                      onChange={(e) =>
                        setEditData({ ...editData, fullName: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editData.phone}
                      onChange={(e) =>
                        setEditData({ ...editData, phone: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => saveEdit(c._id)}
                    >
                      Save
                    </button>
                    <button
                      className="delete-btn"
                      style={{ backgroundColor: "#6c757d" }}
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{c.fullName}</td>
                  <td>{c.phone}</td>
                  <td>{c.email || "—"}</td>
                  <td>
                    <button
                      className="delete-btn"
                      style={{ backgroundColor: "#457b9d" }}
                      onClick={() => startEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteCustomer(c._id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTab;
