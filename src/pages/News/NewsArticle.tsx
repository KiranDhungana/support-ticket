import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Title, 
  Text, 
  Group, 
  Badge, 
  Image, 
  Button
} from '@mantine/core';
import { 
  IconCalendar, 
  IconUser, 
  IconEye,
  IconArrowLeft
} from '@tabler/icons-react';
import HomeNavigation from '../../components/HomeNavigation';
import { getPublishedNews } from '../../services/newsService';
import type { News } from '../../services/newsService';

const NewsArticle = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) {
        setError('Article ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch all news and find the specific article
        const response = await getPublishedNews(1, 100); // Get more articles to find the one we need
        const foundArticle = response.data.find(item => item.id === articleId);
        
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          setError('Article not found');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HomeNavigation />
        <Container size="lg" className="py-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading article...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HomeNavigation />
        <Container size="lg" className="py-8">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error || 'Article not found'}</p>
            <Button onClick={() => navigate('/news')} leftSection={<IconArrowLeft size={16} />}>
              Back to News
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavigation />
      
      <Container size="lg" className="py-8">
        <Button 
          variant="subtle" 
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate('/news')}
          className="mb-6"
        >
          Back to News
        </Button>

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Article Header */}
          <div className="p-8 border-b border-gray-200">
            <Badge color="blue" size="sm" className="mb-4">NEWS</Badge>
            <Title order={1} className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </Title>
            
            <Group gap="lg" className="text-sm text-gray-600 mb-4">
              <Group gap="xs">
                <IconUser size={16} />
                <span><strong>Author:</strong> {article.author}</span>
              </Group>
              <Group gap="xs">
                <IconCalendar size={16} />
                <span><strong>Published:</strong> {formatDate(article.publishedAt || article.createdAt)}</span>
              </Group>
              <Group gap="xs">
                <IconEye size={16} />
                <span>{Math.ceil(article.content.length / 200)} min read</span>
              </Group>
            </Group>

            {article.summary && (
              <Text className="text-lg text-gray-700 italic border-l-4 border-blue-500 pl-4">
                {article.summary}
              </Text>
            )}
          </div>

          {/* Article Image */}
          {article.imageUrl && (
            <div className="w-full">
              <Image
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-96 object-contain bg-gray-100"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="p-8">
            <div className="prose max-w-none">
              {article.content.split('\n\n').map((paragraph: string, index: number) => (
                <Text key={index} className="mb-6 leading-relaxed text-gray-800 text-lg">
                  {paragraph}
                </Text>
              ))}
            </div>
          </div>
        </article>
      </Container>
    </div>
  );
};

export default NewsArticle; 