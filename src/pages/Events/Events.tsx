import { useState, useEffect } from 'react';
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
  Grid,
  Stack,
  Breadcrumbs,
  Anchor,
  Loader,
  Pagination
} from '@mantine/core';
import { 
  IconSearch, 
  IconFilter, 
  IconMapPin, 
  IconClock,
  IconArrowRight
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import HomeNavigation from '../../components/HomeNavigation';
import calendarService, { type CalendarEvent } from '../../services/calendarService';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Fetch events data
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await calendarService.getEvents(100); // Get more events for the events page
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter events based on search term and month
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedMonth === 'all') return matchesSearch;
    
    const startDate = event.start.dateTime || event.start.date;
    if (!startDate) return matchesSearch;
    
    const eventDate = new Date(startDate);
    const eventMonth = eventDate.getMonth() + 1; // getMonth() returns 0-11
    const selectedMonthNum = parseInt(selectedMonth);
    
    return matchesSearch && eventMonth === selectedMonthNum;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatEventDate = (event: CalendarEvent) => {
    const startDate = event.start.dateTime || event.start.date;
    if (!startDate) return { month: 'N/A', day: 'N/A', year: 'N/A' };
    
    const date = new Date(startDate);
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate().toString();
    const year = date.getFullYear().toString();
    
    // Check if it's a multi-day event
    if (event.end.dateTime || event.end.date) {
      const endDateStr = event.end.dateTime || event.end.date;
      if (endDateStr) {
        const endDate = new Date(endDateStr);
        if (endDate.getDate() !== date.getDate() || endDate.getMonth() !== date.getMonth()) {
          const endDay = endDate.getDate().toString();
          return { month, day: `${day} — ${endDay}`, year };
        }
      }
    }
    
    return { month, day, year };
  };

  const formatEventTime = (event: CalendarEvent) => {
    if (!event.start.dateTime) return 'ALL DAY';
    
    const startTime = new Date(event.start.dateTime);
    const endTime = event.end.dateTime ? new Date(event.end.dateTime) : null;
    
    const startTimeStr = startTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    if (endTime) {
      const endTimeStr = endTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return `${startTimeStr} — ${endTimeStr}`;
    }
    
    return startTimeStr;
  };

  const getMonthOptions = () => {
    const months = [
      { value: 'all', label: 'All Months' },
      { value: '1', label: 'January' },
      { value: '2', label: 'February' },
      { value: '3', label: 'March' },
      { value: '4', label: 'April' },
      { value: '5', label: 'May' },
      { value: '6', label: 'June' },
      { value: '7', label: 'July' },
      { value: '8', label: 'August' },
      { value: '9', label: 'September' },
      { value: '10', label: 'October' },
      { value: '11', label: 'November' },
      { value: '12', label: 'December' }
    ];
    return months;
  };

  const breadcrumbItems = [
    { title: 'Home', href: '/' },
    { title: 'Events', href: '#' }
  ].map((item, index) => (
    <Anchor href={item.href} key={index} onClick={(e) => { e.preventDefault(); navigate(item.href); }}>
      {item.title}
    </Anchor>
  ));

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavigation />
      
      <Container size="xl" className="py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs className="mb-6">
          {breadcrumbItems}
        </Breadcrumbs>

        {/* Page Header */}
        <div className="mb-8">
          <Title order={1} className="text-4xl font-bold text-gray-900 mb-4">
            Calendar Events
          </Title>
          <Text className="text-gray-600">
            Stay updated with all the upcoming events, meetings, and activities at West Carroll Parish School Board
          </Text>
        </div>

        {/* Search and Filter Section */}
        <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <TextInput
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftSection={<IconSearch size={16} />}
              className="flex-1"
            />
            <Select
              placeholder="Select Month"
              value={selectedMonth}
              onChange={(value) => setSelectedMonth(value || 'all')}
              data={getMonthOptions()}
              leftSection={<IconFilter size={16} />}
              className="w-full md:w-64"
            />
          </div>
        </Card>

        {/* Events Grid */}
        {loading ? (
          <Card shadow="sm" padding="xl" radius="md" withBorder className="text-center">
            <Loader size="lg" className="mx-auto mb-4" />
            <Text size="lg" className="text-gray-600">
              Loading events...
            </Text>
          </Card>
        ) : filteredEvents.length === 0 ? (
          <Card shadow="sm" padding="xl" radius="md" withBorder className="text-center">
            <Text size="lg" className="text-gray-600">
              {searchTerm || selectedMonth !== 'all' 
                ? 'No events found matching your search criteria.' 
                : 'No upcoming events available.'
              }
            </Text>
          </Card>
        ) : (
          <>
            <Grid gutter="lg">
              {paginatedEvents.map((event) => {
                const dateInfo = formatEventDate(event);
                const timeInfo = formatEventTime(event);
                
                return (
                  <Grid.Col key={event.id} span={{ base: 12, sm: 6, lg: 4 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full hover:shadow-md transition-shadow">
                      <Stack gap="md" className="h-full">
                        {/* Date Badge */}
                        <div className="text-center">
                          <Badge color="blue" size="lg" variant="light" className="mb-2">
                            {dateInfo.month} {dateInfo.day}
                          </Badge>
                          {dateInfo.year && (
                            <Text size="sm" className="text-gray-600">
                              {dateInfo.year}
                            </Text>
                          )}
                        </div>

                        {/* Event Title */}
                        <Title order={3} className="text-lg font-bold text-gray-900 text-center">
                          {event.summary}
                        </Title>

                        {/* Event Details */}
                        <Stack gap="xs" className="flex-1">
                          {timeInfo !== 'ALL DAY' && (
                            <Group gap="xs" className="text-sm text-gray-600">
                              <IconClock size={16} />
                              <Text size="sm">{timeInfo}</Text>
                            </Group>
                          )}
                          
                          {event.location && (
                            <Group gap="xs" className="text-sm text-gray-600">
                              <IconMapPin size={16} />
                              <Text size="sm" className="truncate">{event.location}</Text>
                            </Group>
                          )}
                          
                          {event.description && (
                            <Text size="sm" className="text-gray-700 line-clamp-3">
                              {event.description}
                            </Text>
                          )}
                        </Stack>

                        {/* Action Button */}
                        <Button 
                          fullWidth 
                          variant="light" 
                          color="blue"
                          rightSection={<IconArrowRight size={16} />}
                          onClick={() => {
                            // You can add a modal or detailed view here
                            console.log('View event details:', event);
                          }}
                        >
                          View Details
                        </Button>
                      </Stack>
                    </Card>
                  </Grid.Col>
                );
              })}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  value={currentPage}
                  onChange={setCurrentPage}
                  total={totalPages}
                  size="md"
                />
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default Events;
