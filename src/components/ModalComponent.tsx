import { Modal } from "@mantine/core";
import React from "react";

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

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  ticketData: TicketData | null;
}

const ModalComponent: React.FC<ModalProps> = ({ opened, onClose }) => {
  return (
    <Modal centered size="lg" zIndex={1000} opened={opened} onClose={onClose} title="Edit Ticket">
      test
    </Modal>
  );
};

export default ModalComponent;
