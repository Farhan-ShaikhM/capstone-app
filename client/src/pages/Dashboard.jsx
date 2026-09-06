import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Welcome, {user?.name}!</h2>

      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;