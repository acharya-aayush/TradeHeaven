
import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Bookmark, Play, FileText, TrendingUp, BarChart3, Clock, Calendar, Book, BookOpen, GraduationCap, Star, Share2 } from 'lucide-react';

// Mock data for education content
const courseCategories = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Technical Analysis', 'Fundamental Analysis', 'Options Trading', 'Risk Management'];

const featuredCourses = [
  {
    id: 'course-1',
    title: 'Stock Market Fundamentals',
    description: 'Learn the basics of stock markets, how they work, and key terminology.',
    level: 'Beginner',
    duration: '3 hours',
    instructor: 'Sarah Johnson',
    rating: 4.8,
    students: 15420,
    image: 'https://i.imgur.com/7OQQbqB.jpeg'
  },
  {
    id: 'course-2',
    title: 'Technical Analysis Masterclass',
    description: 'Master chart patterns, indicators and technical trading strategies.',
    level: 'Intermediate',
    duration: '5 hours',
    instructor: 'Michael Chen',
    rating: 4.9,
    students: 8750,
    image: 'https://i.imgur.com/pAJVnFz.jpeg'
  },
  {
    id: 'course-3',
    title: 'Options Trading Strategies',
    description: 'Comprehensive guide to options trading with real-world examples.',
    level: 'Advanced',
    duration: '7 hours',
    instructor: 'David Wilson',
    rating: 4.7,
    students: 6320,
    image: 'https://i.imgur.com/1tMFzp8.jpeg'
  },
  {
    id: 'course-4',
    title: 'Risk Management for Traders',
    description: 'Learn how to protect your capital and manage risk effectively.',
    level: 'Intermediate',
    duration: '4 hours',
    instructor: 'Amanda Rodriguez',
    rating: 4.6,
    students: 5890,
    image: 'https://i.imgur.com/DymmTOI.jpeg'
  }
];

const articles = [
  {
    id: 'article-1',
    title: 'Understanding Market Cycles',
    description: 'How to identify and navigate different market cycles for better returns.',
    category: 'Market Analysis',
    author: 'Robert Smith',
    date: '2023-09-10',
    readTime: '10 min',
    image: 'https://i.imgur.com/iNpRcxP.jpeg'
  },
  {
    id: 'article-2',
    title: 'The Psychology of Trading',
    description: 'Master your emotions and develop a winning trading mindset.',
    category: 'Trading Psychology',
    author: 'Jennifer Park',
    date: '2023-09-05',
    readTime: '8 min',
    image: 'https://i.imgur.com/y3R3Tby.jpeg'
  },
  {
    id: 'article-3',
    title: 'Value Investing in Today\'s Market',
    description: 'How to find undervalued stocks with strong fundamentals.',
    category: 'Investing Strategy',
    author: 'Thomas Lee',
    date: '2023-08-28',
    readTime: '12 min',
    image: 'https://i.imgur.com/aQFqOPi.jpeg'
  },
  {
    id: 'article-4',
    title: 'Analyzing Financial Statements',
    description: 'A step-by-step guide to reading and interpreting company financials.',
    category: 'Fundamental Analysis',
    author: 'Emily Chang',
    date: '2023-08-20',
    readTime: '15 min',
    image: 'https://i.imgur.com/2U73hgp.jpeg'
  }
];

const webinars = [
  {
    id: 'webinar-1',
    title: 'Market Outlook Q4 2023',
    description: 'Expert panel discusses market trends and forecasts for the upcoming quarter.',
    date: '2023-09-25',
    time: '2:00 PM EST',
    presenter: 'Global Markets Team',
    status: 'upcoming',
    image: 'https://i.imgur.com/KAJQrdd.jpeg'
  },
  {
    id: 'webinar-2',
    title: 'Sector Rotation Strategies',
    description: 'How to position your portfolio as sectors move in and out of favor.',
    date: '2023-09-18',
    time: '1:00 PM EST',
    presenter: 'James Wilson',
    status: 'upcoming',
    image: 'https://i.imgur.com/vXO0Qht.jpeg'
  },
  {
    id: 'webinar-3',
    title: 'Bear Market Survival Guide',
    description: 'Strategies to protect capital and find opportunities during market downturns.',
    date: '2023-08-15',
    time: '11:00 AM EST',
    presenter: 'Laura Thompson',
    status: 'recorded',
    image: 'https://i.imgur.com/o1cOhiP.jpeg'
  },
  {
    id: 'webinar-4',
    title: 'ETF vs. Individual Stocks',
    description: 'Pros and cons of different investment vehicles for your portfolio.',
    date: '2023-07-28',
    time: '3:00 PM EST',
    presenter: 'Carlos Rodriguez',
    status: 'recorded',
    image: 'https://i.imgur.com/wxCSLCy.jpeg'
  }
];

