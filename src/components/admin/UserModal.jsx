import { useState } from "react";
import { Button } from "../ui/Button.jsx";
import { InputField } from "../ui/InputField.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Heading, Label, Text } from "../ui/Typography.jsx";

export function UserModal({
  open,
  onClose,
  selectedUser,
  onSave,
  loading = false,
}) {
  const initialForm = {
    email: selectedUser?.email || "",
    name: selectedUser?.name || "",
    password: "",
    position: selectedUser?.position || "",
    avatar_url: selectedUser?.avatar_url || "",
    bio: selectedUser?.bio || "",
  };

  const [userForm, setUserForm] = useState(initialForm);

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(userForm);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      title={selectedUser ? "Edit user" : "Create new user"}
      onClose={handleClose}
      size="md"
      actions={
        <>
          <Button
            type="submit"
            form="user-form"
            className="w-auto"
            disabled={loading}
          >
            {selectedUser ? "Save changes" : "Create user"}
          </Button>
          <Button
            type="button"
            className="w-auto bg-[#141413] hover:bg-[#30302e]"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </>
      }
    >
      <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <Label>{selectedUser ? "UPDATE USER PROFILE" : "NEW USER"}</Label>
          <Text className="text-sm text-[#5e5d59]">
            {selectedUser
              ? "Update the user's information below."
              : "Fill in the details to create a new user."}
          </Text>
        </div>

        <div className="space-y-4">
          <InputField
            id="modal-email"
            label="Email *"
            value={userForm.email}
            name="email"
            onChange={handleUserChange}
            placeholder="user@example.com"
            required
          />
          <InputField
            id="modal-name"
            label="Name"
            value={userForm.name}
            name="name"
            onChange={handleUserChange}
            placeholder="John Doe"
          />
          <InputField
            id="modal-position"
            label="Position"
            value={userForm.position}
            name="position"
            onChange={handleUserChange}
            placeholder="Senior Developer"
          />
          <InputField
            id="modal-avatar"
            label="Avatar URL"
            value={userForm.avatar_url}
            name="avatar_url"
            onChange={handleUserChange}
            placeholder="https://example.com/avatar.jpg"
          />
          <InputField
            id="modal-bio"
            label="Bio"
            value={userForm.bio}
            name="bio"
            onChange={handleUserChange}
            placeholder="Short profile biography"
          />
          <InputField
            id="modal-password"
            label="Password"
            type="password"
            value={userForm.password}
            name="password"
            onChange={handleUserChange}
            placeholder={
              selectedUser
                ? "Leave blank to keep existing password"
                : "Enter password"
            }
          />
        </div>
      </form>
    </Modal>
  );
}
