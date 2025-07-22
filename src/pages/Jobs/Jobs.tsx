import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaBriefcase, FaClock, FaBuilding, FaEye, FaDownload } from 'react-icons/fa';
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

const sampleJobs: Job[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Solutions",
    location: "New York, NY",
    type: "Full-time",
    category: "Technology",
    salary: "$120,000 - $150,000",
    experience: "5+ years",
    postedDate: "2024-01-15",
    description: "We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining high-quality software solutions.",
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      "5+ years of experience in software development",
      "Proficiency in JavaScript, Python, or Java",
      "Experience with cloud platforms (AWS, Azure, or GCP)",
      "Strong problem-solving and communication skills"
    ],
    benefits: [
      "Competitive salary and benefits",
      "Flexible work arrangements",
      "Professional development opportunities",
      "Health insurance and retirement plans",
      "Modern office environment"
    ],
    isRemote: true,
    isUrgent: true
  },
  {
    id: 2,
    title: "Marketing Manager",
    company: "Global Marketing Inc",
    location: "Los Angeles, CA",
    type: "Full-time",
    category: "Marketing",
    salary: "$80,000 - $100,000",
    experience: "3+ years",
    postedDate: "2024-01-14",
    description: "Join our dynamic marketing team as a Marketing Manager. You will develop and execute marketing strategies to drive brand awareness and customer engagement.",
    requirements: [
      "Bachelor's degree in Marketing or related field",
      "3+ years of marketing experience",
      "Experience with digital marketing tools",
      "Strong analytical and creative skills",
      "Excellent communication abilities"
    ],
    benefits: [
      "Competitive salary package",
      "Performance bonuses",
      "Health and wellness benefits",
      "Professional development budget",
      "Collaborative team environment"
    ],
    isRemote: false,
    isUrgent: false
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "Data Insights Co",
    location: "Remote",
    type: "Contract",
    category: "Data Science",
    salary: "$70,000 - $90,000",
    experience: "2+ years",
    postedDate: "2024-01-13",
    description: "We are seeking a Data Analyst to help us turn data into actionable insights. You will work with large datasets and create meaningful reports.",
    requirements: [
      "Bachelor's degree in Statistics, Mathematics, or related field",
      "2+ years of data analysis experience",
      "Proficiency in SQL, Python, or R",
      "Experience with data visualization tools",
      "Strong analytical thinking"
    ],
    benefits: [
      "Remote work flexibility",
      "Competitive hourly rate",
      "Professional development opportunities",
      "Flexible schedule",
      "Collaborative team environment"
    ],
    isRemote: true,
    isUrgent: false
  },
  {
    id: 4,
    title: "UX/UI Designer",
    company: "Creative Design Studio",
    location: "San Francisco, CA",
    type: "Full-time",
    category: "Design",
    salary: "$90,000 - $120,000",
    experience: "4+ years",
    postedDate: "2024-01-12",
    description: "Join our creative team as a UX/UI Designer. You will create beautiful and functional user experiences for web and mobile applications.",
    requirements: [
      "Bachelor's degree in Design or related field",
      "4+ years of UX/UI design experience",
      "Proficiency in Figma, Sketch, or Adobe Creative Suite",
      "Portfolio showcasing web and mobile designs",
      "Understanding of user-centered design principles"
    ],
    benefits: [
      "Competitive salary and benefits",
      "Creative and inspiring work environment",
      "Professional development opportunities",
      "Health insurance and wellness programs",
      "Flexible work arrangements"
    ],
    isRemote: false,
    isUrgent: true
  },
  {
    id: 5,
    title: "Sales Representative",
    company: "SalesForce Solutions",
    location: "Chicago, IL",
    type: "Part-time",
    category: "Sales",
    salary: "$50,000 - $70,000 + Commission",
    experience: "1+ years",
    postedDate: "2024-01-11",
    description: "We are looking for motivated Sales Representatives to join our team. You will be responsible for generating leads and closing sales.",
    requirements: [
      "High school diploma or equivalent",
      "1+ years of sales experience",
      "Excellent communication and interpersonal skills",
      "Self-motivated and goal-oriented",
      "Valid driver's license"
    ],
    benefits: [
      "Competitive base salary plus commission",
      "Performance bonuses",
      "Health insurance benefits",
      "Professional development training",
      "Flexible schedule"
    ],
    isRemote: false,
    isUrgent: false
  },
  {
    id: 6,
    title: "Product Manager",
    company: "Innovation Labs",
    location: "Seattle, WA",
    type: "Full-time",
    category: "Product Management",
    salary: "$110,000 - $140,000",
    experience: "5+ years",
    postedDate: "2024-01-10",
    description: "Join our product team as a Product Manager. You will be responsible for defining product strategy and leading cross-functional teams.",
    requirements: [
      "Bachelor's degree in Business, Engineering, or related field",
      "5+ years of product management experience",
      "Experience with agile methodologies",
      "Strong analytical and strategic thinking",
      "Excellent leadership and communication skills"
    ],
    benefits: [
      "Competitive salary and equity",
      "Comprehensive health benefits",
      "Professional development opportunities",
      "Modern office with amenities",
      "Flexible work arrangements"
    ],
    isRemote: true,
    isUrgent: false
  },
  {
    id: 7,
    title: "Customer Success Manager",
    company: "CustomerFirst Inc",
    location: "Austin, TX",
    type: "Full-time",
    category: "Customer Service",
    salary: "$65,000 - $85,000",
    experience: "3+ years",
    postedDate: "2024-01-09",
    description: "We are seeking a Customer Success Manager to ensure our customers achieve their goals and have a positive experience with our products.",
    requirements: [
      "Bachelor's degree in Business or related field",
      "3+ years of customer success or account management experience",
      "Strong relationship-building skills",
      "Experience with CRM systems",
      "Excellent problem-solving abilities"
    ],
    benefits: [
      "Competitive salary and benefits",
      "Performance bonuses",
      "Health insurance and wellness programs",
      "Professional development opportunities",
      "Collaborative team environment"
    ],
    isRemote: false,
    isUrgent: true
  },
  {
    id: 8,
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Remote",
    type: "Contract",
    category: "Technology",
    salary: "$100,000 - $130,000",
    experience: "4+ years",
    postedDate: "2024-01-08",
    description: "Join our DevOps team to help us build and maintain scalable infrastructure. You will work with cutting-edge cloud technologies.",
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      "4+ years of DevOps experience",
      "Experience with AWS, Docker, and Kubernetes",
      "Proficiency in scripting languages (Python, Bash)",
      "Strong understanding of CI/CD pipelines"
    ],
    benefits: [
      "Competitive hourly rate",
      "Remote work flexibility",
      "Professional development opportunities",
      "Flexible schedule",
      "Collaborative team environment"
    ],
    isRemote: true,
    isUrgent: false
  },
  {
    id: 9,
    title: "Financial Analyst",
    company: "Finance Partners",
    location: "Boston, MA",
    type: "Full-time",
    category: "Finance",
    salary: "$75,000 - $95,000",
    experience: "3+ years",
    postedDate: "2024-01-07",
    description: "We are looking for a Financial Analyst to provide financial insights and support strategic decision-making across the organization.",
    requirements: [
      "Bachelor's degree in Finance, Accounting, or related field",
      "3+ years of financial analysis experience",
      "Proficiency in Excel and financial modeling",
      "Strong analytical and problem-solving skills",
      "Excellent attention to detail"
    ],
    benefits: [
      "Competitive salary and benefits",
      "Performance bonuses",
      "Health insurance and retirement plans",
      "Professional development opportunities",
      "Modern office environment"
    ],
    isRemote: false,
    isUrgent: false
  },
  {
    id: 10,
    title: "Content Writer",
    company: "Content Creators Co",
    location: "Remote",
    type: "Part-time",
    category: "Content",
    salary: "$40,000 - $60,000",
    experience: "2+ years",
    postedDate: "2024-01-06",
    description: "Join our content team as a Content Writer. You will create engaging and informative content for various platforms and audiences.",
    requirements: [
      "Bachelor's degree in English, Journalism, or related field",
      "2+ years of content writing experience",
      "Excellent writing and editing skills",
      "Experience with SEO best practices",
      "Ability to meet deadlines"
    ],
    benefits: [
      "Competitive hourly rate",
      "Remote work flexibility",
      "Professional development opportunities",
      "Flexible schedule",
      "Creative and collaborative environment"
    ],
    isRemote: true,
    isUrgent: false
  }
];

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