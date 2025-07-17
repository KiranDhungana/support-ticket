import { useState, useMemo } from 'react';
import { 
  Card, 
  Text, 
  Badge, 
  Group, 
  Button, 
  Modal, 
  Stack, 
  Title, 
  Container, 
  TextInput, 
  Select,
  Image,
  Grid,
  Divider
} from '@mantine/core';
import { 
  IconSearch, 
  IconFilter, 
  IconCalendar, 
  IconUser, 
  IconTag,
  IconEye,
  IconArrowRight
} from '@tabler/icons-react';
import HomeNavigation from '../../components/HomeNavigation';
import Pagination from '../../components/Pagination';

// Sample news data
const newsData = [
  {
    id: 1,
    title: 'Lincoln Parish Schools Rank #1 in State Academic Performance',
    summary: 'Lincoln Parish School District has achieved the highest academic performance ranking in the state for the 2023-2024 school year, with significant improvements in math and reading scores across all grade levels.',
    content: `Lincoln Parish School District is proud to announce that we have achieved the #1 ranking in state academic performance for the 2023-2024 school year. This remarkable achievement reflects the dedication of our students, teachers, administrators, and the entire school community.

Our district saw significant improvements in standardized test scores, with math scores increasing by 15% and reading scores improving by 12% compared to the previous year. Elementary schools showed particularly strong performance, with 85% of students meeting or exceeding grade-level expectations.

"This success is a testament to the hard work and commitment of our entire educational community," said Superintendent Dr. Sarah Johnson. "Our teachers have implemented innovative teaching strategies, and our students have risen to the challenge with enthusiasm and determination."

The district's success can be attributed to several key initiatives:
• Enhanced professional development for teachers
• Implementation of new technology in classrooms
• Increased parental involvement programs
• Extended learning opportunities for students

We look forward to building on this success and continuing to provide the highest quality education for all our students.`,
    author: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    category: 'Academic Achievement',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=800&h=400&fit=crop',
    readTime: '5 min read',
    featured: true,
    tags: ['Academic Achievement', 'State Rankings', 'Student Success']
  },
  {
    id: 2,
    title: 'New STEM Lab Opens at Lincoln High School',
    summary: 'A state-of-the-art STEM laboratory has been inaugurated at Lincoln High School, providing students with cutting-edge technology and hands-on learning opportunities in science, technology, engineering, and mathematics.',
    content: `Lincoln High School celebrated the grand opening of its new state-of-the-art STEM laboratory today, marking a significant milestone in our commitment to providing cutting-edge educational opportunities for our students.

The new facility features:
• Advanced robotics equipment and programming stations
• 3D printers and laser cutting technology
• Virtual reality learning environments
• Collaborative workspaces for group projects
• Professional-grade scientific instruments

"This STEM lab represents our commitment to preparing students for the careers of tomorrow," said Principal Michael Davis. "Students will have access to technology and equipment that many colleges and universities are just beginning to implement."

The lab was funded through a combination of district resources and generous community donations. Local businesses and organizations contributed over $500,000 to make this project possible.

Students will begin using the new facility next week, with classes scheduled in robotics, computer science, advanced mathematics, and engineering design. The lab will also be available for after-school programs and student-led projects.

"We're excited to see how our students will use this space to explore, create, and innovate," said STEM Coordinator Lisa Martinez. "This is just the beginning of what we can accomplish together."`,
    author: 'Michael Davis',
    date: '2024-01-12',
    category: 'Facilities',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop',
    readTime: '4 min read',
    featured: false,
    tags: ['STEM', 'Technology', 'Facilities', 'Innovation']
  },
  {
    id: 3,
    title: 'Student Art Exhibition Showcases Local Talent',
    summary: 'The annual student art exhibition opened this week, featuring over 200 pieces of artwork created by students from elementary through high school, highlighting the district\'s commitment to arts education.',
    content: `The Lincoln Parish Schools Annual Student Art Exhibition opened this week at the district's Cultural Arts Center, showcasing the incredible talent and creativity of our students. The exhibition features over 200 pieces of artwork created by students from kindergarten through 12th grade.

This year's exhibition includes:
• Paintings and drawings in various mediums
• Sculptures and 3D art pieces
• Digital art and graphic design
• Photography and mixed media works
• Collaborative installations

"The quality and creativity of the artwork on display is truly remarkable," said Art Department Chair Rachel Green. "Our students have demonstrated not only technical skill but also deep artistic expression and innovative thinking."

The exhibition is organized by grade level and medium, allowing visitors to see the progression of artistic development throughout a student's educational journey. Special recognition is given to students whose work has been selected for state and regional competitions.

"This exhibition celebrates the importance of arts education in developing well-rounded students," said Superintendent Dr. Sarah Johnson. "The arts help students develop critical thinking, creativity, and self-expression skills that are essential for success in any field."

The exhibition will be open to the public through the end of the month, with guided tours available for school groups and community organizations.`,
    author: 'Rachel Green',
    date: '2024-01-10',
    category: 'Arts & Culture',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8a?w=800&h=400&fit=crop',
    readTime: '3 min read',
    featured: false,
    tags: ['Arts', 'Student Achievement', 'Exhibition', 'Creativity']
  },
  {
    id: 4,
    title: 'Athletic Teams Win Regional Championships',
    summary: 'Lincoln Parish Schools athletic teams have secured multiple regional championships this season, with the football, basketball, and track teams all bringing home titles.',
    content: `Lincoln Parish Schools is celebrating an outstanding athletic season with multiple regional championships across various sports. Our student-athletes have demonstrated exceptional skill, dedication, and sportsmanship throughout the season.

Championship Results:
• Football: Lincoln High School won the Regional Championship with a 12-2 record
• Basketball: Both boys' and girls' teams secured regional titles
• Track & Field: Individual and team championships in multiple events
• Swimming: Regional champions in several categories
• Tennis: Doubles and singles championships

"This has been an incredible season for our athletic programs," said Athletic Director Robert Brown. "Our student-athletes have worked tirelessly to achieve these results, and their success reflects the strong foundation of our athletic programs."

The success extends beyond the playing field, with student-athletes maintaining high academic standards. Over 85% of our athletes maintain a GPA of 3.0 or higher, demonstrating the district's commitment to academic excellence alongside athletic achievement.

"Our coaches emphasize the importance of balance between athletics and academics," said Principal Michael Davis. "These championships are a testament to the hard work and dedication of our students, coaches, and the entire athletic community."

The teams will now advance to state competitions, where they will represent Lincoln Parish Schools against the best teams in the state.`,
    author: 'Robert Brown',
    date: '2024-01-08',
    category: 'Athletics',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
    readTime: '4 min read',
    featured: false,
    tags: ['Athletics', 'Championships', 'Student Achievement', 'Sports']
  },
  {
    id: 5,
    title: 'Community Service Day Brings Together Students and Residents',
    summary: 'Over 500 students, staff, and community members participated in the annual Community Service Day, completing projects that benefit the local community and strengthen school-community partnerships.',
    content: `Lincoln Parish Schools hosted its annual Community Service Day this weekend, bringing together over 500 students, staff, and community members for a day of service and collaboration. The event featured 25 different service projects across the community.

Service Projects Included:
• Park cleanup and beautification
• Food bank assistance and meal preparation
• Senior citizen home visits and assistance
• Environmental conservation projects
• Educational workshops for younger students
• Community garden maintenance

"This event demonstrates the strong partnership between our schools and the community," said Community Outreach Coordinator Amanda White. "Students learn the value of service while making a real difference in our community."

The day began with a community breakfast and opening ceremony, followed by project assignments and work throughout the morning. Students worked alongside community members, building relationships and learning about local needs and resources.

"Community Service Day is one of my favorite events of the year," said student council president Jennifer Garcia. "It's amazing to see how much we can accomplish when we work together as a community."

The event concluded with a celebration lunch and recognition ceremony, where participants shared their experiences and the impact of their work. Plans are already underway for next year's event, with new projects and partnerships being developed.

"This event strengthens our community bonds and teaches students the importance of civic engagement," said Superintendent Dr. Sarah Johnson. "We're proud to be part of such a caring and active community."`,
    author: 'Amanda White',
    date: '2024-01-05',
    category: 'Community',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c7450217?w=800&h=400&fit=crop',
    readTime: '5 min read',
    featured: false,
    tags: ['Community Service', 'Volunteerism', 'Partnerships', 'Civic Engagement']
  },
  {
    id: 6,
    title: 'Technology Upgrade Enhances Learning Experience',
    summary: 'The district has completed a comprehensive technology upgrade, providing new devices and improved infrastructure to enhance the learning experience for all students.',
    content: `Lincoln Parish Schools has completed a comprehensive technology upgrade that will significantly enhance the learning experience for all students. The $2.5 million project includes new devices, improved infrastructure, and enhanced digital learning tools.

Technology Improvements:
• New Chromebooks for all students in grades 3-12
• Updated computer labs with high-performance workstations
• Enhanced Wi-Fi infrastructure across all campuses
• New interactive whiteboards and projectors
• Digital library resources and e-books
• Online learning platforms and tools

"This technology upgrade represents our commitment to preparing students for the digital world," said IT Coordinator Lisa Martinez. "Students now have access to the tools and resources they need to succeed in today's technology-driven society."

The upgrade also includes professional development for teachers, ensuring they can effectively integrate technology into their lesson plans. Training sessions have been ongoing throughout the semester, with teachers reporting increased student engagement and improved learning outcomes.

"Technology is not just a tool but a fundamental part of modern education," said Principal Michael Davis. "These upgrades will help us provide a more engaging and effective learning environment for our students."

The project was funded through a combination of district resources, grants, and community support. The district worked closely with technology partners to ensure the best solutions for our educational needs.

Students and teachers are already seeing the benefits of the new technology, with increased collaboration, creativity, and academic achievement across all grade levels.`,
    author: 'Lisa Martinez',
    date: '2024-01-03',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
    readTime: '4 min read',
    featured: false,
    tags: ['Technology', 'Digital Learning', 'Infrastructure', 'Innovation']
  }
];

