import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoginUser, GetCurrentUser } from "../../apicalls/user";
import { SetUser } from "../../redux/userSlice";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      const response = await LoginUser(values);

      if (response.success && response.token) {
        localStorage.setItem("token", response.token);

        // Fetch user data after login
        const userResponse = await GetCurrentUser();
        const fetchedUser = userResponse.data.data;
        dispatch(SetUser(fetchedUser));

        // Redirect based on role
        if (fetchedUser.role === "admin") navigate("/admin");
        else if (fetchedUser.role === "user") navigate("/user");
        else navigate("/");
      } else {
        messageApi.error(response.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      messageApi.error("Login failed. Please try again.");
    }
  };

  return (
    <div>
      {contextHolder}
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          borderRadius: "10px",
          background: "#fff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "black" }}>
          Login to Task Manager
        </h1>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" block htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;

