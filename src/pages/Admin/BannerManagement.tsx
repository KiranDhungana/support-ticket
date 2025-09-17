import { useEffect, useState } from 'react';
import { Button, Group, Text, Image, FileButton, Modal, Grid, Paper, ActionIcon, Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { listBannerImages, uploadImage, deleteFile, type CloudinaryImageInfo } from '../../services/uploadService';
import { IconTrash, IconRefresh, IconUpload } from '@tabler/icons-react';

const BANNERS_FOLDER = 'banners';

const BannerManagement = () => {
  const [images, setImages] = useState<CloudinaryImageInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [replaceTarget, setReplaceTarget] = useState<CloudinaryImageInfo | null>(null);

  const loadImages = async () => {
    try {
      setLoading(true);
      const res = await listBannerImages(BANNERS_FOLDER);
      if (res.success) setImages(res.data);
    } catch (e) {
      notifications.show({ color: 'red', title: 'Error', message: 'Failed to load banner images' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadImage(file, BANNERS_FOLDER);
      if (res.success) {
        notifications.show({ color: 'green', title: 'Uploaded', message: res.data.originalName });
        await loadImages();
      }
    } catch (e) {
      notifications.show({ color: 'red', title: 'Error', message: 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    try {
      await deleteFile(publicId, 'image');
      notifications.show({ color: 'green', title: 'Deleted', message: 'Banner image removed' });
      await loadImages();
    } catch (e) {
      notifications.show({ color: 'red', title: 'Error', message: 'Delete failed' });
    }
  };

  const handleReplace = async (file: File | null) => {
    if (!file || !replaceTarget) return;
    try {
      setUploading(true);
      // Upload new first
      const res = await uploadImage(file, BANNERS_FOLDER);
      if (res.success) {
        // Delete old
        await deleteFile(replaceTarget.public_id, 'image');
        notifications.show({ color: 'green', title: 'Replaced', message: replaceTarget.public_id });
        setReplaceTarget(null);
        await loadImages();
      }
    } catch (e) {
      notifications.show({ color: 'red', title: 'Error', message: 'Replace failed' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <Group justify="space-between" mb="md">
        <Text fw={700} size="xl">Banner Management</Text>
        <Group>
          <FileButton onChange={handleUpload} accept="image/*" disabled={uploading}>
            {(props) => (
              <Button leftSection={<IconUpload size={16} />} loading={uploading} {...props}>Upload Banner</Button>
            )}
          </FileButton>
          <ActionIcon variant="light" onClick={loadImages} title="Refresh">
            <IconRefresh size={18} />
          </ActionIcon>
        </Group>
      </Group>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600"><Loader size="sm" /> Loading…</div>
      ) : images.length === 0 ? (
        <Paper withBorder p="lg" className="text-center text-gray-600">No banner images yet.</Paper>
      ) : (
        <Grid gutter="md">
          {images.map((img) => (
            <Grid.Col key={img.public_id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <Paper withBorder p="sm" className="flex flex-col gap-2">
                <Image src={img.url} h={160} fit="cover" radius="sm" alt={img.public_id} />
                <Text size="xs" c="dimmed" className="truncate">{img.public_id}</Text>
                <Group justify="apart">
                  <FileButton onChange={(f) => handleReplace(f)} accept="image/*">
                    {(props) => (
                      <Button size="xs" variant="light" {...props} onClick={() => setReplaceTarget(img)}>Replace</Button>
                    )}
                  </FileButton>
                  <Button size="xs" color="red" leftSection={<IconTrash size={14} />} onClick={() => handleDelete(img.public_id)}>Delete</Button>
                </Group>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      )}

      <Modal opened={!!replaceTarget} onClose={() => setReplaceTarget(null)} title="Replace Banner" centered>
        <Text size="sm" c="dimmed" mb="sm">Select a new image to replace the selected banner.</Text>
        <FileButton onChange={handleReplace} accept="image/*">
          {(props) => (
            <Button {...props} leftSection={<IconUpload size={16} />}>Choose image</Button>
          )}
        </FileButton>
      </Modal>
    </div>
  );
};

export default BannerManagement;


