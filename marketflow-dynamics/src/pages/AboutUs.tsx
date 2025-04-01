
import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Github, Linkedin, Code, GraduationCap } from 'lucide-react';

const teamMembers = [
  {
    id: 1,
    name: "Aayush Acharya",
    role: "Lead Frontend Developer",
    bio: "Passionate about creating intuitive user interfaces and seamless user experiences.",
    initials: "AA"
  },
  {
    id: 2,
    name: "Aarjanmani Kandel",
    role: "Backend Developer",
    bio: "Experienced in building robust and scalable backend systems for financial applications.",
    initials: "AK"
  },
  {
    id: 3,
    name: "Nirajan Kumar Yadav",
    role: "Full Stack Developer",
    bio: "Skilled in end-to-end development with a focus on real-time data processing and visualization.",
    initials: "NY"
  },
  {
    id: 4,
    name: "Nilisha Shakya",
    role: "UI/UX Designer",
    bio: "Combines aesthetic design principles with user psychology to create engaging trading interfaces.",
    initials: "NS"
  }
];

const AboutUs = () => {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">The TradeHeaven Team</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Meet the innovative minds behind TradeHeaven, dedicated to creating the most intuitive and 
              powerful trading platform for investors worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {teamMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 pb-8 pt-6">
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24 border-4 border-background">
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardTitle className="text-center text-xl mb-2">{member.name}</CardTitle>
                  <p className="text-center text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-center text-muted-foreground text-sm mb-4">{member.bio}</p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <Github className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                    <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                    <Code className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                At TradeHeaven, we're committed to democratizing financial markets through intuitive technology. 
                Our platform combines powerful analytics with user-friendly interfaces, enabling traders of all 
                experience levels to make informed decisions. We believe in transparency, security, and 
                continuous innovation to provide the best trading experience possible.
              </p>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-muted-foreground">
              <GraduationCap className="h-5 w-5" />
              <span>Founded in 2023 • TradeHeaven, Inc.</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default AboutUs;
