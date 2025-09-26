import { useEffect, useState } from 'react';
import { Card, Button, Group, Text, Image, FileInput, Stack } from '@mantine/core';
import { uploadImage } from '../../services/uploadService';
import { getSettings, updateSettings } from '../../services/api';

const Branding = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(localStorage.getItem('app_logo_url'));
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getSettings();
        const url = res?.data?.data?.logoUrl || null;
        setLogoUrl(url);
      } catch {}
    })();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setSaving(true);
    try {
      const res = await uploadImage(file, 'branding');
      const url = res?.data?.url;
      if (url) {
        await updateSettings({ logoUrl: url });
        localStorage.setItem('app_logo_url', url);
        setLogoUrl(url);
      }
    } finally {
      setSaving(false);
      setFile(null);
    }
  };

  return (
    <div className="p-6">
      <Card withBorder shadow="sm" radius="md" p="lg">
        <Stack>
          <Text size="lg" fw={700}>Branding</Text>
          <Text size="sm" c="dimmed">Update the site logo used across the frontend.</Text>

          {logoUrl && (
            <Group>
              <Image src={logoUrl} alt="Current Logo" w={80} h={80} radius="md" />
              <Text size="sm">Current logo</Text>
            </Group>
          )}

          <FileInput
            label="Upload new logo"
            placeholder="Select image"
            value={file}
            onChange={setFile}
            accept="image/*"
          />

          <Group>
            <Button onClick={handleUpload} disabled={!file || saving} loading={saving}>Save Logo</Button>
          </Group>
        </Stack>
      </Card>
    </div>
  );
};

export default Branding;


