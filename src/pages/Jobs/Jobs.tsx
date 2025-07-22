import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaClock, FaBuilding, FaEye } from 'react-icons/fa';
import HomeNavigation from '../../components/HomeNavigation';
import Pagination from '../../components/Pagination';
import { getJobs, type Job as JobType } from '../../services/jobService';
import './Jobs.css';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  category: string;
  salary: string;
  experience: string;
  postedDate: string;
  description: string;
  requirements: string[];
  benefits: string[];
  isRemote: boolean;
  isUrgent: boolean;
}



const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState('All Types');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedJob, setSelectedJob] = useState<JobType | null>(null);
  const [showModal, setShowModal] = useState(false);

  const categories = ['All Categories', 'Technology', 'Marketing', 'Data Science', 'Design', 'Sales', 'Product Management', 'Customer Service', 'Finance', 'Content'];
  const jobTypes = ['All Types', 'Full-time', 'Part-time', 'Contract', 'Internship'];

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchTerm, selectedCategory, selectedType]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getJobs(
        currentPage,
        6,
        searchTerm || undefined,
        selectedCategory === 'All Categories' ? undefined : selectedCategory,
        selectedType === 'All Types' ? undefined : selectedType
      );
      setJobs(response.data);
      setTotalPages(response.pagination.pages);
      setTotalItems(response.pagination.total);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (job: JobType) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time': return '#28a745';
      case 'Part-time': return '#ffc107';
      case 'Contract': return '#17a2b8';
      case 'Internship': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c', '#6c757d', '#17a2b8'];
    const index = categories.indexOf(category);
    return colors[index % colors.length];
  };

  return (
    <div className="jobs-page">
      <HomeNavigation />
      
      <div className="jobs-container">
        <div className="jobs-header">
          <h1>Job Opportunities</h1>
          <p>Find your next career opportunity with leading companies</p>
        </div>

        {/* Search and Filters */}
        <div className="jobs-filters">
          <div className="search-section">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-group">
              <label>Category:</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Job Type:</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>


          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p>Showing {jobs.length} of {totalItems} jobs</p>
        </div>

        {/* Jobs Grid */}
        <div className="jobs-grid">
          {loading ? (
            <div className="loading">Loading jobs...</div>
          ) : jobs.map(job => (
            <div key={job.id} className="job-card" onClick={() => handleJobClick(job)}>
              <div className="job-header">
                <div className="job-title-section">
                  <h3>{job.title}</h3>
                  <p className="company-name">{job.company}</p>
                </div>
                <div className="job-badges">
                  {job.isUrgent && <span className="urgent-badge">Urgent</span>}
                  {job.isRemote && <span className="remote-badge">Remote</span>}
                </div>
              </div>

              <div className="job-details">
                <div className="job-info">
                  <span className="info-item">
                    <FaMapMarkerAlt /> {job.location}
                  </span>
                  <span className="info-item">
                    <FaBriefcase /> {job.type}
                  </span>
                  <span className="info-item">
                    <FaClock /> {job.experience}
                  </span>
                </div>

                <div className="job-categories">
                  <span 
                    className="category-badge"
                    style={{ backgroundColor: getCategoryColor(job.category) }}
                  >
                    {job.category}
                  </span>
                  <span 
                    className="type-badge"
                    style={{ backgroundColor: getTypeColor(job.type) }}
                  >
                    {job.type}
                  </span>
                </div>

                <div className="job-salary">
                  <strong>{job.salary}</strong>
                </div>

                <p className="job-description">
                  {job.description.length > 150 
                    ? `${job.description.substring(0, 150)}...` 
                    : job.description
                  }
                </p>

                <div className="job-footer">
                  <span className="posted-date">Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                  <button className="view-details-btn">
                    <FaEye /> View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={6}
          />
        )}

        {/* No Results */}
        {!loading && jobs.length === 0 && (
          <div className="no-results">
            <h3>No jobs found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {showModal && selectedJob && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="job-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedJob.title}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>

            <div className="modal-content">
              <div className="job-overview">
                <div className="company-info">
                  <h3>{selectedJob.company}</h3>
                  <div className="job-meta">
                    <span><FaMapMarkerAlt /> {selectedJob.location}</span>
                    <span><FaBriefcase /> {selectedJob.type}</span>
                    <span><FaClock /> {selectedJob.experience}</span>
                    <span><FaBuilding /> {selectedJob.category}</span>
                  </div>
                </div>

                <div className="salary-info">
                  <h4>Salary Range</h4>
                  <p className="salary">{selectedJob.salary}</p>
                </div>

                <div className="job-badges-modal">
                  {selectedJob.isUrgent && <span className="urgent-badge">Urgent</span>}
                  {selectedJob.isRemote && <span className="remote-badge">Remote</span>}
                  <span 
                    className="category-badge"
                    style={{ backgroundColor: getCategoryColor(selectedJob.category) }}
                  >
                    {selectedJob.category}
                  </span>
                </div>
              </div>

              <div className="job-description-full">
                <h4>Job Description</h4>
                <p>{selectedJob.description}</p>
              </div>

              <div className="job-requirements">
                <h4>Requirements</h4>
                <ul>
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="job-benefits">
                <h4>Benefits</h4>
                <ul>
                  {selectedJob.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="job-actions">
                <button className="apply-btn">Apply Now</button>
                <button className="save-btn">Save Job</button>
                <button className="share-btn">Share</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs; 