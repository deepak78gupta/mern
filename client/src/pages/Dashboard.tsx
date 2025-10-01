import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";


const buttonClass =
  "flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-2xl shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300 ease-in-out";

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = sessionStorage.getItem("userName"); // 👈 string | null


  const handleLogout = async () => {
    try {
      const res = await api.post("/logout");
      localStorage.removeItem("token"); // token browser se hatao
      sessionStorage.removeItem("userName"); // 👈 userName bhi clear kar do
      toast.success(res.data.message || "Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
    navigate("/login"); // login page par bhej do
  };

  return (
    <div className="p-4">
      <div className="flex p-2 justify-end gap-5 mb-20 items-center">
        {currentUser ? currentUser.toUpperCase() : "Guest"}
        <button onClick={handleLogout} className={buttonClass}>
          Logout
        </button>
      </div>
   
    
    

    </div>
  );
}