const categories = ['All Categories', 'Academic Achievement', 'Facilities', 'Arts & Culture', 'Athletics', 'Community', 'Technology'];

const News = () => {
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Filter news based on search term and category
  const filteredNews = useMemo(() => {
    return newsData.filter(news => {
      const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           news.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           news.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All Categories' || news.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = filteredNews.slice(startIndex, endIndex);

  const handleViewNews = (news: any) => {
    setSelectedNews(news);
    setModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavigation />
      
      <Container size="lg" className="py-8">
        <div className="mb-8">
          <Title order={1} className="text-3xl font-bold text-gray-900 mb-2">
            News & Updates
          </Title>
          <Text className="text-gray-600">
            Stay informed about the latest news, achievements, and events at Lincoln Parish Schools
          </Text>
        </div>

        {/* Search and Filter Section */}
        <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <TextInput
              placeholder="Search news articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftSection={<IconSearch size={16} />}
              className="flex-1"
            />
            <Select
              placeholder="Select Category"
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value || 'All Categories')}
              data={categories}
              leftSection={<IconFilter size={16} />}
              className="w-full md:w-64"
            />
          </div>
        </Card>

        {/* Featured News */}
        {currentPage === 1 && filteredNews.length > 0 && (
          <Card shadow="sm" radius="md" withBorder className="mb-6 overflow-hidden">
            <div className="relative">
              <Image
                src={filteredNews[0].image}
                alt={filteredNews[0].title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <Badge color="red" size="sm" className="mb-2">FEATURED</Badge>
                <Title order={2} className="text-2xl font-bold mb-2">
                  {filteredNews[0].title}
                </Title>
                <Text className="mb-4 opacity-90">{filteredNews[0].summary}</Text>
                <Group gap="md" className="text-sm opacity-80">
                  <Group gap="xs">
                    <IconUser size={14} />
                    <span>{filteredNews[0].author}</span>
                  </Group>
                  <Group gap="xs">
                    <IconCalendar size={14} />
                    <span>{formatDate(filteredNews[0].date)}</span>
                  </Group>
                  <Group gap="xs">
                    <IconTag size={14} />
                    <span>{filteredNews[0].category}</span>
                  </Group>
                </Group>
                <Button
                  variant="white"
                  color="dark"
                  rightSection={<IconArrowRight size={16} />}
                  onClick={() => handleViewNews(filteredNews[0])}
                  className="mt-4"
                >
                  Read Full Article
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* News Grid */}
        <Card shadow="sm" radius="md" withBorder className="overflow-hidden">
          <div className="p-6">
            <Grid gutter="md">
              {currentNews.slice(currentPage === 1 ? 1 : 0).map((news) => (
                <Grid.Col key={news.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full flex flex-col">
                    <Card.Section>
                      <Image
                        src={news.image}
                        alt={news.title}
                        className="w-full h-48 object-cover"
                      />
                    </Card.Section>
                    
                    <div className="flex-1 flex flex-col">
                      <Group gap="xs" className="mt-4 mb-2">
                        <Badge color="blue" variant="light" size="sm">
                          {news.category}
                        </Badge>
                        <Text size="xs" c="dimmed">{news.readTime}</Text>
                      </Group>
                      
                      <Title order={3} className="text-lg font-semibold mb-2 line-clamp-2">
                        {news.title}
                      </Title>
                      
                      <Text size="sm" className="text-gray-600 mb-4 line-clamp-3 flex-1">
                        {news.summary}
                      </Text>
                      
                      <div className="mt-auto">
                        <Group gap="md" className="text-xs text-gray-500 mb-3">
                          <Group gap="xs">
                            <IconUser size={12} />
                            <span>{news.author}</span>
                          </Group>
                          <Group gap="xs">
                            <IconCalendar size={12} />
                            <span>{formatDate(news.date)}</span>
                          </Group>
                        </Group>
                        
                        <Button
                          variant="light"
                          fullWidth
                          rightSection={<IconEye size={16} />}
                          onClick={() => handleViewNews(news)}
                        >
                          Read More
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredNews.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </Card>
      </Container>

      {/* News Detail Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedNews?.title}
        size="xl"
        centered
        styles={{
          title: { fontSize: '1.5rem', fontWeight: 600 }
        }}
      >
        {selectedNews && (
          <Stack gap="lg">
            <Image
              src={selectedNews.image}
              alt={selectedNews.title}
              className="w-full h-64 object-cover rounded"
            />
            
            <Group gap="md" className="text-sm text-gray-600">
              <Group gap="xs">
                <IconUser size={16} />
                <span><strong>Author:</strong> {selectedNews.author}</span>
              </Group>
              <Group gap="xs">
                <IconCalendar size={16} />
                <span><strong>Date:</strong> {formatDate(selectedNews.date)}</span>
              </Group>
              <Group gap="xs">
                <IconTag size={16} />
                <span><strong>Category:</strong> {selectedNews.category}</span>
              </Group>
              <Group gap="xs">
                <IconEye size={16} />
                <span>{selectedNews.readTime}</span>
              </Group>
            </Group>

            <Divider />

            <div className="prose max-w-none">
              {selectedNews.content.split('\n\n').map((paragraph: string, index: number) => (
                <Text key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </Text>
              ))}
            </div>

            {selectedNews.tags && (
              <div>
                <Text size="sm" fw={500} className="mb-2">Tags:</Text>
                <Group gap="xs">
                  {selectedNews.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="light" color="gray" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </Group>
              </div>
            )}
          </Stack>
        )}
      </Modal>
    </div>
  );
};

export default News; 