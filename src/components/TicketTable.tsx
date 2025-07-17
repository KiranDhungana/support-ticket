import { Avatar, Badge } from "@mantine/core";
import { Button, Menu, Table, Tabs, Tooltip } from "@mantine/core";
import { IconEye, IconDotsVertical, IconLockOpen2, IconX, IconEdit, IconLock, IconTrash } from "@tabler/icons-react";
import React from "react";
import { deleteTicketApi, updateTicketStatus } from "../services/api";
import { notifications } from "@mantine/notifications";

import { Modal } from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { IconInbox } from "@tabler/icons-react";
import { Card, Paper, TextInput, Pagination, Group, ActionIcon, Select } from "@mantine/core";
import { IconSearch, IconFilter, IconSortAscending, IconSortDescending, IconEye as IconEyeTabler } from "@tabler/icons-react";

interface TicketData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  availableTime: string;
  subject: string;
  description: string;
  status: number;
}

interface TicketTableProps {
  data: TicketData[];
  refreshTickets: any;
  isAdmin: Boolean;
}

const priorities = ["High", "Medium", "Low"];

const TicketTable: React.FC<TicketTableProps> = ({ data, refreshTickets, isAdmin }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTicket, setSelectedTicket] = React.useState<TicketData | null>(null);
  const [search, setSearch] = React.useState("");
  const [priorityFilter, setPriorityFilter] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<"asc" | "desc">("asc");
  const [page, setPage] = React.useState(1);
  const pageSize = 8;

  const ticketsWithExtras = data.map((ticket, idx) => ({
    ...ticket,
    createdAt: new Date(Date.now() - idx * 86400000).toISOString().slice(0, 10),
    priority: priorities[idx % 3],
  }));

  // Filter and search
  let filtered = ticketsWithExtras.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );
  if (priorityFilter) filtered = filtered.filter((t) => t.priority === priorityFilter);
  filtered = filtered.sort((a, b) => sortBy === "asc" ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt));

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openTickets = paged.filter((ticket) => ticket.status !== 0);
  const closedTickets = paged.filter((ticket) => ticket.status === 0);

  const handleDelete = async (ticketId: string) => {
    console.log(ticketId, "id");
    const confirmed = window.confirm("Are you sure you want to delete this ticket?");
    if (!confirmed) return;

    const success = await deleteTicketApi(ticketId);
    if (success) {
      console.log(`Ticket ${ticketId} deleted!`);
      refreshTickets();
    } else {
      alert("Failed to delete ticket.");
    }
  };

  const handleCloseTicket = async (ticketId: string) => {
    try {
      const response = await updateTicketStatus(ticketId);

      if (response && response.data.success) {
        refreshTickets();
        notifications.show({
          title: "Ticket Closed",
          message: "Your support ticket has been closed successfully.",
          color: "green",
          position: "top-right",
        });
      } else {
        notifications.show({
          title: "Failed",
          message: "Failed to close ticket.",
          color: "red",
          position: "top-right",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong. Please try again.",
        color: "red",
      });
      console.error("Ticket creation error:", error);
    }
  };

  const handleEdit = (ticketId: string) => {
    const ticket = data.find((t) => t.id === ticketId);
    setSelectedTicket(ticket || null);
    open();
  };
  return (
    <Card shadow="lg" radius="lg" p="xl" className="mt-8">
      <Group justify="space-between" align="center" mb="md">
        <TextInput
          leftSection={<IconSearch size={18} />}
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          w={240}
        />
        <Group gap="sm">
          <Select
            placeholder="Priority"
            data={priorities}
            value={priorityFilter}
            onChange={setPriorityFilter}
            clearable
            w={120}
          />
          <ActionIcon variant="subtle" onClick={() => setSortBy(sortBy === "asc" ? "desc" : "asc")}>{sortBy === "asc" ? <IconSortAscending /> : <IconSortDescending />}</ActionIcon>
          <ActionIcon variant="subtle" onClick={() => { setSearch(""); setPriorityFilter(null); }}><IconFilter /></ActionIcon>
        </Group>
      </Group>
      <Tabs defaultValue="gallery">
        <Tabs.List>
          <Tabs.Tab value="gallery" leftSection={<IconLockOpen2 size={12} />}>Open</Tabs.Tab>
          <Tabs.Tab value="messages" leftSection={<IconX size={12} />}>Closed</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="gallery">
          <div className="overflow-x-auto">
            <Table striped highlightOnHover verticalSpacing="md" horizontalSpacing="lg" withTableBorder className="rounded-xl shadow text-[15px] border border-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="text-gray-700 uppercase text-[13px] tracking-wide">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  {isAdmin ? <th className="py-3 px-4 text-center">Actions</th> : ""}
                </tr>
              </thead>
              <tbody>
                {openTickets.length > 0 ? (
                  openTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-blue-50 transition">
                      <td className="py-3 px-4 font-mono text-xs">
                        #{ticket.id.slice(0, 8)}
                        <div className="text-gray-400 text-xs">{ticket.createdAt}</div>
                      </td>
                      <td className="py-3 px-4 text-xs">{ticket.createdAt}</td>
                      <td className="py-3 px-4 font-semibold">{ticket.subject}</td>
                      <td className="py-3 px-4 text-gray-600 text-xs max-w-[200px] truncate">{ticket.description}</td>
                      <td className="py-3 px-4">
                        <Group gap="xs">
                          <Avatar color="blue" radius="xl" size="sm" src={null}>{ticket.name[0]}</Avatar>
                          <span className="text-sm">{ticket.name}</span>
                        </Group>
                      </td>
                      <td className="py-3 px-4">
                        <Badge color={ticket.priority === "High" ? "red" : ticket.priority === "Medium" ? "yellow" : "gray"} variant="light">{ticket.priority}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge color="green" variant="light">Open</Badge>
                      </td>
                      {isAdmin ? (
                        <td className="py-3 px-4">
                          <Group gap="xs">
                            <ActionIcon variant="subtle"><IconEyeTabler size={18} /></ActionIcon>
                            <Menu shadow="md" width={150}>
                              <Menu.Target>
                                <ActionIcon variant="subtle"><IconDotsVertical size={18} /></ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleEdit(ticket.id)}>Edit</Menu.Item>
                                <Menu.Item leftSection={<IconLock size={14} />} onClick={() => handleCloseTicket(ticket.id)}>Close Ticket</Menu.Item>
                                <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => handleDelete(ticket.id)}>Delete</Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Group>
                        </td>
                      ) : ("")}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-400">
                      <div className="flex flex-col items-center justify-center">
                        <IconInbox size={48} />
                        <div className="mt-2">No open tickets found</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          <Group justify="end" mt="md">
            <Pagination total={Math.ceil(filtered.length / pageSize)} value={page} onChange={setPage} />
          </Group>
        </Tabs.Panel>
        <Tabs.Panel value="messages">
          <div className="overflow-x-auto">
            <Table striped highlightOnHover verticalSpacing="md" horizontalSpacing="lg" withTableBorder className="rounded-xl shadow text-[15px] border border-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="text-gray-700 uppercase text-[13px] tracking-wide">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  {isAdmin ? <th className="py-3 px-4 text-center">Actions</th> : ""}
                </tr>
              </thead>
              <tbody>
                {closedTickets.length > 0 ? (
                  closedTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-blue-50 transition">
                      <td className="py-3 px-4 font-mono text-xs">
                        #{ticket.id.slice(0, 8)}
                        <div className="text-gray-400 text-xs">{ticket.createdAt}</div>
                      </td>
                      <td className="py-3 px-4 text-xs">{ticket.createdAt}</td>
                      <td className="py-3 px-4 font-semibold">{ticket.subject}</td>
                      <td className="py-3 px-4 text-gray-600 text-xs max-w-[200px] truncate">{ticket.description}</td>
                      <td className="py-3 px-4">
                        <Group gap="xs">
                          <Avatar color="blue" radius="xl" size="sm" src={null}>{ticket.name[0]}</Avatar>
                          <span className="text-sm">{ticket.name}</span>
                        </Group>
                      </td>
                      <td className="py-3 px-4">
                        <Badge color={ticket.priority === "High" ? "red" : ticket.priority === "Medium" ? "yellow" : "gray"} variant="light">{ticket.priority}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge color="gray" variant="light">Closed</Badge>
                      </td>
                      {isAdmin ? (
                        <td className="py-3 px-4">
                          <Group gap="xs">
                            <ActionIcon variant="subtle"><IconEyeTabler size={18} /></ActionIcon>
                            <Menu shadow="md" width={150}>
                              <Menu.Target>
                                <ActionIcon variant="subtle"><IconDotsVertical size={18} /></ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleEdit(ticket.id)}>Edit</Menu.Item>
                                <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => handleDelete(ticket.id)}>Delete</Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Group>
                        </td>
                      ) : ("")}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-400">
                      <div className="flex flex-col items-center justify-center">
                        <IconInbox size={48} />
                        <div className="mt-2">No closed tickets found</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          <Group justify="end" mt="md">
            <Pagination total={Math.ceil(filtered.length / pageSize)} value={page} onChange={setPage} />
          </Group>
        </Tabs.Panel>
      </Tabs>
      {/* Modal remains unchanged */}
      <Modal opened={opened} onClose={close} title="Edit Ticket" centered>
        <div className="bg-gray-50 p-6 rounded-lg shadow flex flex-col gap-2">
          {selectedTicket ? (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Avatar color="blue" radius="xl" size="md" src={null}>{selectedTicket.name[0]}</Avatar>
                <span className="font-semibold text-lg">{selectedTicket.name}</span>
              </div>
              <div><strong>Email:</strong> {selectedTicket.email}</div>
              <div><strong>Phone:</strong> {selectedTicket.phone}</div>
              <div><strong>Location:</strong> {selectedTicket.location}</div>
              <div><strong>Available Time:</strong> {selectedTicket.availableTime}</div>
              <div><strong>Subject:</strong> {selectedTicket.subject}</div>
              <div><strong>Description:</strong> {selectedTicket.description}</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <IconInbox size={48} />
              <div className="mt-2">Loading ticket...</div>
            </div>
          )}
        </div>
      </Modal>
    </Card>
  );
};

export default TicketTable;
