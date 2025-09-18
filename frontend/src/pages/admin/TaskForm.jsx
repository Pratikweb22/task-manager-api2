import { Col, Modal, Row, Form, Input, Select, Button, DatePicker, Upload, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";
import { addTask } from "../../apicalls/task";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../apicalls/user";

const { Option } = Select;

function TaskForm({
  isModalOpen,
  setIsModalOpen,
  fetchAllTasks,
  currentUser
}) {
  const [users, setUsers] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response.success) {
          setUsers(response.data);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const onFinish = async (values) => {
    try {
      const taskData = {
        ...values,
        userId: currentUser.id,
        dueDate: values.dueDate.format("YYYY-MM-DD"),
        attachments: fileList,
      };

      const response = await addTask(taskData);

      if (response.success) {
        message.success("Task added successfully!");
        fetchAllTasks();
        setIsModalOpen(false);
        setFileList([]);
      } else {
        message.error(response.message || "Failed to add task");
      }
    } catch (err) {
      console.error("Error", err);
      message.error("Error adding task");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFileList([]);
  };

  return (
    <Modal
      centered
      title="Add New Task"
      open={isModalOpen}
      onCancel={handleCancel}
      width={700}
      footer={null}
    >
      <Form layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Task title is required!" }]}
            >
              <Input placeholder="Enter task title" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Task description is required!" }]}
            >
              <TextArea rows={4} placeholder="Enter task description" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Task status is required!" }]}
            >
              <Select placeholder="Select status">
                <Option value="pending">Pending</Option>
                <Option value="inprogress">In Progress</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Due Date"
              name="dueDate"
              rules={[{ required: true, message: "Due date is required!" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Assign To" name="assignedTo">
              <Select
                mode="multiple"
                placeholder="Select users to assign"
                optionLabelProp="label"
              >
                {users.map((user) => (
                  <Option key={user.id} value={user.id} label={user.name}>
                    {user.name} ({user.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Attachments">
              <Upload
                multiple
                beforeUpload={(file) => {
                  setFileList((prev) => [...prev, file]);
                  return false;
                }}
                onRemove={(file) => {
                  setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
                }}
                fileList={fileList}
              >
                <Button icon={<UploadOutlined />}>Select File(s)</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Add Task
          </Button>
          <Button block onClick={handleCancel} className="mt-2">
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TaskForm;
