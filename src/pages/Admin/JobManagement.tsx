import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Card,
  Text,
  Button,
  Group,
  TextInput,
  Select,
  Textarea,
  Checkbox,
  Stack,
  Title,
  Container,
  Badge,
  ActionIcon,
  Table,
  Pagination,
  Switch
} from '@mantine/core';
import { IconPlus, IconEdit, IconTrash, IconEye, IconSearch, IconFilter } from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext';
import Toster from '../../components/Toster';
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  toggleJobStatus,
  getJobCategories,
  getJobTypes,
  type Job,
  type CreateJobData
} from '../../services/jobService';

interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  salary: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  isRemote: boolean;
  isUrgent: boolean;
}

const JobManagement: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    type: '',
    category: '',
    salary: '',
    experience: '',
    description: '',
    requirements: [],
    benefits: [],
    isRemote: false,
    isUrgent: false
  });

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

  useEffect(() => {
    fetchJobs();
    fetchCategories();
    fetchTypes();
  }, [currentPage, searchTerm, selectedCategory, selectedType]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getJobs(
        currentPage,
        10,
        searchTerm || undefined,
        selectedCategory || undefined,
        selectedType || undefined
      );
      setJobs(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      showToast('Failed to fetch jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await getJobCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTypes = async () => {
    try {
      const typesData = await getJobTypes();
      setTypes(typesData);
    } catch (error) {
      console.error('Error fetching types:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayInputChange = (field: 'requirements' | 'benefits', value: string) => {
    const items = value.split('\n').filter(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await updateJob(editingJob.id, formData);
        showToast('Job updated successfully', 'success');
      } else {
        await createJob(formData);
        showToast('Job created successfully', 'success');
      }
      setShowModal(false);
      resetForm();
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      showToast('Failed to save job', 'error');
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      category: job.category,
      salary: job.salary,
      experience: job.experience,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      isRemote: job.isRemote,
      isUrgent: job.isUrgent
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(id);
        showToast('Job deleted successfully', 'success');
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
        showToast('Failed to delete job', 'error');
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleJobStatus(id);
      showToast('Job status updated successfully', 'success');
      fetchJobs();
    } catch (error) {
      console.error('Error toggling job status:', error);
      showToast('Failed to update job status', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      type: '',
      category: '',
      salary: '',
      experience: '',
      description: '',
      requirements: [],
      benefits: [],
      isRemote: false,
      isUrgent: false
    });
    setEditingJob(null);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title order={1} className="text-2xl font-bold mb-2">Job Management</Title>
        <Text className="text-gray-600">Manage job postings and applications</Text>
      </div>

      {/* Search and Filter Section */}
      <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <TextInput
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftSection={<IconSearch size={16} />}
            className="flex-1"
          />
          <Select
            placeholder="Select Category"
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value || '')}
            data={categories}
            leftSection={<IconFilter size={16} />}
            className="w-full md:w-48"
            clearable
          />
          <Select
            placeholder="Select Type"
            value={selectedType}
            onChange={(value) => setSelectedType(value || '')}
            data={types}
            leftSection={<IconFilter size={16} />}
            className="w-full md:w-48"
            clearable
          />
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="w-full md:w-auto"
          >
            Add Job
          </Button>
        </div>
      </Card>

      {/* Jobs Table */}
      <Card shadow="sm" radius="md" withBorder>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No jobs found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Company</Table.Th>
                  <Table.Th>Location</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Posted</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {jobs.map((job) => (
                  <Table.Tr key={job.id}>
                    <Table.Td>
                      <div>
                        <Text fw={500}>{job.title}</Text>
                        <Text size="xs" c="dimmed">{job.category}</Text>
                      </div>
                    </Table.Td>
                    <Table.Td>{job.company}</Table.Td>
                    <Table.Td>
                      <div className="flex items-center gap-1">
                        {job.location}
                        {job.isRemote && <Badge size="xs" color="blue">Remote</Badge>}
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Badge size="sm" color="gray">{job.type}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={job.isActive}
                          onChange={() => handleToggleStatus(job.id)}
                          size="sm"
                        />
                        <Badge size="xs" color={job.isActive ? 'green' : 'red'}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {job.isUrgent && <Badge size="xs" color="red">Urgent</Badge>}
                      </div>
                    </Table.Td>
                    <Table.Td>{formatDate(job.postedDate)}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleEdit(job)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => handleDelete(job.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              total={totalPages}
              value={currentPage}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {/* Job Form Modal */}
      {showModal && createPortal(
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
                {editingJob ? 'Edit Job' : 'Add New Job'}
              </h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Job Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select Job Type</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Salary *
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                  Experience Required *
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                  Job Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                  Requirements (one per line)
                </label>
                <textarea
                  value={formData.requirements.join('\n')}
                  onChange={(e) => handleArrayInputChange('requirements', e.target.value)}
                  rows={3}
                  placeholder="Enter each requirement on a new line"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                  Benefits (one per line)
                </label>
                <textarea
                  value={formData.benefits.join('\n')}
                  onChange={(e) => handleArrayInputChange('benefits', e.target.value)}
                  rows={3}
                  placeholder="Enter each benefit on a new line"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    name="isRemote"
                    checked={formData.isRemote}
                    onChange={handleInputChange}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '14px' }}>Remote Position</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    name="isUrgent"
                    checked={formData.isUrgent}
                    onChange={handleInputChange}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '14px' }}>Urgent Position</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#374151',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: editingJob ? '#059669' : '#2563eb',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {editingJob ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {toast && (
        <Toster
          title={toast.type === 'success' ? 'Success' : 'Error'}
          message={toast.message}
        />
      )}
    </div>
  );
};

export default JobManagement; 