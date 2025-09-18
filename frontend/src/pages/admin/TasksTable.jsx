import { useState, useEffect } from "react";
import { GetAllTasks } from "../../apicalls/task";
import { GetCommentsByTask, AddComment, DeleteComment, UpdateComment } from "../../apicalls/comment";
import { showLoading, hideLoading } from "../../redux/loaderSlice";
import { useDispatch, useSelector } from "react-redux";
import { message, Table, Tag, Modal, Input, Button, List, Select, Row, Col, AutoComplete } from "antd";
import DeleteTaskModal from "./DeleteTaskModal";
import EditTaskModal from "./EditTaskModal";
import AddTaskModal from "./AddTaskModal";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const TasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [assignedUserFilter, setAssignedUserFilter] = useState(undefined);
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.user);

  // Fetch tasks
  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await GetAllTasks();
      if (Array.isArray(response)) {
        const formatted = response.map(task => ({ ...task, key: `task${task.id}` }));
        setTasks(formatted);
        setFilteredTasks(formatted);

        // Extract unique users
        const uniqueUsers = {};
        formatted.forEach(task => {
          task.assignees?.forEach(user => { uniqueUsers[user.id] = user; });
        });
        setUsers(Object.values(uniqueUsers).sort((a, b) => a.name.localeCompare(b.name)));
      } else {
        message.error(response.message || "Failed to fetch tasks");
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      message.error(err.message);
    }
  };

  useEffect(() => { getData(); }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...tasks];
    if (statusFilter) filtered = filtered.filter(task => task.status === statusFilter);
    if (assignedUserFilter) {
      filtered = filtered.filter(task =>
        task.assignees?.some(a => a.email.toLowerCase().includes(assignedUserFilter.toLowerCase()))
      );
    }
    setFilteredTasks(filtered);
  }, [statusFilter, assignedUserFilter, tasks]);

  // Open task modal
  const openTaskModal = async (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    setEditingCommentId(null);
    try {
      const response = await GetCommentsByTask(task.id);
      if (response.success) setComments(response.data);
    } catch (err) {
      message.error(err.message);
    }
  };

  const openEditTaskModal = (task) => { setSelectedTask(task); setIsEditModalOpen(true); };
  const openDeleteTaskModal = (task) => { setSelectedTask(task); setIsDeleteModalOpen(true); };

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await AddComment({
        taskId: selectedTask.id,
        userId: currentUser.id,
        text: newComment.trim(),
      });
      if (response.success) {
        setComments(prev => [...prev, response.data]);
        setNewComment("");
      } else {
        message.error(response.message || "Failed to add comment");
      }
    } catch (err) {
      message.error(err.message || "Error adding comment");
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await DeleteComment(commentId);
      if (response.success) setComments(prev => prev.filter(c => c.id !== commentId));
      else message.error(response.message || "Failed to delete comment");
    } catch (err) {
      message.error(err.message || "Error deleting comment");
    }
  };

  // Edit comment
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.text);
  };

  // Update comment
  const handleUpdateComment = async () => {
    if (!editingCommentText.trim()) return;
    try {
      const response = await UpdateComment(editingCommentId, { text: editingCommentText.trim() });
      if (response.success) {
        setComments(prev => prev.map(c => c.id === editingCommentId ? { ...c, text: editingCommentText.trim() } : c));
        setEditingCommentId(null);
        setEditingCommentText("");
      } else {
        message.error(response.message || "Failed to update comment");
      }
    } catch (err) {
      message.error(err.message || "Error updating comment");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
   {
     title: "Description",
     dataIndex: "description",
     key: "description",
     render: text => {
       if (!text) return "";
       const MAX_CHARS = 50; // show only first 50 characters
       return text.length > MAX_CHARS ? `${text.slice(0, MAX_CHARS)}...` : text;
     }
    },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Due Date", dataIndex: "dueDate", render: date => new Date(date).toLocaleDateString() },
    { title: "Created By", dataIndex: ["creator", "name"], key: "creatorName" },
    {
      title: "Assignees",
      dataIndex: "assignees",
      key: "assignees",
      render: assignees => assignees && assignees.length > 0 ? assignees.map(a => <Tag key={a.id}>{a.name}</Tag>) : <span>No Assignees</span>
    },
    {
      title: "Attachments",
      dataIndex: "attachments",
      key: "attachments",
      render: files => files && files.length > 0 ? files.map(file => {
        const backendURL = "http://localhost:8080";
        return <div key={file.id}><a href={`${backendURL}${file.filepath}`} target="_blank" rel="noopener noreferrer">{file.filename}</a></div>;
      }) : <span>No Files</span>
    },
    {
  title: "Actions",
  key: "actions",
  render: (_, record) =>
    currentUser.role === "admin" && (
      <div style={{ display: "flex", gap: 10 }}>
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={() => openEditTaskModal(record)}
        >
        </Button>
        <Button 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => openDeleteTaskModal(record)}
        >
        </Button>
      </div>
    ),
},

  ];

  return (
    <>
      {currentUser.role === "admin" && (
        <Button type="primary" style={{ marginBottom: 20 }} onClick={() => setIsAddModalOpen(true)}>Add New Task</Button>
      )}

      {/* Filters */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Select placeholder="Filter by Status" value={statusFilter} onChange={setStatusFilter} style={{ width: "100%" }} allowClear>
            <Option value="pending">Pending</Option>
            <Option value="in-progress">In Progress</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </Col>
        <Col span={8}>
          <AutoComplete
            options={users.map(u => ({ value: u.email, label: `${u.name} (${u.email})` }))}
            style={{ width: "100%" }}
            placeholder="Filter by Assigned User"
            value={assignedUserFilter}
            onChange={setAssignedUserFilter}
            filterOption={(inputValue, option) => option.label.toLowerCase().includes(inputValue.toLowerCase())}
            allowClear
          />
        </Col>
      </Row>
      {/* Tasks Table */}
      {filteredTasks.length > 0 ? (
        <Table
          dataSource={filteredTasks}
          columns={columns}
          onRow={record => ({ onClick: () => openTaskModal(record), style: { cursor: "pointer" } })}
        />
      ) : <p style={{ textAlign: "center", marginTop: 20 }}>No tasks available.</p>}

     {/* Task Modal */}
<Modal
  open={isModalOpen}
  title={null}
  onCancel={() => setIsModalOpen(false)}
  footer={null}
  width={750}
  style={{ background: "#f9fafb", borderRadius: 12 }}
>
  {selectedTask && (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header with title + description */}
      <div
        style={{
          background: "linear-gradient(90deg, #4a90e2, #50bfa0)",
          padding: "16px 20px",
          borderRadius: 12,
          color: "white",
        }}
      >
        <h2 style={{ margin: 0, fontWeight: "bold" }}>{selectedTask.title}</h2>
        <p style={{ margin: "6px 0 0", opacity: 0.9 }}>
          {selectedTask.description}
        </p>
      </div>

      {/* Task Details */}
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <p>
          <b>Status:</b>{" "}
          <span
            style={{
              color:
                selectedTask.status === "completed"
                  ? "green"
                  : selectedTask.status === "pending"
                  ? "#faad14"
                  : "#1890ff",
            }}
          >
            {selectedTask.status}
          </span>
        </p>
        <p>
          <b>Due Date:</b>{" "}
          {new Date(selectedTask.dueDate).toLocaleDateString()}
        </p>
        <p>
          <b>Created By:</b> {selectedTask.creator?.name}
        </p>
        <p>
          <b>Assignees:</b>{" "}
          {selectedTask.assignees?.length > 0 ? (
            selectedTask.assignees.map((a) => (
              <Tag color="blue" key={a.id}>
                {a.name}
              </Tag>
            ))
          ) : (
            "No Assignees"
          )}
        </p>
        <p>
          <b>Attachments:</b>{" "}
          {selectedTask.attachments?.length > 0 ? (
            selectedTask.attachments.map((file) => (
              <div key={file.id}>
                <a
                  href={file.filepath}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#4a90e2" }}
                >
                  📎 {file.filename}
                </a>
              </div>
            ))
          ) : (
            "No Files"
          )}
        </p>
      </div>

      {/* Comments */}
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ marginBottom: 15 }}>💬 Comments</h3>
        <List
          bordered={false}
          dataSource={comments}
          locale={{ emptyText: "No comments yet" }}
          renderItem={(comment) => {
            const author = users.find((u) => u.id === comment.userId);
            return (
              <List.Item
                style={{
                  borderBottom: "1px solid #f0f0f0",
                  padding: "10px 0",
                }}
                actions={[
                  (comment.userId === currentUser.id ||
                    currentUser.role === "admin") && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditComment(comment)}
                      >
                      </Button>
                      <Button
                        icon={<DeleteOutlined />}
                        size="small"
                        danger
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                      </Button>
                    </div>
                  ),
                ]}
              >
                <div style={{ width: "100%" }}>
                  <p
                    style={{
                      marginBottom: 5,
                      fontWeight: "bold",
                      color: "#4a90e2",
                    }}
                  >
                    {author?.name}{" "}
                    <span style={{ fontWeight: "normal", color: "#555" }}>
                      says:
                    </span>
                  </p>
                  {editingCommentId === comment.id ? (
                    <>
                      <TextArea
                        rows={2}
                        value={editingCommentText}
                        onChange={(e) =>
                          setEditingCommentText(e.target.value)
                        }
                      />
                      <Button
                        type="primary"
                        size="small"
                        onClick={handleUpdateComment}
                        style={{ marginTop: 5 }}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <span>{comment.text}</span>
                  )}
                </div>
              </List.Item>
            );
          }}
        />

        {/* Add Comment */}
        <div style={{ marginTop: 15 }}>
          <TextArea
            rows={2}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            type="primary"
            onClick={handleAddComment}
            style={{ marginTop: 10 }}
          >
            Add Comment
          </Button>
        </div>
      </div>
    </div>
  )}
</Modal>


      {/* Add/Edit/Delete Modals */}
      {isAddModalOpen && <AddTaskModal isAddModalOpen={isAddModalOpen} setIsAddModalOpen={setIsAddModalOpen} fetchAllTasks={getData} currentUser={currentUser} />}
      {isEditModalOpen && selectedTask && <EditTaskModal isEditModalOpen={isEditModalOpen} setIsEditModalOpen={setIsEditModalOpen} selectedTask={selectedTask} setSelectedTask={setSelectedTask} fetchAllTasks={getData} />}
      {isDeleteModalOpen && selectedTask && <DeleteTaskModal isDeleteModalOpen={isDeleteModalOpen} setIsDeleteModalOpen={setIsDeleteModalOpen} selectedTask={selectedTask} setSelectedTask={setSelectedTask} fetchAllTasks={getData} setIsModalOpen={setIsModalOpen} />}
    </>
  );
};

export default TasksTable;
