import { Button, Form, Input, Radio, message, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUser } from "../../apicalls/user";

const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    console.log(values);
    try {
      const response = await RegisterUser(values);
      console.log(response);
      if (response.success) {
        messageApi.open({
          type: "success",
          content: response.message,
        });
        navigate("/login"); // redirect to login after successful registration
      } else {
        messageApi.open({
          type: "error",
          content: response.message,
        });
      }
    } catch (err) {
      messageApi.open({
        type: "error",
        content: err,
      });
    }
  };

  return (
    <div>
      {contextHolder}
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          padding: "2rem",
          borderRadius: "10px",
          background: "#fff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "black" }}>
          Register to Task Manager
        </h1>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Designation"
            name="designation"
            rules={[{ required: true, message: "Designation is required" }]}
          >
            <Select placeholder="Select your designation">
              <Option value="Software Intern">Software Intern</Option>
              <Option value="Junior Software Engineer">Junior Software Engineer</Option>
              <Option value="Senior Software Engineer">Senior Software Engineer</Option>
              <Option value="Manager">Manager</Option>
              <Option value="Senior Manager">Senior Manager</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Register as an Admin?"
            name="role"
            initialValue="user"
          >
            <Radio.Group>
              <Radio value="admin">Yes</Radio>
              <Radio value="user">No</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" block htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: "1rem", color: "black" }}>
          <p>
            Already a user? <Link to="/login">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
