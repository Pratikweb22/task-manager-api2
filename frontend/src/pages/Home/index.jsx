import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";
import { GetCurrentUser } from "../../apicalls/user";

const { Title, Paragraph } = Typography;

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await GetCurrentUser();
        if (res?.success) {
          // Redirect logged-in users to their dashboard
          navigate(res.data.role === "admin" ? "/admin" : "/user", { replace: true });
        }
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to right, #4facfe, #00f2fe)",
        textAlign: "center",
        color: "white",
      }}
    >
      <Title level={1} style={{ color: "white", marginBottom: "10px" }}>
        🚀 Task Manager
      </Title>
      <Paragraph style={{ fontSize: "18px", marginBottom: "40px" }}>
        Welcome to Task Manager — organize your work efficiently!
      </Paragraph>

      <Button
        type="primary"
        size="large"
        onClick={() => navigate("/register")}
        style={{
          borderRadius: "8px",
          padding: "10px 30px",
          fontSize: "16px",
        }}
      >
        Register
      </Button>
    </div>
  );
}

export default Home;



