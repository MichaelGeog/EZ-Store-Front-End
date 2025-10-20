import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = cookies.token;
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("http://localhost:3000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data);
      } catch (err) {
        console.error("Token invalid or expired:", err.message);
        removeCookie("token");
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    verifyAdmin();
  }, [cookies, removeCookie]);

  // useCallback prevents these from re-creating on every render
  const login = useCallback(
    (token, adminData) => {
      setCookie("token", token, { path: "/" });
      setAdmin(adminData);
    },
    [setCookie]
  );

  const logout = useCallback(() => {
    removeCookie("token", { path: "/" });
    setAdmin(null);
  }, [removeCookie]);

  // Safe dependency array
  const value = useMemo(
    () => ({ admin, login, logout, loading }),
    [admin, login, logout, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