const Education = () => {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Learning Center</h1>
            <p className="text-muted-foreground">Expand your trading knowledge with courses, articles, and webinars</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 w-full md:w-[300px]" placeholder="Search learning materials..." />
          </div>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-4">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="webinars">Webinars</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses" className="space-y-6">
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {courseCategories.map((category) => (
                <Button key={category} variant={category === 'All' ? 'default' : 'outline'} size="sm">
                  {category}
                </Button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="object-cover w-full h-full transition-transform hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        course.level === 'Beginner' ? 'bg-green-100 text-green-800' : 
                        course.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' : 
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {course.level}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-amber-500" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className="w-full">
                      <Play className="mr-2 h-4 w-4" />
                      Start Learning
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">View All Courses</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="articles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Card key={article.id} className="flex flex-col md:flex-row overflow-hidden h-full">
                  <div className="relative md:w-1/3">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="object-cover h-full w-full aspect-video md:aspect-auto"
                    />
                  </div>
                  <div className="flex flex-col md:w-2/3">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <span className="text-xs font-medium bg-muted px-2 py-1 rounded">
                          {article.category}
                        </span>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {article.readTime}
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-2">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                        <span>By {article.author}</span>
                        <span>•</span>
                        <span>{new Date(article.date).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="ml-auto">
                        <FileText className="mr-2 h-4 w-4" />
                        Read Article
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">View All Articles</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="webinars" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Upcoming Webinars</h3>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {webinars.filter(w => w.status === 'upcoming').map((webinar) => (
                <Card key={webinar.id} className="flex flex-col md:flex-row overflow-hidden h-full">
                  <div className="relative md:w-1/3">
                    <img 
                      src={webinar.image} 
                      alt={webinar.title} 
                      className="object-cover h-full w-full aspect-video md:aspect-auto"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                        Live
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col md:w-2/3">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{webinar.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 flex-1">
                      <p className="text-sm text-muted-foreground">{webinar.description}</p>
                      <div className="flex flex-col gap-1 mt-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{new Date(webinar.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{webinar.time}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{webinar.presenter}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex w-full gap-2">
                        <Button className="flex-1">Register Now</Button>
                        <Button variant="outline" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
            
            <h3 className="text-lg font-medium mt-8 mb-4">Recorded Webinars</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {webinars.filter(w => w.status === 'recorded').map((webinar) => (
                <Card key={webinar.id} className="flex flex-col md:flex-row overflow-hidden h-full">
                  <div className="relative md:w-1/3">
                    <img 
                      src={webinar.image} 
                      alt={webinar.title} 
                      className="object-cover h-full w-full aspect-video md:aspect-auto"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-2">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:w-2/3">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{webinar.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 flex-1">
                      <p className="text-sm text-muted-foreground">{webinar.description}</p>
                      <div className="flex flex-col gap-1 mt-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Recorded on {new Date(webinar.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{webinar.presenter}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button className="flex-1">
                        <Play className="mr-2 h-4 w-4" />
                        Watch Recording
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button variant="outline">View All Webinars</Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <Card className="bg-muted/30 border-dashed mt-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Learning Paths
            </CardTitle>
            <CardDescription>Structured courses for different trading levels and goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Book className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Beginner Path</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Start your trading journey with fundamental concepts and basic strategies.</p>
                <div className="text-xs text-muted-foreground">5 courses • 15 hours</div>
                <Button variant="outline" size="sm" className="mt-3 w-full">Explore Path</Button>
              </div>
              
              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Intermediate Path</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Enhance your skills with advanced analysis and diversified strategies.</p>
                <div className="text-xs text-muted-foreground">7 courses • 25 hours</div>
                <Button variant="outline" size="sm" className="mt-3 w-full">Explore Path</Button>
              </div>
              
              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">Advanced Path</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Master complex trading strategies and professional risk management.</p>
                <div className="text-xs text-muted-foreground">6 courses • 30 hours</div>
                <Button variant="outline" size="sm" className="mt-3 w-full">Explore Path</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default Education;
