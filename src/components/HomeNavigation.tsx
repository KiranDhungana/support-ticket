import { useState } from 'react';
import { Group, Text, Menu, Button, UnstyledButton } from '@mantine/core';
import { IconChevronDown, IconMenu2, IconWorld, IconSchool } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'STUDENTS', dropdown: true },
  { label: 'PARENTS', dropdown: true },
  { label: 'EMPLOYEES' },
  { label: 'LEADERSHIP', dropdown: true },
  { label: 'PUBLIC NOTICES' },
  { label: 'CALENDARS', dropdown: true },
  { label: 'MORE', dropdown: true },
];

const quickLinks = [
  { label: 'PreK-12th Grade Registration', href: '#' },
  { label: 'Moodle', href: '#' },
  { label: 'SchoolCash Online', href: '#' },
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
      {/* Top Blue Bar */}
      <div className="bg-blue-900 text-white h-17 px-4 py-2 flex flex-col sm:flex-row items-center justify-between">
        <div 
          className="flex items-center gap-2 py-2 cursor-pointer hover:opacity-90 transition-opacity duration-200"
          onClick={() => navigate('/')}
        >
          <img src="/public/Logo.png" alt="Logo" width={36} height={36}  />
          <div>
            <Text fw={700} size="md">West Carroll Parish School Board</Text>
            <Text size="xs">A Quality Education for a Quality Life</Text>
          </div>
        </div>
        <Group gap="md" visibleFrom="sm">
          {quickLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-white hover:underline text-sm font-medium">{link.label}</a>
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
                    {item.label === 'LEADERSHIP' ? (
                      <>
                        <Menu.Item onClick={() => navigate('/board-members')}>Board Members</Menu.Item>
                        <Menu.Item onClick={() => navigate('/board-minutes')}>Board Minutes & Agenda</Menu.Item>
                        <Menu.Item onClick={() => navigate('/principals')}>Principals</Menu.Item>
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
                <Menu.Label>Elementary Schools</Menu.Label>
                <Menu.Item>Hillcrest Elementary</Menu.Item>
                <Menu.Item>Oak Grove Elementary</Menu.Item>
                <Menu.Item>Lincoln Elementary</Menu.Item>
                <Menu.Item>Ruston Elementary</Menu.Item>
                <Menu.Item>Simsboro Elementary</Menu.Item>
                <Menu.Divider />
                <Menu.Label>Middle Schools</Menu.Label>
                <Menu.Item>Ruston Junior High</Menu.Item>
                <Menu.Item>Lincoln Junior High</Menu.Item>
                <Menu.Divider />
                <Menu.Label>High Schools</Menu.Label>
                <Menu.Item>Ruston High School</Menu.Item>
                <Menu.Item>Lincoln High School</Menu.Item>
                <Menu.Item>Simsboro High School</Menu.Item>
                <Menu.Divider />
                <Menu.Label>Special Programs</Menu.Label>
                <Menu.Item>Early Childhood Center</Menu.Item>
                <Menu.Item>Alternative Learning Center</Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Menu withinPortal openDelay={100} closeDelay={300}>
              <Menu.Target>
                <Button variant="subtle" leftSection={<IconWorld size={18} />} rightSection={<IconChevronDown size={16} />}>
                  TRANSLATE
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>English</Menu.Item>
                <Menu.Item>Spanish</Menu.Item>
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
                              {item.label === 'LEADERSHIP' ? (
                                <>
                                  <button 
                                    onClick={() => navigate('/board-members')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Board Members
                                  </button>
                                  <button 
                                    onClick={() => navigate('/board-minutes')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Board Minutes & Agenda
                                  </button>
                                  <button 
                                    onClick={() => navigate('/principals')}
                                    className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm"
                                  >
                                    Principals
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">
                                    {item.label === 'STUDENTS' && 'Student Portal'}
                                    {item.label === 'PARENTS' && 'Parent Resources'}
                                    {item.label === 'CALENDARS' && 'Academic Calendar'}
                                    {item.label === 'MORE' && 'Additional Resources'}
                                    {!['STUDENTS', 'PARENTS', 'CALENDARS', 'MORE'].includes(item.label) && 'Option 1'}
                                  </button>
                                  <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">
                                    {item.label === 'STUDENTS' && 'Student Handbook'}
                                    {item.label === 'PARENTS' && 'Parent Handbook'}
                                    {item.label === 'CALENDARS' && 'Events Calendar'}
                                    {item.label === 'MORE' && 'Contact Information'}
                                    {!['STUDENTS', 'PARENTS', 'CALENDARS', 'MORE'].includes(item.label) && 'Option 2'}
                                  </button>
                                  <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">
                                    {item.label === 'STUDENTS' && 'Student Activities'}
                                    {item.label === 'PARENTS' && 'Volunteer Opportunities'}
                                    {item.label === 'CALENDARS' && 'Holiday Schedule'}
                                    {item.label === 'MORE' && 'About Us'}
                                    {!['STUDENTS', 'PARENTS', 'CALENDARS', 'MORE'].includes(item.label) && 'Option 3'}
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
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Hillcrest Elementary</button>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Oak Grove Elementary</button>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Lincoln Elementary</button>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Ruston Elementary</button>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Simsboro Elementary</button>
                              
                              <div className="text-xs font-semibold text-gray-500 px-3 py-1 mt-3">Middle Schools</div>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Ruston Junior High</button>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Lincoln Junior High</button>
                              
                              <div className="text-xs font-semibold text-gray-500 px-3 py-1 mt-3">High Schools</div>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Ruston High School</button>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Lincoln High School</button>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Simsboro High School</button>
                              
                              <div className="text-xs font-semibold text-gray-500 px-3 py-1 mt-3">Special Programs</div>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Early Childhood Center</button>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Alternative Learning Center</button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <button 
                          onClick={() => toggleExpanded('TRANSLATE')}
                          className="flex items-center gap-3 px-3 py-4 hover:bg-gray-100 rounded w-full text-left"
                        >
                          <IconWorld size={18} className="text-gray-600" />
                          <span className="font-medium text-gray-800">TRANSLATE</span>
                          <IconChevronDown 
                            size={16} 
                            className={`text-gray-500 ml-auto transition-transform duration-200 ${
                              expandedItems.includes('TRANSLATE') ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                        {expandedItems.includes('TRANSLATE') && (
                          <div className="bg-gray-50 border-b border-gray-200">
                            <div className="px-6 py-2 space-y-2">
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">English</button>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">Spanish</button>
                              <button className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded text-sm">French</button>
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