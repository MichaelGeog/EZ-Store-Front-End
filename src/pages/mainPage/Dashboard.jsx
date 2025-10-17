import { useContext, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";

function Dashboard() {
  const { admin, logout } = useContext(AuthContext);

  // simulate computed data (useMemo to optimize)
  const welcomeMessage = useMemo(() => {
    console.log("Computing welcome message...");
    return `Welcome back, ${admin?.firstName || "Admin"} from ${
      admin?.businessName
    }!`;
  }, [admin]);

  return (
    <div>
      <h1>{welcomeMessage}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
