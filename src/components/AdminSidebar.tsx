import { MantineLogo } from "@mantinex/mantine-logo";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, UnstyledButton, Group, Text, Box, Divider, ActionIcon } from "@mantine/core";
import { 
  IconLogout, 
  IconMenu2, 
  IconX, 
  IconDashboard,
  IconFileText,
  IconUsers,
  IconTicket,
  IconSettings,
  IconPlus
} from "@tabler/icons-react";
import { logout } from "../services/api";
import { useState } from "react";

interface LinkItem {
  icon: React.FC<{ size: number; stroke: number }>;
  label: string;
  path: string;
}

interface AdminSidebarProps {
  links: LinkItem[];
}

export function AdminSidebar({ links }: AdminSidebarProps) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Box className="md:hidden fixed top-4 left-4 z-50" style={{ top: '70px' }}>
        <ActionIcon
          variant="filled"
          size="lg"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          {isMobileOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
        </ActionIcon>
      </Box>

      {/* Sidebar */}
      <Box
        className={`
          fixed left-0 top-0 h-full bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-xl z-40
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:w-64 w-80
        `}
        style={{ paddingTop: '60px' }}
      >
        {/* Logo Section */}
        <Box className="p-6 border-b border-gray-100 bg-white">
          <Group gap="sm" className="justify-center">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
              <MantineLogo type="mark" size={28} />
            </div>
            <Text size="lg" fw={700} className="text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </Text>
          </Group>
        </Box>

        {/* Navigation Links */}
        <Box className="p-4 flex-1">
          <Text size="xs" fw={600} c="dimmed" className="uppercase tracking-wider mb-4 px-3 text-gray-500">
            Administration
          </Text>
          <Group gap="xs" className="flex-col items-stretch">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Tooltip 
                  label={link.label} 
                  position="right" 
                  withArrow 
                  transitionProps={{ duration: 200 }}
                  key={link.label}
                >
                  <UnstyledButton
                    component={Link}
                    to={link.path}
                    className={`
                      w-full px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 group
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                        : 'text-gray-600 hover:bg-white hover:text-gray-800 hover:shadow-md'
                      }
                    `}
                    data-active={isActive || undefined}
                  >
                    <div className={`
                      p-2 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                      }
                    `}>
                      <link.icon 
                        size={18} 
                        stroke={1.5} 
                      />
                    </div>
                    <Text 
                      size="sm" 
                      fw={isActive ? 600 : 500}
                      className={isActive ? 'text-white' : 'text-gray-700'}
                    >
                      {link.label}
                    </Text>
                  </UnstyledButton>
                </Tooltip>
              );
            })}
          </Group>
        </Box>

        {/* Divider */}
        <Divider className="mx-4 my-4 opacity-50" />

        {/* Logout Section */}
        <Box className="p-4">
          <Tooltip label="Logout" position="right" withArrow transitionProps={{ duration: 200 }}>
            <UnstyledButton
              onClick={handleLogout}
              className="w-full px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 group"
            >
              <div className="p-2 rounded-lg bg-red-100 text-red-500 group-hover:bg-red-200 transition-all duration-200">
                <IconLogout size={18} stroke={1.5} />
              </div>
              <Text size="sm" fw={500}>
                Logout
              </Text>
            </UnstyledButton>
          </Tooltip>
        </Box>
      </Box>
    </>
  );
} 