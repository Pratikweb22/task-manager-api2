import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tabs, Card } from "antd";
import UserTasksTable from "./UserTasksTable";

function User() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
  if (!user) return; // Wait until user is loaded

  if (user.role !== "user") {
    if (user.role === "admin") navigate("/admin");
    else if (user.role === "user") navigate("/user");
    else navigate("/"); // fallback
  }
}, [user, navigate]);


  const tabItems = [
    {
      key: "1",
      label: "My Tasks",
      children: <UserTasksTable />,
    },
  ];

  return (

      <Card
        style={{
          width: "1000px",
          minHeight: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
          padding: "24px",
        }}
      >
        <Tabs items={tabItems} />
      </Card>
  );
}

export default User;
