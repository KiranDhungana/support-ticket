// components/AutoNotification.tsx
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";

interface TosterProps {
  title?: string;
  message: string;
}

const Toster: React.FC<TosterProps> = ({ title = "Notification", message }) => {
  useEffect(() => {
    notifications.show({
      title,
      message,
    });
  }, [title, message]);

  return null;
};

export default Toster;
