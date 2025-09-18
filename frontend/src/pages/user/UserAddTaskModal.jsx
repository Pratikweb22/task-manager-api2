import React, { useState } from "react";
import { Modal, Input, DatePicker, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { AddTask } from "../../apicalls/task";

const { TextArea } = Input;

function UserAddTaskModal({ isOpen, onClose, fetchTasks, currentUser }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const handleCancel = () => {
    onClose();
    setTitle("");
    setDescription("");
    setStatus("pending");
    setDueDate(null);
    setFiles([]);
  };

  const handleAddTask = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !trimmedDescription || !dueDate) {
      messageApi.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", trimmedTitle);
      formData.append("description", trimmedDescription);
      formData.append("status", status);
      formData.append("dueDate", dueDate.format("YYYY-MM-DD"));

      formData.append("assignedTo", currentUser.id);

      // Attach files
      files.forEach((file) => formData.append("attachments", file.originFileObj));

      const response = await AddTask(formData, currentUser);

      if (response.success) {
        messageApi.success("Task added successfully");
        fetchTasks?.();
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
    <Modal open={isOpen} title="Add New Task" onCancel={handleCancel} footer={null}>
      {contextHolder}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Input
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextArea
          rows={4}
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <DatePicker style={{ width: "100%" }} value={dueDate} onChange={setDueDate} />
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

export default UserAddTaskModal;
