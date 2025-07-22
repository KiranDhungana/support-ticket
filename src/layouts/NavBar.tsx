import { Avatar, Button, Menu, Group, Text, Box } from "@mantine/core";
import { IconLogout2, IconSettings, IconTrash, IconUserCircle, IconBell } from "@tabler/icons-react";
import { logout } from "../services/api";

export function Navbar() {
  const handleLogout = () => {
    logout();
  };

  return (
    <Box className="fixed top-0 left-0 w-full h-[60px] bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm flex items-center justify-between px-6 z-40">
      <Group gap="md">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
          <IconBell size={20} className="text-white" />
        </div>
        <div>
          <Text size="lg" fw={700} className="text-gray-800">
            College Help Desk
          </Text>
          <Text size="xs" c="dimmed" className="text-gray-500">
            Admin Panel
          </Text>
        </div>
      </Group>

      <Group gap="sm">
        <Button 
          variant="light" 
          size="sm" 
          className="hover:bg-blue-50 text-blue-600"
        >
          <IconBell size={16} />
        </Button>
        
        <Menu shadow="lg" width={220} position="bottom-end">
          <Menu.Target>
            <Button 
              className="hover:bg-gray-50 transition-all duration-200" 
              variant="subtle"
              p="xs"
            >
              <Group gap="sm">
                <Avatar 
                  src="https://i.pravatar.cc/40" 
                  alt="user" 
                  radius="xl" 
                  size="md"
                  className="ring-2 ring-gray-100"
                />
                <div className="hidden sm:block text-left">
                  <Text size="sm" fw={500} className="text-gray-800">
                    Admin User
                  </Text>
                  <Text size="xs" c="dimmed" className="text-gray-500">
                    admin@college.edu
                  </Text>
                </div>
              </Group>
            </Button>
          </Menu.Target>

          <Menu.Dropdown className="border border-gray-200 shadow-xl">
            <Menu.Label className="text-gray-500 font-medium">Account</Menu.Label>
            <Menu.Item 
              leftSection={<IconUserCircle size={16} />}
              className="hover:bg-blue-50 text-gray-700"
            >
              Profile
            </Menu.Item>
            <Menu.Item 
              leftSection={<IconSettings size={16} />}
              className="hover:bg-blue-50 text-gray-700"
            >
              Settings
            </Menu.Item>
            
            <Menu.Divider />
            
            <Menu.Label className="text-gray-500 font-medium">Actions</Menu.Label>
            <Menu.Item 
              onClick={handleLogout} 
              leftSection={<IconLogout2 size={16} />}
              className="hover:bg-red-50 text-red-600"
            >
              Logout
            </Menu.Item>

            <Menu.Divider />
            
            <Menu.Label className="text-gray-500 font-medium">Danger Zone</Menu.Label>
            <Menu.Item 
              color="red" 
              leftSection={<IconTrash size={16} />}
              className="hover:bg-red-50"
            >
              Delete Account
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Box>
  );
}
