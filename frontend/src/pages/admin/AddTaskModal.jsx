import React, { useState, useEffect } from "react";
import { Modal, Input, Select, DatePicker, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { AddTask } from "../../apicalls/task";
import { getAllUsers } from "../../apicalls/user";

const { TextArea } = Input;
const { Option } = Select;

function AddTaskModal({ isAddModalOpen, setIsAddModalOpen, fetchAllTasks, currentUser }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState(null);
  const [assignedTo, setAssignedTo] = useState([]); 
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  // Character limits
  const MAX_TITLE_CHARS = 50;
  const MAX_DESCRIPTION_CHARS = 200;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();

        if (response.success) setUsers(response.data);
      } catch (err) {
        messageApi.error("Failed to fetch users");
      }
    };
    if (currentUser.role === "admin") fetchUsers();
  }, [currentUser]);

  const handleCancel = () => {
    setIsAddModalOpen(false);
    setTitle("");
    setDescription("");
    setStatus("pending");
    setDueDate(null);
    setAssignedTo([]);
    setFiles([]);
  };

  const handleAddTask = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    // Required validation
    if (!trimmedTitle) {
      messageApi.error("Task title is required");
      return;
    }
    if (!trimmedDescription) {
      messageApi.error("Task description is required");
      return;
    }
    if (!status) {
      messageApi.error("Task status is required");
      return;
    }
    if (!dueDate) {
      messageApi.error("Due date is required");
      return;
    }

    // Character validation
    if (trimmedTitle.length > MAX_TITLE_CHARS) {
      messageApi.error(`Title cannot exceed ${MAX_TITLE_CHARS} characters`);
      return;
    }
    if (trimmedDescription.length > MAX_DESCRIPTION_CHARS) {
      messageApi.error(`Description cannot exceed ${MAX_DESCRIPTION_CHARS} characters`);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", trimmedTitle);
      formData.append("description", trimmedDescription);
      formData.append("status", status);
      formData.append("dueDate", dueDate.format("YYYY-MM-DD"));

      if (currentUser.role === "admin" && assignedTo.length > 0) {
        formData.append("assignedTo", JSON.stringify(assignedTo));
      }

      files.forEach(file => formData.append("attachments", file.originFileObj));

      const response = await AddTask(formData, currentUser);

      if (response.success) {
        messageApi.success("Task added successfully");
        fetchAllTasks();
        handleCancel();
      } else {
        messageApi.error(response.message || "Failed to add task");
      }
    } catch (err) {
      messageApi.error(err.message || "Error adding task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isAddModalOpen} title="Add New Task" onCancel={handleCancel} footer={null}>
      {contextHolder}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Input
          placeholder={`Task Title`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={MAX_TITLE_CHARS}
        />
        <TextArea
          rows={4}
          placeholder={`Task Description`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={MAX_DESCRIPTION_CHARS}
        />
        <Select value={status} onChange={setStatus} style={{ width: "100%" }}>
          <Option value="pending">Pending</Option>
          <Option value="in-progress">In Progress</Option>
          <Option value="completed">Completed</Option>
        </Select>
        <DatePicker style={{ width: "100%" }} value={dueDate} onChange={setDueDate} />

        {currentUser.role === "admin" && (
          <Select
            mode="multiple"
            placeholder="Assign Users"
            value={assignedTo}
            onChange={setAssignedTo}
            style={{ width: "100%" }}
          >
            {users
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(user => (
                <Option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </Option>
              ))}
          </Select>
        )}

        <Upload
          beforeUpload={() => false}
          multiple
          fileList={files}
          onChange={({ fileList }) => setFiles(fileList)}
        >
          <Button icon={<UploadOutlined />}>Upload Attachments</Button>
        </Upload>

        <Button type="primary" onClick={handleAddTask} loading={loading}>
          Add Task
        </Button>
      </div>
    </Modal>
  );
}


export default AddTaskModal;