import React, { useState, useEffect } from "react";
import { Modal, Input, DatePicker, Button, message, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UpdateTask } from "../../apicalls/task";
import moment from "moment";

const { TextArea } = Input;
const { Option } = Select;

function UserEditTaskModal({ isOpen, onClose, task, fetchTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  // Prefill form when modal opens
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "pending");
      setDueDate(task.dueDate ? moment(task.dueDate) : null);
      setFiles(
        task.attachments?.map((f) => ({
          uid: f.id,
          name: f.filename,
          url: f.filepath,
        })) || []
      );
    }
  }, [task]);

  const handleUpdateTask = async () => {
    if (!title.trim() || !description.trim() || !dueDate) {
      messageApi.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("status", status);
      formData.append("dueDate", dueDate.format("YYYY-MM-DD"));

      // Append new files
      files.forEach((file) => {
        if (file.originFileObj) {
          formData.append("attachments", file.originFileObj);
        }
      });

      const response = await UpdateTask(task.id, formData);

      if (response.success) {
        messageApi.success("Task updated successfully");
        fetchTasks?.();
        onClose();
      } else {
        messageApi.error(response.message || "Failed to update task");
      }
    } catch (err) {
      messageApi.error(err.message || "Error updating task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} title="Edit Task" onCancel={onClose} footer={null}>
      {contextHolder}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <TextArea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <Select value={status} onChange={setStatus}>
          <Option value="pending">Pending</Option>
          <Option value="inprogress">In Progress</Option>
          <Option value="completed">Completed</Option>
        </Select>
        <DatePicker style={{ width: "100%" }} value={dueDate} onChange={setDueDate} />
        <Upload
          beforeUpload={() => false}
          multiple
          fileList={files}
          onChange={({ fileList }) => setFiles(fileList)}
        >
          <Button icon={<UploadOutlined />}>Upload Attachments</Button>
        </Upload>
        <Button type="primary" onClick={handleUpdateTask} loading={loading}>
          Update Task
        </Button>
      </div>
    </Modal>
  );
}

export default UserEditTaskModal;
