import { Avatar, Badge } from "@mantine/core";
import { Menu, Table, Tabs, Tooltip } from "@mantine/core";
import { IconDotsVertical, IconLockOpen2, IconX, IconEdit, IconLock, IconTrash } from "@tabler/icons-react";
import React from "react";
import { deleteTicketApi, updateTicketStatus } from "../services/api";
import { notifications } from "@mantine/notifications";

import { useDisclosure } from "@mantine/hooks";
import { IconInbox } from "@tabler/icons-react";
import { Card, Paper, TextInput, Pagination, Group, ActionIcon, Select, Stack, Text, Flex } from "@mantine/core";
import { IconSearch, IconFilter, IconSortAscending, IconSortDescending, IconEye as IconEyeTabler } from "@tabler/icons-react";
import { createPortal } from "react-dom";

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
  const [editForm, setEditForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    availableTime: '',
    subject: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
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
    if (ticket) {
      setSelectedTicket(ticket);
      setEditForm({
        name: ticket.name,
        email: ticket.email,
        phone: ticket.phone,
        location: ticket.location,
        availableTime: ticket.availableTime,
        subject: ticket.subject,
        description: ticket.description
      });
      open();
    }
  };

  const handleSave = async () => {
    if (!selectedTicket) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://api.82.25.95.230.nip.io/api/tickets/${selectedTicket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        notifications.show({
          title: "Success",
          message: "Ticket updated successfully",
          color: "green",
          position: "top-right",
        });
        close();
        refreshTickets();
      } else {
        const errorData = await response.json();
        notifications.show({
          title: "Error",
          message: errorData.message || "Failed to update ticket",
          color: "red",
          position: "top-right",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong. Please try again.",
        color: "red",
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mobile card component for tickets
  const TicketCard = ({ ticket, isOpen }: { ticket: any; isOpen: boolean }) => (
    <Card withBorder shadow="sm" radius="lg" p="md" className="hover:shadow-md transition-shadow">
      <Stack gap="sm">
        <Flex justify="space-between" align="center">
          <Group gap="xs">
            <Avatar color="blue" radius="xl" size="sm" src={null}>{ticket.name[0]}</Avatar>
            <div>
              <Text size="sm" fw={600}>{ticket.name}</Text>
              <Text size="xs" c="dimmed">#{ticket.id.slice(0, 8)}</Text>
            </div>
          </Group>
          <Badge 
            color={ticket.priority === "High" ? "red" : ticket.priority === "Medium" ? "yellow" : "gray"} 
            variant="light" 
            size="sm"
          >
            {ticket.priority}
          </Badge>
        </Flex>
        
        <div>
          <Text size="sm" fw={500} mb={4}>{ticket.subject}</Text>
          <Text size="xs" c="dimmed" lineClamp={2}>{ticket.description}</Text>
        </div>

        <Group justify="space-between" align="center">
          <Badge color={isOpen ? "green" : "gray"} variant="light" size="sm">
            {isOpen ? "Open" : "Closed"}
          </Badge>
          {isAdmin && (
            <Group gap="xs">
              <Tooltip label="View details">
                <ActionIcon variant="subtle" size="sm">
                  <IconEyeTabler size={16} />
                </ActionIcon>
              </Tooltip>
              <Menu shadow="md" width={150}>
                <Menu.Target>
                  <ActionIcon variant="subtle" size="sm">
                    <IconDotsVertical size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleEdit(ticket.id)}>
                    Edit
                  </Menu.Item>
                  {isOpen && (
                    <Menu.Item leftSection={<IconLock size={14} />} onClick={() => handleCloseTicket(ticket.id)}>
                      Close Ticket
                    </Menu.Item>
                  )}
                  <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => handleDelete(ticket.id)}>
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          )}
        </Group>
      </Stack>
    </Card>
  );

  return (
    <Stack gap="lg">
      {/* Search and Filters */}
      <Paper withBorder shadow="sm" radius="lg" p="md">
        <Stack gap="md">
          <TextInput
            leftSection={<IconSearch size={18} />}
            placeholder="Search tickets by name, email, or subject..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            className="w-full"
          />
          <Flex gap="sm" wrap="wrap" align="center">
            <Select
              placeholder="Filter by priority"
              data={priorities}
              value={priorityFilter}
              onChange={setPriorityFilter}
              clearable
              w={{ base: "100%", sm: 150 }}
            />
            <Tooltip label={`Sort by date (${sortBy === "asc" ? "Oldest first" : "Newest first"})`}>
              <ActionIcon 
                variant="light" 
                onClick={() => setSortBy(sortBy === "asc" ? "desc" : "asc")}
                className="hover:bg-blue-50"
              >
                {sortBy === "asc" ? <IconSortAscending size={18} /> : <IconSortDescending size={18} />}
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Clear filters">
              <ActionIcon 
                variant="light" 
                onClick={() => { setSearch(""); setPriorityFilter(null); }}
                className="hover:bg-blue-50"
              >
                <IconFilter size={18} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Stack>
      </Paper>

      {/* Tabs */}
      <Tabs defaultValue="open" variant="pills" radius="lg">
        <Tabs.List className="justify-center mb-6">
          <Tabs.Tab 
            value="open" 
            leftSection={<IconLockOpen2 size={16} />}
            className="flex-1 max-w-[200px]"
          >
            Open ({openTickets.length})
          </Tabs.Tab>
          <Tabs.Tab 
            value="closed" 
            leftSection={<IconX size={16} />}
            className="flex-1 max-w-[200px]"
          >
            Closed ({closedTickets.length})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="open">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <Table striped highlightOnHover verticalSpacing="md" horizontalSpacing="lg" withTableBorder className="rounded-xl shadow-sm border border-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr className="text-gray-700 uppercase text-xs tracking-wide">
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
                      <tr key={ticket.id} className="hover:bg-blue-50 transition-colors">
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
                            <Group gap="xs" justify="center">
                              <Tooltip label="View details">
                                <ActionIcon variant="subtle" size="sm">
                                  <IconEyeTabler size={18} />
                                </ActionIcon>
                              </Tooltip>
                              <Menu shadow="md" width={150}>
                                <Menu.Target>
                                  <ActionIcon variant="subtle" size="sm">
                                    <IconDotsVertical size={18} />
                                  </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                  <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleEdit(ticket.id)}>Edit</Menu.Item>
                                  <Menu.Item leftSection={<IconLock size={14} />} onClick={() => handleCloseTicket(ticket.id)}>Close Ticket</Menu.Item>
                                  <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => handleDelete(ticket.id)}>Delete</Menu.Item>
                                </Menu.Dropdown>
                              </Menu>
                            </Group>
                          </td>
                        ) : null}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isAdmin ? 8 : 7} className="text-center py-12 text-gray-400">
                        <div className="flex flex-col items-center justify-center">
                          <IconInbox size={48} className="mb-4" />
                          <Text size="lg" fw={500}>No open tickets found</Text>
                          <Text size="sm" c="dimmed">All tickets have been resolved</Text>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            <Stack gap="md">
              {openTickets.length > 0 ? (
                openTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} isOpen={true} />
                ))
              ) : (
                <Card withBorder p="xl" className="text-center">
                  <IconInbox size={48} className="text-gray-400 mx-auto mb-4" />
                  <Text size="lg" fw={500} c="dimmed">No open tickets found</Text>
                  <Text size="sm" c="dimmed">All tickets have been resolved</Text>
                </Card>
              )}
            </Stack>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="closed">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <Table striped highlightOnHover verticalSpacing="md" horizontalSpacing="lg" withTableBorder className="rounded-xl shadow-sm border border-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr className="text-gray-700 uppercase text-xs tracking-wide">
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
                      <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
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
                            <Group gap="xs" justify="center">
                              <Tooltip label="View details">
                                <ActionIcon variant="subtle" size="sm">
                                  <IconEyeTabler size={18} />
                                </ActionIcon>
                              </Tooltip>
                              <Menu shadow="md" width={150}>
                                <Menu.Target>
                                  <ActionIcon variant="subtle" size="sm">
                                    <IconDotsVertical size={18} />
                                  </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                  <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleEdit(ticket.id)}>Edit</Menu.Item>
                                  <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => handleDelete(ticket.id)}>Delete</Menu.Item>
                                </Menu.Dropdown>
                              </Menu>
                            </Group>
                          </td>
                        ) : null}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isAdmin ? 8 : 7} className="text-center py-12 text-gray-400">
                        <div className="flex flex-col items-center justify-center">
                          <IconInbox size={48} className="mb-4" />
                          <Text size="lg" fw={500}>No closed tickets found</Text>
                          <Text size="sm" c="dimmed">No tickets have been resolved yet</Text>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            <Stack gap="md">
              {closedTickets.length > 0 ? (
                closedTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} isOpen={false} />
                ))
              ) : (
                <Card withBorder p="xl" className="text-center">
                  <IconInbox size={48} className="text-gray-400 mx-auto mb-4" />
                  <Text size="lg" fw={500} c="dimmed">No closed tickets found</Text>
                  <Text size="sm" c="dimmed">No tickets have been resolved yet</Text>
                </Card>
              )}
            </Stack>
          </div>
        </Tabs.Panel>
      </Tabs>

      {/* Pagination */}
      {filtered.length > pageSize && (
        <Group justify="center" mt="lg">
          <Pagination 
            total={Math.ceil(filtered.length / pageSize)} 
            value={page} 
            onChange={setPage}
            size="sm"
            radius="md"
          />
        </Group>
      )}

      {/* Edit Modal */}
      {opened && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            minWidth: '600px',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>
                {selectedTicket ? `Edit Ticket #${selectedTicket.id.slice(0, 8)}` : 'Edit Ticket'}
              </h2>
              <button 
                onClick={close}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            {selectedTicket ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Name *</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Email *</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Phone *</label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Location *</label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Available Time *</label>
                  <input
                    type="text"
                    placeholder="Enter available time"
                    value={editForm.availableTime}
                    onChange={(e) => setEditForm({ ...editForm, availableTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Subject *</label>
                  <input
                    type="text"
                    placeholder="Enter subject"
                    value={editForm.subject}
                    onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Description *</label>
                  <div style={{ border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
                    <textarea
                      placeholder="Enter description..."
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button 
                    onClick={close}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={!editForm.name || !editForm.email || !editForm.subject || isSubmitting}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      background: (!editForm.name || !editForm.email || !editForm.subject || isSubmitting) ? '#ccc' : '#007bff',
                      color: 'white',
                      cursor: (!editForm.name || !editForm.email || !editForm.subject || isSubmitting) ? 'not-allowed' : 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', color: '#666' }}>
                <IconInbox size={48} />
                <div style={{ marginTop: '16px', fontSize: '18px', fontWeight: '500' }}>Loading ticket details...</div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </Stack>
  );
};

export default TicketTable;
