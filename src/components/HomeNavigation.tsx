import { useState } from 'react';
import { Group, Text, Menu, Button, UnstyledButton } from '@mantine/core';
import { IconChevronDown, IconMenu2, IconSchool } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'SUPERINTENDENT', dropdown: true },
  { label: 'PARENTS & STUDENTS', dropdown: true },
  { label: 'POLICIES', dropdown: true },
  { label: 'PUBLIC NOTICES' },
  { label: 'CAREER' },
  { label: 'SCHOOLS' },
];

const quickLinks = [
  { label: 'Help desk login', href: 'http://localhost:5173/login' },
  { label: 'Canvas', href: 'http://westcarroll.instructure.com/' },
];

const HomeNavigation = () => {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleExpanded = (itemLabel: string) => {
    setExpandedItems(prev => 
      prev.includes(itemLabel) 
        ? prev.filter(item => item !== itemLabel)
        : [...prev, itemLabel]
    );
  };

  return (
    <>
      
      <div className="bg-wcpsb-blue text-white h-17 px-4 py-2 flex flex-col sm:flex-row items-center justify-between">
        <div 
          className="flex items-center gap-2 py-2 cursor-pointer hover:opacity-90 transition-opacity duration-200"
          onClick={() => navigate('/')}
        >
          <img 
            src="/logo.png" 
            alt="West Carroll Parish School Board Logo" 
            width={36} 
            height={36}  
          />
          <div>
            <Text fw={700} size="md">West Carroll Parish School Board</Text>
            <Text size="xs">A Quality Education for a Quality Life</Text>
          </div>
        </div>
        <Group gap="md" visibleFrom="sm">
          {quickLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:underline text-sm font-medium flex items-center gap-2"
            >
              {link.label === 'Canvas' && <img 
                src="/logo.png" 
                alt="Canvas" 
                width={20} 
                height={20} 
              />}
              {link.label}
            </a>
          ))}
        </Group>
      </div>

      {/* Main Navbar */}
      <div className="bg-white shadow w-full px-2 md:px-4 py-2 relative">
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center justify-between">
          <Group gap="md" className="flex-wrap">
            {navLinks.map((item) =>
              item.dropdown ? (
                <Menu key={item.label} withinPortal openDelay={100} closeDelay={300}>
                  <Menu.Target>
                    <UnstyledButton className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded">
                      <span className="font-medium text-gray-800">{item.label}</span>
                      <IconChevronDown size={16} />
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {item.label === 'SUPERINTENDENT' ? (
                      <>
                        <Menu.Item onClick={() => navigate('/wc-school-board')}>WC School Board</Menu.Item>
                        <Menu.Item onClick={() => navigate('/wc-school-board-minutes')}>WC School Board Minutes</Menu.Item>
                        <Menu.Item onClick={() => navigate('/vision-statement')}>Vision Statement</Menu.Item>
                      </>
                    ) : item.label === 'PARENTS & STUDENTS' ? (
                      <>
                        <Menu.Item onClick={() => navigate('/parents/registration')}>Parent Registration</Menu.Item>
                        <Menu.Item onClick={() => navigate('/parents/calendar')}>Parent Calendar</Menu.Item>
                        <Menu.Item onClick={() => navigate('/parents/resources')}>Parent Resources</Menu.Item>
                        <Menu.Item onClick={() => navigate('/parents/volunteer')}>Volunteer Opportunities</Menu.Item>
                        <Menu.Item onClick={() => navigate('/parents/communication')}>Communication</Menu.Item>
                        <Menu.Item onClick={() => navigate('/parents/policies')}>Policies & Procedures</Menu.Item>
                        <Menu.Item onClick={() => navigate('/lunch-and-breakfast')}>Lunch and Breakfast</Menu.Item>
                        <Menu.Item onClick={() => navigate('/child-find')}>Child Find</Menu.Item>
                        <Menu.Item onClick={() => window.open('https://www.tutor.com/homeworklouisiana/learn-more', '_blank')}>Homework</Menu.Item>
                        <Menu.Item onClick={() => navigate('/students/registration')}>Student Registration</Menu.Item>
                        <Menu.Item onClick={() => navigate('/students/calendar')}>Student Calendar</Menu.Item>
                        <Menu.Item onClick={() => navigate('/students/resources')}>Student Resources</Menu.Item>
                        <Menu.Item onClick={() => navigate('/students/volunteer')}>Student Volunteer Opportunities</Menu.Item>
                        <Menu.Item onClick={() => navigate('/students/communication')}>Student Communication</Menu.Item>
                        <Menu.Item onClick={() => navigate('/students/policies')}>Student Policies & Procedures</Menu.Item>
                      </>
                    ) : item.label === 'CHILD FIND' ? (
                      <>
                        <Menu.Item onClick={() => navigate('/child-find')}>Child Find</Menu.Item>
                      </>
                    ) : item.label === 'POLICIES' ? (
                      <>
                        <Menu.Item onClick={() => window.open('/policies/Dress Code 2021.pdf', '_blank')}>Student Dress Code</Menu.Item>
                        <Menu.Item onClick={() => navigate('/charter-application')}>Charter Application</Menu.Item>
                        <Menu.Item onClick={() => navigate('/student-privacy')}>Student Privacy</Menu.Item>
                        <Menu.Item onClick={() => navigate('/vendor-agreement')}>Vendor Agreement</Menu.Item>
                        <Menu.Item>WC Parish Policy Manual</Menu.Item>
                        <Menu.Item onClick={() => window.open('https://www.lla.la.gov/report-fraud', '_blank')}>Fight Fraud, Waste, & Abuse</Menu.Item>
                      </>
                    ) : (
                      <>
                        <Menu.Item>Option 1</Menu.Item>
                        <Menu.Item>Option 2</Menu.Item>
                      </>
                    )}
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <UnstyledButton 
                  key={item.label} 
                  className="px-2 py-1 font-medium text-gray-800 hover:bg-gray-100 rounded"
                  onClick={() => {
                    if (item.label === 'PUBLIC NOTICES') {
                      navigate('/public-notices');
                    } else if (item.label === 'CAREER') {
                      navigate('/jobs');
                    } else if (item.label === 'SCHOOLS') {
                      navigate('/schools');
                    }
                  }}
                >
                  {item.label}
                </UnstyledButton>
              )
            )}
          </Group>
          <Group gap="xs">
            <Menu withinPortal openDelay={100} closeDelay={300}>
              <Menu.Target>
                <Button variant="subtle" leftSection={<IconMenu2 size={18} />} rightSection={<IconChevronDown size={16} />}>
                  MENU
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => navigate('/announcements')}>Announcements</Menu.Item>
                <Menu.Item onClick={() => navigate('/staff')}>Staff</Menu.Item>
                <Menu.Item onClick={() => navigate('/news')}>News</Menu.Item>
                <Menu.Item onClick={() => navigate('/jobs')}>Jobs</Menu.Item>
                <Menu.Item>Menu 1</Menu.Item>
                <Menu.Item>Menu 2</Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Menu withinPortal openDelay={100} closeDelay={300}>
              <Menu.Target>
                <Button variant="subtle" leftSection={<IconSchool size={18} />} rightSection={<IconChevronDown size={16} />}>
                  SCHOOLS
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => navigate('/schools')}>All Schools</Menu.Item>
                <Menu.Divider />
                <Menu.Label>Elementary Schools</Menu.Label>
                <Menu.Item onClick={() => navigate('/schools')}>Oak Grove Elementary School</Menu.Item>
                <Menu.Divider />
                <Menu.Label>High Schools</Menu.Label>
                <Menu.Item onClick={() => navigate('/schools')}>Oak Grove High School</Menu.Item>
                <Menu.Item onClick={() => navigate('/schools')}>Forest High School</Menu.Item>
              </Menu.Dropdown>
            </Menu>

          </Group>
        </div>
        
        {/* Mobile Nav */}
        <div className="md:hidden flex items-center justify-between">
          <div className="flex-1"></div>
          <button
            onClick={() => setMobileNavOpen((o) => !o)}
            className="p-2 rounded-md inline-flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
          >
            {mobileNavOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Mobile Menu Overlay */}
        {mobileNavOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setMobileNavOpen(false)}
            ></div>
            
            {/* Menu Panel */}
            <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Menu Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex flex-col gap-1">
                    {/* Main Navigation Links */}
                    {navLinks.map((item) => (
                      <div key={item.label}>
                        <button 
                          onClick={() => {
                            if (item.label === 'PUBLIC NOTICES') {
                              navigate('/public-notices');
                            } else if (item.label === 'CAREER') {
                              navigate('/jobs');
                            } else if (item.dropdown) {
                              toggleExpanded(item.label);
                            }
                          }}
                          className="flex items-center justify-between px-3 py-4 hover:bg-gray-100 rounded w-full text-left border-b border-gray-200"
                        >
                          <span className="font-medium text-gray-800">{item.label}</span>
                          {item.dropdown && (
                            <IconChevronDown 
                              size={16} 
                              className={`text-gray-500 transition-transform duration-200 ${
                                expandedItems.includes(item.label) ? 'rotate-180' : ''
                              }`} 
                            />
                          )}
                        </button>
                        
                        {/* Dropdown Content */}
                        {item.dropdown && expandedItems.includes(item.label) && (
                          <div className="bg-gray-50 border-b border-gray-200">
                            <div className="px-6 py-2 space-y-2">
                              {item.label === 'SUPERINTENDENT' ? (
                                <>
                                  <button 
                                    onClick={() => navigate('/wc-school-board')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    WC School Board
                                  </button>
                                  <button 
                                    onClick={() => navigate('/wc-school-board-minutes')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    WC School Board Minutes
                                  </button>
                                  <button 
                                    onClick={() => navigate('/vision-statement')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Vision Statement
                                  </button>
                                </>
                              ) : item.label === 'PARENTS & STUDENTS' ? (
                                <>
                                  <button 
                                    onClick={() => navigate('/parents/registration')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Parent Registration
                                  </button>
                                  <button 
                                    onClick={() => navigate('/parents/calendar')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Parent Calendar
                                  </button>
                                  <button 
                                    onClick={() => navigate('/parents/resources')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Parent Resources
                                  </button>
                                  <button 
                                    onClick={() => navigate('/parents/volunteer')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Volunteer Opportunities
                                  </button>
                                  <button 
                                    onClick={() => navigate('/parents/communication')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Communication
                                  </button>
                                  <button 
                                    onClick={() => navigate('/parents/policies')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Policies & Procedures
                                  </button>
                                  <button 
                                    onClick={() => navigate('/lunch-and-breakfast')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Lunch and Breakfast
                                  </button>
                                  <button 
                                    onClick={() => navigate('/child-find')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Child Find
                                  </button>
                                  <button 
                                    onClick={() => window.open('https://www.tutor.com/homeworklouisiana/learn-more', '_blank')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Homework
                                  </button>
                                  <button 
                                    onClick={() => navigate('/students/registration')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Student Registration
                                  </button>
                                  <button 
                                    onClick={() => navigate('/students/calendar')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Student Calendar
                                  </button>
                                  <button 
                                    onClick={() => navigate('/students/resources')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Student Resources
                                  </button>
                                  <button 
                                    onClick={() => navigate('/students/volunteer')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Student Volunteer Opportunities
                                  </button>
                                  <button 
                                    onClick={() => navigate('/students/communication')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Student Communication
                                  </button>
                                  <button 
                                    onClick={() => navigate('/students/policies')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Student Policies & Procedures
                                  </button>
                                </>
                              ) : item.label === 'POLICIES' ? (
                                <>
                                  <button 
                                    onClick={() => window.open('/policies/Dress Code 2021.pdf', '_blank')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Student Dress Code
                                  </button>
                                  <button 
                                    onClick={() => navigate('/charter-application')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Charter Application
                                  </button>
                                  <button 
                                    onClick={() => navigate('/student-privacy')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Student Privacy
                                  </button>
                                  <button 
                                    onClick={() => navigate('/vendor-agreement')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Vendor Agreement
                                  </button>
                                  <button 
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    WC Parish Policy Manual
                                  </button>
                                  <button 
                                    onClick={() => window.open('https://www.lla.la.gov/report-fraud', '_blank')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Fight Fraud, Waste, & Abuse
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">
                                    {item.label === 'CAREER' && 'Career Opportunities'}
                                    {!['CAREER'].includes(item.label) && 'Option 1'}
                                  </button>
                                  <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">
                                    {item.label === 'CAREER' && 'Job Listings'}
                                    {!['CAREER'].includes(item.label) && 'Option 2'}
                                  </button>
                                  <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">
                                    {item.label === 'CAREER' && 'Application Process'}
                                    {!['CAREER'].includes(item.label) && 'Option 3'}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Additional Menu Items */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div>
                        <button 
                          onClick={() => toggleExpanded('MENU')}
                          className="flex items-center gap-3 px-3 py-4 hover:bg-gray-100 rounded w-full text-left"
                        >
                          <IconMenu2 size={18} className="text-gray-600" />
                          <span className="font-medium text-gray-800">MENU</span>
                          <IconChevronDown 
                            size={16} 
                            className={`text-gray-500 ml-auto transition-transform duration-200 ${
                              expandedItems.includes('MENU') ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                        {expandedItems.includes('MENU') && (
                          <div className="bg-gray-50 border-b border-gray-200">
                            <div className="px-6 py-2 space-y-2">
                              <button 
                                onClick={() => navigate('/announcements')}
                                className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                              >
                                Announcements
                              </button>
                              <button 
                                onClick={() => navigate('/staff')}
                                className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                              >
                                Staff
                              </button>
                              <button 
                                onClick={() => navigate('/news')}
                                className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                              >
                                News
                              </button>
                              <button 
                                onClick={() => navigate('/jobs')}
                                className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                              >
                                Jobs
                              </button>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Menu Option 1</button>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Menu Option 2</button>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Menu Option 3</button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <button 
                          onClick={() => toggleExpanded('SCHOOLS')}
                          className="flex items-center gap-3 px-3 py-4 hover:bg-gray-100 rounded w-full text-left"
                        >
                          <IconSchool size={18} className="text-gray-600" />
                          <span className="font-medium text-gray-800">SCHOOLS</span>
                          <IconChevronDown 
                            size={16} 
                            className={`text-gray-500 ml-auto transition-transform duration-200 ${
                              expandedItems.includes('SCHOOLS') ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                        {expandedItems.includes('SCHOOLS') && (
                          <div className="bg-gray-50 border-b border-gray-200">
                            <div className="px-6 py-2 space-y-2">
                              <div className="text-xs font-semibold text-gray-500 px-3 py-1">Elementary Schools</div>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Oak Grove Elementary School</button>
                              
                              <div className="text-xs font-semibold text-gray-500 px-3 py-1 mt-3">High Schools</div>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Oak Grove High School</button>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Forest High School</button>
                            </div>
                          </div>
                        )}
                      </div>
                      

                    </div>
                    
                    {/* Quick Links Section */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-600 mb-3 px-3">QUICK LINKS</h3>
                      {quickLinks.map((link) => (
                        <button 
                          key={link.label}
                          className="flex items-center px-3 py-3 hover:bg-gray-100 rounded w-full text-left"
                        >
                          <span className="text-gray-700">{link.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomeNavigation; 