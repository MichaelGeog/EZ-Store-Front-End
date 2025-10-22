import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPlus } from "@fortawesome/free-solid-svg-icons";

import "./registerSale.css";

const API = "http://localhost:3000/api";

/* ---------- Small modal component for Add Customer ---------- */
function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </>
  );
}

function RegisterSale() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const auth = useMemo(
    () => ({ headers: { Authorization: `Bearer ${cookies.token}` } }),
    [cookies.token]
  );

  /* ---------------------- CUSTOMER ---------------------- */
  const [phoneLookup, setPhoneLookup] = useState("");
  const [customer, setCustomer] = useState(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  async function searchCustomer() {
    if (!phoneLookup.trim()) return;
    try {
      const { data } = await axios.get(`${API}/customers/search`, {
        ...auth,
        params: { phone: phoneLookup.trim() },
      });
      setCustomer(data);
    } catch {
      // Not found -> prompt to add
      setCustomer(null);
      setNewCustomer((c) => ({ ...c, phone: phoneLookup.trim() }));
      setShowAddCustomer(true);
    }
  }

  async function createCustomer() {
    try {
      const body = {
        fullName: newCustomer.fullName.trim(),
        phone: newCustomer.phone.trim(),
        email: newCustomer.email.trim(),
      };
      if (!body.fullName || !body.phone) {
        alert("Full name and phone are required.");
        return;
      }
      const { data } = await axios.post(`${API}/customers`, body, auth);
      setCustomer(data);
      setShowAddCustomer(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add customer.");
    }
  }

  /* ---------------------- CATEGORIES ---------------------- */
  const [accessories, setAccessories] = useState([]); // left panel categories (besides Devices)
  const [activeCategory, setActiveCategory] = useState("devices"); // 'devices' or accessoryId
  const [storeSearch, setStoreSearch] = useState("");

  useEffect(() => {
    // load accessories list for left column
    (async () => {
      try {
        const { data } = await axios.get(`${API}/accessories`, auth);
        setAccessories(data);
      } catch (err) {
        console.error("Load accessories error:", err);
      }
    })();
  }, [auth]);

  /* ---------------------- DEVICES (base + selling units) ---------------------- */
  const [baseDevices, setBaseDevices] = useState([]); // Device base entries (brand/model/type)
  const [modelsFiltered, setModelsFiltered] = useState([]); // derived for middle col
  const [selectedModel, setSelectedModel] = useState(null); // a Device document
  const [sellingUnits, setSellingUnits] = useState([]); // actual units for selected device (imei, price)

  async function loadBaseDevices() {
    try {
      const { data } = await axios.get(`${API}/devices`, auth);
      setBaseDevices(data.filter((d) => d.type === "selling"));
    } catch (err) {
      console.error("Load devices error:", err);
    }
  }

  async function loadSellingUnits(deviceId) {
    try {
      const { data } = await axios.get(`${API}/selling-devices`, {
        ...auth,
        params: { deviceId },
      });
      // Show only in-stock items to sell
      setSellingUnits(data.filter((u) => u.status !== "sold"));
    } catch (err) {
      console.error("Load selling units error:", err);
    }
  }

  // compute "brand model" buttons for middle col (when Devices selected)
  useEffect(() => {
    if (activeCategory !== "devices") return;
    const q = storeSearch.trim().toLowerCase();
    const list = baseDevices
      .map((d) => ({ ...d, label: `${d.brand} ${d.model}` }))
      .filter((d) => (q ? d.label.toLowerCase().includes(q) : true));
    setModelsFiltered(list);
  }, [activeCategory, storeSearch, baseDevices]);

  useEffect(() => {
    loadBaseDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // auth token assumed stable from cookie

  /* Whenever user chooses a model in col2, load its units */
  function pickModel(device) {
    setSelectedModel(device);
    loadSellingUnits(device._id);
  }

  /* ---------------------- ACCESSORY PRODUCTS ---------------------- */
  const [products, setProducts] = useState([]); // middle col when an accessory category is selected

  async function loadAccessoryProducts(accessoryId) {
    try {
      const { data } = await axios.get(`${API}/accessory-products`, {
        ...auth,
        params: { accessoryId },
      });
      setProducts(data);
    } catch (err) {
      console.error("Load accessory products error:", err);
    }
  }

  useEffect(() => {
    // switch middle panel content based on category
    setSelectedModel(null);
    setSellingUnits([]);
    setProducts([]);
    if (activeCategory !== "devices") {
      loadAccessoryProducts(activeCategory);
    }
  }, [activeCategory]); // eslint-disable-line

  /* ---------------------- CART (right column) ---------------------- */
  const [cart, setCart] = useState([]); // {key, type, name, price, qty, ids:{...}}

  const total = useMemo(
    () => cart.reduce((sum, it) => sum + Number(it.price) * Number(it.qty), 0),
    [cart]
  );

  // add selling unit (qty fixed to 1, unique by unit id)
  function addSellingToCart(unit, baseDevice) {
    const key = `sell:${unit._id}`;
    if (cart.some((c) => c.key === key)) return; // prevent duplicates
    setCart((prev) => [
      ...prev,
      {
        key,
        type: "selling",
        name: `${baseDevice.brand} ${baseDevice.model} — IMEI: ${unit.imei}`,
        price: unit.price,
        qty: 1,
        ids: { sellingDeviceId: unit._id },
      },
    ]);
  }

  // add accessory product (merge by product id; qty adjustable)
  function addAccessoryToCart(product) {
    const key = `acc:${product._id}`;
    setCart((prev) => {
      const found = prev.find((p) => p.key === key);
      if (found) {
        return prev.map((p) => (p.key === key ? { ...p, qty: p.qty + 1 } : p));
      }
      return [
        ...prev,
        {
          key,
          type: "accessory",
          name: `${product.name}`,
          price: product.price,
          qty: 1,
          ids: { accessoryProductId: product._id },
        },
      ];
    });
  }

  function incQty(key) {
    setCart((prev) =>
      prev.map((p) => (p.key === key ? { ...p, qty: p.qty + 1 } : p))
    );
  }
  function decQty(key) {
    setCart((prev) =>
      prev
        .map((p) => (p.key === key ? { ...p, qty: Math.max(1, p.qty - 1) } : p))
        .filter(Boolean)
    );
  }

  function removeItem(key) {
    setCart((prev) => prev.filter((p) => p.key !== key));
  }

  /* ---------------------- RENDER ---------------------- */
  return (
    <div className="reg-container">
      {/* NAV */}
      <nav>
        <FontAwesomeIcon
          icon={faHouse}
          className="home-icon"
          onClick={() => navigate("/dashboard")}
        />
        <h2>Register Sale</h2>
      </nav>

      <div className="grid-container">
        {/* ---------------- LEFT ---------------- */}
        <div className="col1">
          {/* Customer Info */}
          <div className="cust-info">
            <div className="cust-search">
              <input
                type="text"
                placeholder="Search Using Phone Number"
                value={phoneLookup}
                onChange={(e) => setPhoneLookup(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchCustomer()}
              />
              <FontAwesomeIcon
                icon={faPlus}
                className="plus-icon"
                title="Add Customer"
                onClick={() => {
                  setNewCustomer({ fullName: "", phone: "", email: "" });
                  setShowAddCustomer(true);
                }}
              />
            </div>

            <label>Full Name</label>
            <input type="text" disabled value={customer?.fullName || ""} />

            <label>Phone Number</label>
            <input type="text" disabled value={customer?.phone || ""} />

            <label>Email</label>
            <input type="text" disabled value={customer?.email || ""} />
          </div>

          {/* Categories */}
          <div className="categories">
            <input
              type="text"
              placeholder="Search an item in store"
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
            />
            <label>Store</label>
            <div className="cat-container">
              <div
                className={`cat ${
                  activeCategory === "devices" ? "active" : ""
                }`}
                onClick={() => setActiveCategory("devices")}
              >
                Selling Devices
              </div>

              {accessories.map((acc) => (
                <div
                  key={acc._id}
                  className={`cat ${
                    activeCategory === acc._id ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(acc._id)}
                >
                  {acc.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- MIDDLE ---------------- */}
        <div className="col2">
          {activeCategory === "devices"
            ? // Show device models FIRST
              !selectedModel
              ? modelsFiltered.map((m) => (
                  <div
                    key={m._id}
                    className="subcat"
                    onClick={() => pickModel(m)}
                  >
                    {m.brand} {m.model}
                  </div>
                ))
              : // Show concrete units for selected model
                sellingUnits
                  .filter((u) => {
                    const q = storeSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      `${selectedModel.brand} ${selectedModel.model} ${u.imei}`
                        .toLowerCase()
                        .includes(q) || String(u.price).includes(q)
                    );
                  })
                  .map((u) => (
                    <div
                      key={u._id}
                      className="subcat"
                      onClick={() => addSellingToCart(u, selectedModel)}
                      title="Add to cart"
                    >
                      <div style={{ fontWeight: 600 }}>
                        {selectedModel.brand} {selectedModel.model}
                      </div>
                      <div style={{ padding: "10px 0", fontSize: "1rem" }}>
                        IMEI: {u.imei}
                      </div>
                      <div>${u.price}</div>
                    </div>
                  ))
            : // Accessory products list
              products
                .filter((p) => {
                  const q = storeSearch.trim().toLowerCase();
                  return q ? p.name.toLowerCase().includes(q) : true;
                })
                .map((p) => (
                  <div
                    key={p._id}
                    className="subcat"
                    onClick={() => addAccessoryToCart(p)}
                    title="Add to cart"
                  >
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ padding: "10px 0", fontSize: "1rem" }}>
                      Qty: {p.quantity}
                    </div>
                    <div style={{ fontSize: "1rem" }}>${p.price}</div>
                  </div>
                ))}
        </div>

        {/* ---------------- RIGHT ---------------- */}
        <div className="col3">
          <div className="summary">
            <label>Sale Items</label>

            <div className="items-container">
              {cart.length === 0 && <div className="item">No items yet.</div>}

              {cart.map((it) => (
                <div key={it.key} className="item">
                  <div className="item-top">
                    <span>{it.name}</span>

                    {it.type === "accessory" ? (
                      <div className="qty-control">
                        <button onClick={() => decQty(it.key)}>-</button>
                        <span>{it.qty}</span>
                        <button onClick={() => incQty(it.key)}>+</button>
                      </div>
                    ) : (
                      // selling devices have fixed qty = 1
                      <div className="qty-control">
                        <span>Qty: 1</span>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <p style={{margin: "0px"}}>Price: ${it.price}</p>
                    <button
                      className="delete-btn"
                      onClick={() => removeItem(it.key)}
                      style={{ height: "fit-content", padding: "4px 10px" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{ fontWeight: 700, color: "#1d3557", marginBottom: 10 }}
            >
              Total: ${total.toFixed(2)}
            </div>

            <button
              className="checkout-btn"
              onClick={() => alert("Checkout flow TBD")}
              disabled={!customer || cart.length === 0}
              title={!customer ? "Select or add a customer first" : undefined}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* --------------- Add Customer Modal --------------- */}
      <Modal
        open={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
        title="Add Customer"
      >
        <div className="add-cust-form">
          <label>Full Name</label>
          <input
            type="text"
            value={newCustomer.fullName}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, fullName: e.target.value })
            }
          />
          <label>Phone</label>
          <input
            type="text"
            value={newCustomer.phone}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, phone: e.target.value })
            }
          />
          <label>Email</label>
          <input
            type="email"
            value={newCustomer.email}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, email: e.target.value })
            }
          />

          <div className="modal-actions">
            <button
              className="btn-secondary"
              onClick={() => setShowAddCustomer(false)}
            >
              Cancel
            </button>
            <button className="btn-primary" onClick={createCustomer}>
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default RegisterSale;
