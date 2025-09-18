import { Modal, message } from "antd";
import { DeleteTask } from "../../apicalls/task";

function DeleteTaskModal({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  fetchAllTasks,
  selectedTask,
  setSelectedTask,
  setIsModalOpen, 
}) {
  const handleOK = async () => {
    if (!selectedTask) return;

    try {
      // Close Delete Modal immediately
      setIsDeleteModalOpen(false);

      // Close Task Details Modal if open
      if (setIsModalOpen) setIsModalOpen(false);

      const taskId = selectedTask.id;
      const response = await DeleteTask(taskId);

      if (response.success) {
        message.success("Task deleted successfully!");
        setSelectedTask(null); 
        fetchAllTasks();
      } else {
        message.error(response.message || "Failed to delete task");
      }
    } catch (err) {
      message.error(err.message || "Error deleting task");
    }
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <Modal
      centered
      title="Delete Task?"
      open={isDeleteModalOpen}
      onOk={handleOK}
      onCancel={handleCancel}
      okText="Delete"
      okButtonProps={{ danger: true }}
    >
      <p className="pt-3 fs-18">Are you sure you want to delete this task?</p>
      <p className="pb-3 fs-18">
        This action can't be undone and you'll lose this task data.
      </p>
    </Modal>
  );
}

export default DeleteTaskModal;
