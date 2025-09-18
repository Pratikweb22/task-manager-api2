import { useEffect, useState } from "react";
import { Table, message, Card } from "antd";
import { GetAllActivities } from "../../apicalls/activityroute";
import { getAllUsers } from "../../apicalls/user";

function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const usersResponse = await getAllUsers();
        if (usersResponse.success) setUsers(usersResponse.data);

        const activityResponse = await GetAllActivities();
        if (activityResponse.success) setActivities(activityResponse.data);
      } catch (err) {
        message.error("Failed to fetch activity logs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUserName = (id) => {
    const user = users.find(u => u.id === id);
    return user ? user.name : `User(id:${id})`;
  };

  const columns = [
    {
      title: "Activity",
      key: "activity",
      render: (_, record) => (
        <span>
          <b>{getUserName(record.userId)}</b> {record.message}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Card
        title="Activity Log"
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Table
          dataSource={activities.map((act) => ({ ...act, key: act.id }))}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 20 }}
        />
      </Card>
    </div>
  );
}

export default ActivityLog;
