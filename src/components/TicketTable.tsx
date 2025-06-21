import { Button, Menu, Table, Tabs, Tooltip } from "@mantine/core";
import { IconEye, IconDotsVertical, IconLockOpen2, IconX, IconEdit, IconLock, IconTrash } from "@tabler/icons-react";
import React from "react";
import { deleteTicketApi, updateTicketStatus } from "../services/api";
import { notifications } from "@mantine/notifications";

import { Modal } from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
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

const TicketTable: React.FC<TicketTableProps> = ({ data, refreshTickets, isAdmin }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const [selectedTicket, setSelectedTicket] = React.useState<TicketData | null>(null);
  const openTickets = data.filter((ticket) => ticket.status !== 0);
  const closedTickets = data.filter((ticket) => ticket.status === 0);

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
    <div>
      <Modal opened={opened} onClose={close} title="Edit Ticket" centered>
        <div style={{ backgroundColor: "white", padding: "1rem", outline: "2px solid red" }}>
          Modal Content Visible?
        </div>
        {/* {selectedTicket ? (
          <div className="space-y-2 text-sm">
            <div>
              <strong>Name:</strong> {selectedTicket.name}
            </div>
            <div>
              <strong>Email:</strong> {selectedTicket.email}
            </div>
            <div>
              <strong>Phone:</strong> {selectedTicket.phone}
            </div>
            <div>
              <strong>Location:</strong> {selectedTicket.location}
            </div>
            <div>
              <strong>Available Time:</strong> {selectedTicket.availableTime}
            </div>
            <div>
              <strong>Subject:</strong> {selectedTicket.subject}
            </div>
            <div>
              <strong>Description:</strong> {selectedTicket.description}
            </div>
          </div>
        ) : (
          <p>Loading ticket...</p>
        )} */}
      </Modal>
      <Tabs defaultValue="gallery">
        <Tabs.List>
          <Tabs.Tab value="gallery" leftSection={<IconLockOpen2 size={12} />}>
            Open
          </Tabs.Tab>
          <Tabs.Tab value="messages" leftSection={<IconX size={12} />}>
            Closed
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="gallery">
          <div className="pl-4 pt-4 bg-white rounded-  overflow-x-auto">
            <Table
              striped
              highlightOnHover
              verticalSpacing="md"
              horizontalSpacing="lg"
              withTableBorder
              className="text-[15px]"
            >
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="text-gray-700 uppercase text-[13px] tracking-wide">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Available Time</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4 max-w-[200px]">Description</th>
                  {isAdmin ? <th className="py-3 px-4 text-center">Actions</th> : ""}
                </tr>
              </thead>
              <tbody>
                {openTickets.length > 0 ? (
                  openTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-100 transition">
                      <td className="py-3 px-4">{ticket.id}</td>
                      <td className="py-3 px-4">{ticket.name}</td>
                      <td className="py-3 px-4">{ticket.email}</td>
                      <td className="py-3 px-4">{ticket.phone}</td>
                      <td className="py-3 px-4">{ticket.location}</td>
                      <td className="py-3 px-4">{ticket.availableTime}</td>
                      <td className="py-3 px-4">{ticket.subject}</td>
                      <td className="py-3 px-4 max-w-[250px] truncate">
                        <Tooltip label={ticket.description} withArrow>
                          <span>{ticket.description}</span>
                        </Tooltip>
                      </td>
                      {isAdmin ? (
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-3">
                            <Menu shadow="md" width={150}>
                              <Menu.Target>
                                <Button variant="subtle" className="p-2">
                                  <IconDotsVertical size={20} className="text-gray-600 hover:text-gray-800" />
                                </Button>
                              </Menu.Target>

                              <Menu.Dropdown>
                                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleEdit(ticket.id)}>
                                  Edit
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconLock size={14} />}
                                  onClick={() => handleCloseTicket(ticket.id)}
                                >
                                  Close Ticket
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconTrash size={14} />}
                                  color="red"
                                  onClick={() => handleDelete(ticket.id)}
                                >
                                  Delete
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </div>
                        </td>
                      ) : (
                        ""
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-400">
                      No tickets found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="messages">
          <div className="pl-4 pt-4 bg-white rounded-  overflow-x-auto">
            <Table
              striped
              highlightOnHover
              verticalSpacing="md"
              horizontalSpacing="lg"
              withTableBorder
              className="text-[15px]"
            >
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="text-gray-700 uppercase text-[13px] tracking-wide">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Available Time</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4 max-w-[200px]">Description</th>
                  {isAdmin ? <th className="py-3 px-4 text-center">Actions</th> : ""}
                </tr>
              </thead>
              <tbody>
                {closedTickets.length > 0 ? (
                  closedTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-100 transition">
                      <td className="py-3 px-4">{ticket.id}</td>
                      <td className="py-3 px-4">{ticket.name}</td>
                      <td className="py-3 px-4">{ticket.email}</td>
                      <td className="py-3 px-4">{ticket.phone}</td>
                      <td className="py-3 px-4">{ticket.location}</td>
                      <td className="py-3 px-4">{ticket.availableTime}</td>
                      <td className="py-3 px-4">{ticket.subject}</td>
                      <td className="py-3 px-4 max-w-[250px] truncate">
                        <Tooltip label={ticket.description} withArrow>
                          <span>{ticket.description}</span>
                        </Tooltip>
                      </td>
                      {isAdmin ? (
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-3">
                            <Menu shadow="md" width={150}>
                              <Menu.Target>
                                <Button variant="subtle" className="p-2">
                                  <IconDotsVertical size={20} className="text-gray-600 hover:text-gray-800" />
                                </Button>
                              </Menu.Target>

                              <Menu.Dropdown>
                                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleEdit(ticket.id)}>
                                  Edit
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconLockOpen2 size={14} />}
                                  onClick={() => handleCloseTicket(ticket.id)}
                                >
                                  Open Ticket
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconTrash size={14} />}
                                  color="red"
                                  onClick={() => handleDelete(ticket.id)}
                                >
                                  Delete
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </div>
                        </td>
                      ) : (
                        ""
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-400">
                      No tickets found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default TicketTable;
