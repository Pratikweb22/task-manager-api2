import { useState, useEffect } from "react";
import { GetAllTasks } from "../../apicalls/task";
import { GetCommentsByTask, AddComment, DeleteComment, UpdateComment } from "../../apicalls/comment";
import { showLoading, hideLoading } from "../../redux/loaderSlice";
import { useDispatch, useSelector } from "react-redux";
import { message, Table, Tag, Modal, Input, Button, List, Select, Row, Col } from "antd";
import UserAddTaskModal from "./UserAddTaskModal";
import UserEditTaskModal from "./UserEditTaskModal";

const { TextArea } = Input;
const { Option } = Select;

const UserTasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false); 
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [statusFilter, setStatusFilter] = useState(undefined);

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);

  // Fetch tasks
  const getData = async () => {
    if (!currentUser?.id) return;
    try {
      dispatch(showLoading());
      const tasksArray = await GetAllTasks();
      dispatch(hideLoading());

      if (Array.isArray(tasksArray)) {
        const formatted = tasksArray
          .filter(
            (task) =>
              task.userId === currentUser.id ||
              task.assignees?.some((a) => a.id === currentUser.id)
          )
          .map((task) => ({ ...task, key: `task${task.id}` }));
        setTasks(formatted);
        setFilteredTasks(formatted);
      } else {
        message.error("Failed to fetch tasks");
      }
    } catch (err) {
      dispatch(hideLoading());
      message.error(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, [currentUser?.id]);

  // Status filter
  useEffect(() => {
    if (!statusFilter) {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter((task) => task.status === statusFilter));
    }
  }, [tasks, statusFilter]);

  // Open Task Details Modal
  const openTaskModal = async (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
    setEditingCommentId(null);

    try {
      const response = await GetCommentsByTask(task.id);
      if (response.success) setComments(response.data);
    } catch (err) {
      message.error(err.message);
    }
  };

  // Comments handlers...
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await AddComment({
        taskId: selectedTask.id,
        userId: currentUser.id,
        text: newComment.trim(),
      });
      if (response.success) {
        setComments((prev) => [...prev, response.data]);
        setNewComment("");
      } else {
        message.error(response.message || "Failed to add comment");
      }
    } catch (err) {
      message.error(err.message || "Error adding comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await DeleteComment(commentId);
      if (response.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } else {
        message.error(response.message || "Failed to delete comment");
      }
    } catch (err) {
      message.error(err.message || "Error deleting comment");
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.text);
  };

  const handleUpdateComment = async () => {
    if (!editingCommentText.trim()) return;
    try {
      const response = await UpdateComment(editingCommentId, {
        text: editingCommentText.trim(),
      });
      if (response.success) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === editingCommentId ? { ...c, text: editingCommentText.trim() } : c
          )
        );
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
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    { title: "Created By", dataIndex: ["creator", "name"], key: "creatorName" },
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
      render: (_, task) =>
        task.creator?.id === currentUser.id ||
        task.assignees?.some((a) => a.id === currentUser.id) ? (
          <Button
            type="link"
            onClick={(e) => {
              e.stopPropagation(); // prevent row click
              setSelectedTask(task);
              setIsEditTaskModalOpen(true);
            }}
          >
            Edit
          </Button>
        ) : null,
    },
  ];

  return (
    <>
      {/* Filter + Add Task Button */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={16}>
          <Select
            placeholder="Filter by Status"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            style={{ width: "100%" }}
            allowClear
          >
            <Option value="pending">Pending</Option>
            <Option value="inprogress">In Progress</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Button type="primary" onClick={() => setIsAddTaskModalOpen(true)}>
            + Add Task
          </Button>
        </Col>
      </Row>

      {/* Tasks Table */}
      {filteredTasks.length > 0 ? (
        <Table
          dataSource={filteredTasks}
          columns={columns}
          onRow={(record) => ({
            onClick: () => openTaskModal(record),
            style: { cursor: "pointer" },
          })}
        />
      ) : (
        <p style={{ textAlign: "center", marginTop: 20 }}>No tasks available.</p>
      )}

      {/* User Add Task Modal */}
      <UserAddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        currentUser={currentUser}
        fetchTasks={getData}
      />

      {/* Edit Task Modal (reused from admin) */}
      {isEditTaskModalOpen && selectedTask && (
        <UserEditTaskModal
          isOpen={isEditTaskModalOpen}
          onClose={() => setIsEditTaskModalOpen(false)}
          task={selectedTask}
          fetchTasks={getData}
        />
      )}
      <Modal
  open={isTaskModalOpen}
  onCancel={() => setIsTaskModalOpen(false)}
  title={null} // we'll create a custom header
  footer={null}
  width={800}
  style={{ padding: "24px", background: "#fafafa", borderRadius: "12px" }}
>
  {selectedTask && (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #e8e8e8",
          paddingBottom: 12,
          marginBottom: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>{selectedTask.title}</h2>
        <p style={{ color: "#888", margin: "4px 0 0" }}>
          Created by <b>{selectedTask.creator?.name}</b> • Due{" "}
          {new Date(selectedTask.dueDate).toLocaleDateString()}
        </p>
      </div>

      {/* Task Info Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          background: "#fff",
          padding: 16,
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <p><b>Status:</b> {selectedTask.status}</p>
        <p><b>Description:</b> {selectedTask.description}</p>
      </div>

      {/* Comments Section */}
      <div
        style={{
          marginTop: 16,
          background: "#fff",
          padding: 16,
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ marginBottom: 12 }}>💬 Comments</h3>
        <List
          dataSource={comments}
          locale={{ emptyText: "No comments yet. Be the first!" }}
          renderItem={(comment) => (
            <List.Item
              style={{ background: "#fafafa", padding: "10px 16px", borderRadius: 6 }}
              actions={
                comment.userId === currentUser.id
                  ? [
                      <a key="edit" onClick={() => handleEditComment(comment)}>Edit</a>,
                      <a key="delete" onClick={() => handleDeleteComment(comment.id)}>Delete</a>,
                    ]
                  : []
              }
            >
              {editingCommentId === comment.id ? (
                <div style={{ width: "100%" }}>
                  <Input.TextArea
                    value={editingCommentText}
                    onChange={(e) => setEditingCommentText(e.target.value)}
                    rows={2}
                  />
                  <Button
                    type="primary"
                    size="small"
                    style={{ marginTop: 5 }}
                    onClick={handleUpdateComment}
                  >
                    Update
                  </Button>
                </div>
              ) : (
                <span>{comment.text}</span>
              )}
            </List.Item>
          )}
        />

        {/* Add Comment */}
        <div style={{ marginTop: 12 }}>
          <TextArea
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={handleAddComment}
            block
          >
            Add Comment
          </Button>
        </div>
      </div>
    </div>
  )}
</Modal>

    </>
  );
};

export default UserTasksTable;
