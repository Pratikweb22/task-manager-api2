import { useState, useEffect } from "react";
import { getAllUsers,deleteUser } from "../../apicalls/user";
import { showLoading, hideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { message, Table,Popconfirm,Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(showLoading());

      const response = await getAllUsers();

      if (response.success) {
        // response.data should already be an array
        if (Array.isArray(response.data)) {
          setUsers(
            response.data.map((item) => ({
              ...item,
              key: `user${item.id}`,
            }))
          );
        } else {
          console.warn("Users data is not an array:", response.data);
          message.error("Invalid data format from server");
        }
      } else {
        message.error(response.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("❌ Error in getData:", err);
      message.error(err.message || "Something went wrong");
    } finally {
      dispatch(hideLoading());
    }
  };

   const handleDelete = async (id) => {
    try {
      dispatch(showLoading());
      const response = await deleteUser(id);
      if (response.success) {
        message.success("User deleted successfully");
        getData(); // refresh list
      } else {
        message.error(response.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      message.error(err.message);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Designation", dataIndex: "designation", key: "designation" },
      {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this user?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {users.length > 0 ? (
        <Table dataSource={users} columns={columns} />
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No users found or you don't have access 🚫
        </p>
      )}
    </>
  );
};

export default UsersTable;
