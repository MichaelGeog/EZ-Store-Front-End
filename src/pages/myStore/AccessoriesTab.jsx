import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const AccessoriesTab = () => {
  const [cookies] = useCookies(["token"]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);

  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  const [editProductId, setEditProductId] = useState(null);
  const [editProductData, setEditProductData] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  // ---------------- FETCH FUNCTIONS ----------------
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/accessories", {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching accessories:", err);
    }
  };

  const fetchProducts = async (categoryId) => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/accessory-products",
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
          params: { accessoryId: categoryId },
        }
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching accessory products:", err);
    }
  };

  // ---------------- CATEGORY ACTIONS ----------------
  const addCategory = async () => {
    if (!newCategory.trim()) return alert("Category name required.");
    try {
      await axios.post(
        "http://localhost:3000/api/accessories",
        { name: newCategory },
        { headers: { Authorization: `Bearer ${cookies.token}` } }
      );
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error("Error adding accessory category:", err);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await axios.delete(`http://localhost:3000/api/accessories/${id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      if (selectedCategory === id) {
        setSelectedCategory(null);
        setProducts([]);
      }
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const startEditCategory = (category) => {
    setEditCategoryId(category._id);
    setEditCategoryName(category.name);
  };

  const saveCategoryEdit = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/api/accessories/${id}`,
        { name: editCategoryName },
        { headers: { Authorization: `Bearer ${cookies.token}` } }
      );
      setEditCategoryId(null);
      setEditCategoryName("");
      fetchCategories();
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  // ---------------- PRODUCT ACTIONS ----------------
  const addProduct = async () => {
    if (!selectedCategory) return alert("Select a category first.");
    if (!newProduct.name || !newProduct.price)
      return alert("Please fill in all fields.");

    try {
      await axios.post(
        "http://localhost:3000/api/accessory-products",
        {
          accessoryId: selectedCategory,
          name: newProduct.name,
          price: newProduct.price,
          quantity: newProduct.quantity,
        },
        { headers: { Authorization: `Bearer ${cookies.token}` } }
      );
      setNewProduct({ name: "", price: "", quantity: "" });
      fetchProducts(selectedCategory);
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/accessory-products/${id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      fetchProducts(selectedCategory);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const startEditProduct = (product) => {
    setEditProductId(product._id);
    setEditProductData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    });
  };

  const saveProductEdit = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/api/accessory-products/${id}`,
        editProductData,
        { headers: { Authorization: `Bearer ${cookies.token}` } }
      );
      setEditProductId(null);
      fetchProducts(selectedCategory);
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="devices-container">
      <h2>Accessories</h2>

      {/* --- CATEGORY SECTION --- */}
      <div className="add-device-form">
        <input
          type="text"
          placeholder="Add new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={addCategory}>Add Category</button>
      </div>

      <table className="devices-table">
        <thead>
          <tr>
            <th>Accessory Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr
              key={cat._id}
              style={{
                backgroundColor:
                  selectedCategory === cat._id ? "#f1f3f5" : "white",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedCategory(cat._id);
                fetchProducts(cat._id);
              }}
            >
              <td>
                {editCategoryId === cat._id ? (
                  <input
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td>
                {editCategoryId === cat._id ? (
                  <>
                    <button
                      className="delete-btn"
                      onClick={() => saveCategoryEdit(cat._id)}
                    >
                      Save
                    </button>
                    <button
                      className="delete-btn"
                      style={{ backgroundColor: "#6c757d" }}
                      onClick={() => setEditCategoryId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="delete-btn"
                      style={{ backgroundColor: "#457b9d" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditCategory(cat);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCategory(cat._id);
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- PRODUCTS SECTION --- */}
      {selectedCategory && (
        <>
          <h3 style={{ marginTop: "30px", color: "#1d3557" }}>
            Products for:{" "}
            {categories.find((c) => c._id === selectedCategory)?.name}
          </h3>

          <div className="add-device-form">
            <input
              type="text"
              placeholder="Product name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newProduct.quantity}
              onChange={(e) =>
                setNewProduct({ ...newProduct, quantity: e.target.value })
              }
            />
            <button onClick={addProduct}>Add Product</button>
          </div>

          <table className="devices-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  {editProductId === p._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          value={editProductData.name}
                          onChange={(e) =>
                            setEditProductData({
                              ...editProductData,
                              name: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editProductData.price}
                          onChange={(e) =>
                            setEditProductData({
                              ...editProductData,
                              price: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editProductData.quantity}
                          onChange={(e) =>
                            setEditProductData({
                              ...editProductData,
                              quantity: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => saveProductEdit(p._id)}
                        >
                          Save
                        </button>
                        <button
                          className="delete-btn"
                          style={{ backgroundColor: "#6c757d" }}
                          onClick={() => setEditProductId(null)}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{p.name}</td>
                      <td>${p.price}</td>
                      <td>{p.quantity}</td>
                      <td>
                        <button
                          className="delete-btn"
                          style={{ backgroundColor: "#457b9d" }}
                          onClick={() => startEditProduct(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteProduct(p._id)}
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
        </>
      )}
    </div>
  );
};

export default AccessoriesTab;
