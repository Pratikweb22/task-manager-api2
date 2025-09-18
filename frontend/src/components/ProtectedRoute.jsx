import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SetUser } from "../redux/userSlice";
import { GetCurrentUser } from "../apicalls/user";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import {  Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import {
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
        return;
      }

      try {
        dispatch(showLoading());
        const response = await GetCurrentUser();

        if (response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          const fetchedUser = response.data.data;
          dispatch(SetUser(fetchedUser));

          if (window.location.pathname === "/") {
            if (fetchedUser.role === "admin") navigate("/admin");
            else if (fetchedUser.role === "user") navigate("/user");
            else navigate("/register");
          }
        }
      } catch (err) {
        dispatch(SetUser(null));
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
        dispatch(hideLoading());
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  if (loading) return null;

  return (
    <div>
      {user && (
        <>
          {/* Navbar */}
          <Header
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              background: "linear-gradient(90deg, #4a90e2, #50bfa0)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {/* Logo + Title */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src="/logo.png"
                alt="Task Manager"
                style={{ height: "50px", objectFit: "contain" }}
              />
              <span
                style={{
                  fontStyle: "italic",
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#fff",
                }}
              >
                Task Manager
              </span>
            </div>

            {/* Menu */}
            <Menu
              mode="horizontal"
              style={{
                background: "transparent",
                borderBottom: "none",
                fontWeight: "500",
              }}
            >

              <Menu.SubMenu
                 key="user"
                 title={
                 <span
                   style={{
                   display: "flex",
                   alignItems: "center",
                   gap: "6px",
                   fontWeight: "bold",
                   color: "#000", 
                  }}
                 >
                  <UserOutlined style={{ color: "#000" }} /> 
                  {user?.name || "Profile"}
                 </span>
                  }
                >
                <Menu.Item
                  key="logout"
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    dispatch(SetUser(null));
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                >
                  Logout
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Header>

          {/* Page Content */}
          <div style={{ paddingTop: 64 }}>{children}</div>
        </>
      )}
    </div>
  );
}

export default ProtectedRoute;
