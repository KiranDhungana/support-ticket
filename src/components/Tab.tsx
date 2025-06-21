import { Tabs } from "@mantine/core";
import { IconLockOpen2, IconX } from "@tabler/icons-react";

const Tab = () => {
  return (
    <Tabs defaultValue="gallery">
      <Tabs.List>
        <Tabs.Tab value="gallery" leftSection={<IconLockOpen2 size={12} />}>
          Open
        </Tabs.Tab>
        <Tabs.Tab value="messages" leftSection={<IconX size={12} />}>
          Closed
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="gallery">Gallery tab content</Tabs.Panel>

      <Tabs.Panel value="messages">Messages tab content</Tabs.Panel>

      <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
    </Tabs>
  );
};

export default Tab;
