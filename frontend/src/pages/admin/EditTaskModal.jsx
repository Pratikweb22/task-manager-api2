import { Modal, Input, Select, Button, message, Upload } from "antd";
import { UpdateTask } from "../../apicalls/task"; 
import { useState, useEffect } from "react";
import { getAllUsers } from "../../apicalls/user"; // API call to fetch users

const { TextArea } = Input;
const { Option } = Select;

function EditTaskModal({
  isEditModalOpen,
  setIsEditModalOpen,
  selectedTask,
  setSelectedTask,
  fetchAllTasks,
}) {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: selectedTask?.title || "",
    description: selectedTask?.description || "",
    status: selectedTask?.status || "pending",
    dueDate: selectedTask?.dueDate || "",
    assignedTo: selectedTask?.assignees?.map(a => a.id) || [], 
  });

  // fetch users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response.success) {
          setUsers(response.data);
        }
      } catch (err) {
        message.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!formData.title || !formData.description) {
      message.error("Please fill in all required fields");
      return;
    }

    try {
      const taskId = selectedTask.id;
      const response = await UpdateTask(taskId, formData);

      if (response.success) {
        message.success("Task updated successfully!");
        fetchAllTasks();
        handleCancel();
      } else {
        message.error(response.message || "Failed to update task");
      }
    } catch (err) {
      message.error(err.message || "Error updating task");
    }
  };

  return (
    <Modal
      centered
      title="Edit Task"
      open={isEditModalOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Input
        placeholder="Title"
        value={formData.title}
        onChange={e => handleChange("title", e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <TextArea
        rows={3}
        placeholder="Description"
        value={formData.description}
        onChange={e => handleChange("description", e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Select
        placeholder="Status"
        value={formData.status}
        onChange={value => handleChange("status", value)}
        style={{ width: "100%", marginBottom: 10 }}
      >
        <Option value="pending">Pending</Option>
        <Option value="in-progress">In Progress</Option>
        <Option value="completed">Completed</Option>
      </Select>

      <Select
        mode="multiple"
        placeholder="Assign Users"
        value={formData.assignedTo}
        onChange={value => handleChange("assignedTo", value)}
        style={{ width: "100%", marginBottom: 10 }}
      >
        {users.map(user => (
          <Option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </Option>
        ))}
      </Select>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button type="primary" onClick={handleUpdate}>
          Update Task
        </Button>
      </div>
    </Modal>
  );
}

export default EditTaskModal;
