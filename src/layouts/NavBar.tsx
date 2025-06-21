import { Avatar, Button, Menu } from "@mantine/core";
import { IconLogout2, IconSettings, IconTrash, IconUserCircle } from "@tabler/icons-react";
import { logout } from "../services/api";

export function Navbar() {
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-[60px] bg-white shadow-sm flex items-center justify-between px-4 ">
      <div> College Help Desk </div>

      <div>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button className="dropdown-button" variant="subtle">
              <Avatar src="https://i.pravatar.cc/40" alt="user" radius="xl" size="md" />
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item leftSection={<IconSettings size={14} />}>Settings</Menu.Item>
            <Menu.Item leftSection={<IconUserCircle size={14} />}>Profile</Menu.Item>
            <Menu.Item onClick={handleLogout} leftSection={<IconLogout2 size={14} />}>
              Logout
            </Menu.Item>

            <Menu.Divider />

            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
              Delete my account
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  );
}
