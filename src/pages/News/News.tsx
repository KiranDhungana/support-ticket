import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Text, 
  Badge, 
  Group, 
  Button, 
  Title, 
  Container, 
  TextInput, 
  Select,
  Image
} from '@mantine/core';
import { 
  IconSearch, 
  IconFilter, 
  IconCalendar, 
  IconUser, 
  IconEye,
  IconArrowRight
} from '@tabler/icons-react';
import HomeNavigation from '../../components/HomeNavigation';
import Pagination from '../../components/Pagination';
import { getPublishedNews } from '../../services/newsService';
import type { News } from '../../services/newsService';

const categories = ['All Categories', 'News', 'Updates', 'Events'];

const NewsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await getPublishedNews(currentPage, 6);
        setNews(response.data);
        setTotalPages(response.pagination.pages);
        setTotalItems(response.pagination.total);
        
        // Check if there's a specific article requested in URL
        const articleId = searchParams.get('article');
        if (articleId) {
          const requestedArticle = response.data.find(item => item.id === articleId);
          if (requestedArticle) {
            // Navigate to the article page instead of opening modal
            navigate(`/news/article/${articleId}`);
          }
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage, searchParams, navigate]);

  // Filter news based on search term and category
  const filteredNews = useMemo(() => {
    return news.filter(newsItem => {
      const matchesSearch = newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (newsItem.summary && newsItem.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           newsItem.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [news, searchTerm]);

  const handleViewNews = (newsItem: News) => {
    navigate(`/news/article/${newsItem.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
            Stay informed about the latest news, achievements, and events at West Carroll Parish School Board
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
          <Card shadow="sm" radius="md" withBorder className="mb-4 overflow-hidden">
            <div className="relative">
              <Image
                src={filteredNews[0].imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=800&h=400&fit=crop'}
                alt={filteredNews[0].title}
                className="w-full h-32 object-contain bg-gray-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <Badge color="red" size="xs" className="mb-1">FEATURED</Badge>
                <Title order={2} className="text-lg font-bold mb-1">
                  {filteredNews[0].title}
                </Title>
                <Text className="mb-2 opacity-90 text-xs">{filteredNews[0].summary || filteredNews[0].content.substring(0, 80)}</Text>
                <Group gap="md" className="text-xs opacity-80">
                  <Group gap="xs">
                    <IconUser size={12} />
                    <span>{filteredNews[0].author}</span>
                  </Group>
                  <Group gap="xs">
                    <IconCalendar size={12} />
                    <span>{formatDate(filteredNews[0].publishedAt || filteredNews[0].createdAt)}</span>
                  </Group>
                </Group>
                <Button
                  variant="white"
                  color="dark"
                  size="xs"
                  rightSection={<IconArrowRight size={12} />}
                  onClick={() => handleViewNews(filteredNews[0])}
                  className="mt-2"
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
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading news...</p>
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No news articles found.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNews.slice(currentPage === 1 ? 1 : 0).map((newsItem) => (
                  <div key={newsItem.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex-1 p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge color="blue" variant="light" size="xs">
                            News
                          </Badge>
                          <Text size="xs" c="dimmed">
                            {Math.ceil(newsItem.content.length / 200)} min read
                          </Text>
                        </div>
                        
                        <Title order={3} className="text-base font-bold mb-1 text-gray-900 leading-tight">
                          {newsItem.title}
                        </Title>
                        
                        <div className="text-gray-600 text-xs mb-1">
                          By {newsItem.author}
                        </div>
                        
                        <Text size="xs" className="text-gray-700 mb-1 leading-relaxed">
                          {newsItem.summary || newsItem.content.substring(0, 60)}...
                        </Text>
                        
                        <div className="flex items-center justify-between">
                          <Group gap="md" className="text-xs text-gray-500">
                            <Group gap="xs">
                              <IconCalendar size={10} />
                              <span className="text-xs">{formatDate(newsItem.publishedAt || newsItem.createdAt)}</span>
                            </Group>
                          </Group>
                          
                          <Button
                            variant="light"
                            size="xs"
                            rightSection={<IconEye size={12} />}
                            onClick={() => handleViewNews(newsItem)}
                          >
                            Read More
                          </Button>
                        </div>
                      </div>
                      
                      <div className="sm:w-32 flex-shrink-0">
                        <Image
                          src={newsItem.imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=800&h=400&fit=crop'}
                          alt={newsItem.title}
                          className="w-full h-full object-contain bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={6}
            />
          )}
        </Card>
      </Container>


    </div>
  );
};

export default NewsPage; 