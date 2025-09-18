import  { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tabs, Card } from "antd";
import UsersTable from "./UsersTable";
import TasksTable from "./TasksTable";
import ActivityLog from "./ActivityLogModal";

function Admin() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

useEffect(() => {
  if (!user) return;
  if (user.role !== "admin") navigate("/"); 
}, [user, navigate]);
  const tabItems = [
    {
      key: "1",
      label: "Users",
      children: <UsersTable />,
    },
    {
      key: "2",
      label: "Tasks",
      children: <TasksTable />,
    },
    {
      key: "3",
      label: "Activity Log",
      children: <ActivityLog />,
    },
  ];

  return (
    <div style={{ padding: "100px 20px" }}>

      <Card
        style={{
          width: "1200px",
          minHeight: "1000px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
          padding: "24px",
        }}
      >
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
}

export default Admin;
