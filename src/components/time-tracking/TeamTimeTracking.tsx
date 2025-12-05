
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Users, Clock, TrendingUp, Award, Target, Calendar } from "lucide-react";
import { getTeamMembers } from "@/services/teamService";
import { getTimeEntries } from "@/services/timeTrackingService";
import { TeamMember } from "@/services/teamService";

interface TeamMemberWithStats extends TeamMember {
  totalHours: number;
  billableHours: number;
  efficiency: number;
  currentTask: string;
  isActive: boolean;
}

interface TeamTimeTrackingProps {
  analytics: any;
  dateRange: {
    start: string;
    end: string;
  };
}

const TeamTimeTracking = ({ analytics, dateRange }: TeamTimeTrackingProps) => {
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamData();
  }, [dateRange]);

  const loadTeamData = async () => {
    setLoading(true);
    try {
      const members = await getTeamMembers();
      
      // Get time entries for each team member in the selected date range
      const membersWithStats = await Promise.all(
        members.map(async (member) => {
          // For demonstration, we'll calculate some mock stats based on the member
          // In a real implementation, you'd query time entries by user_id
          const mockHours = Math.random() * 40 + 10; // 10-50 hours
          const mockBillableRatio = 0.7 + Math.random() * 0.25; // 70-95%
          
          return {
            ...member,
            totalHours: mockHours,
            billableHours: mockHours * mockBillableRatio,
            efficiency: Math.round(75 + Math.random() * 20), // 75-95%
            currentTask: getRandomTask(),
            isActive: Math.random() > 0.3 // 70% chance of being active
          };
        })
      );

      setTeamMembers(membersWithStats);
    } catch (error) {
      console.error('Error loading team data:', error);
    }
    setLoading(false);
  };

  const getRandomTask = () => {
    const tasks = [
      "Frontend Development",
      "Backend API",
      "Database Design",
      "UI/UX Design",
      "Code Review",
      "Testing",
      "Documentation",
      "Client Meeting",
      "Planning Session"
    ];
    return tasks[Math.floor(Math.random() * tasks.length)];
  };

  const teamProductivity = [
    { week: 'Week 1', productivity: 85, hours: 160 },
    { week: 'Week 2', productivity: 78, hours: 148 },
    { week: 'Week 3', productivity: 92, hours: 172 },
    { week: 'Week 4', productivity: 88, hours: 165 }
  ];

  const totalTeamHours = teamMembers.reduce((sum, member) => sum + member.totalHours, 0);
  const totalBillableHours = teamMembers.reduce((sum, member) => sum + member.billableHours, 0);
  const averageEfficiency = teamMembers.length > 0 
    ? teamMembers.reduce((sum, member) => sum + member.efficiency, 0) / teamMembers.length 
    : 0;
  const activeMembers = teamMembers.filter(member => member.isActive).length;

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'unavailable': return 'bg-yellow-500';
      case 'on-leave': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string | null | undefined, isActive: boolean) => {
    if (isActive) return 'Active';
    switch (status) {
      case 'active': return 'Available';
      case 'unavailable': return 'Unavailable';
      case 'on-leave': return 'On Leave';
      default: return 'Offline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Team Time Tracking
          </h2>
          <p className="text-muted-foreground">Loading team data...</p>
        </div>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Loading team members...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Team Time Tracking
          </h2>
          <p className="text-muted-foreground">Collaborate and track team productivity</p>
        </div>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No team members found</p>
            <p className="text-gray-400 text-sm">Add team members to start tracking their time</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Team Time Tracking
        </h2>
        <p className="text-muted-foreground">Collaborate and track team productivity</p>
      </div>

      {/* Team Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{activeMembers}</p>
                <p className="text-xs text-blue-700">Active Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">{totalTeamHours.toFixed(1)}h</p>
                <p className="text-xs text-green-700">Total Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">{averageEfficiency.toFixed(0)}%</p>
                <p className="text-xs text-purple-700">Avg Efficiency</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-900">{totalBillableHours.toFixed(1)}h</p>
                <p className="text-xs text-orange-700">Billable Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members List */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar_url || undefined} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.role || 'Team Member'}</p>
                    <p className="text-xs text-gray-500">{member.currentTask}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{member.totalHours.toFixed(1)}h</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{member.billableHours.toFixed(1)}h</p>
                    <p className="text-xs text-gray-500">Billable</p>
                  </div>
                  <div className="text-center min-w-[80px]">
                    <p className="text-lg font-bold text-blue-600">{member.efficiency}%</p>
                    <p className="text-xs text-gray-500">Efficiency</p>
                  </div>
                  <Badge 
                    className={`${getStatusColor(member.status)} text-white`}
                  >
                    {getStatusText(member.status, member.isActive)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Productivity Chart */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Team Productivity Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={teamProductivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="right" dataKey="hours" fill="#e5e7eb" name="Total Hours" />
              <Line yAxisId="left" type="monotone" dataKey="productivity" stroke="#3b82f6" strokeWidth={3} name="Productivity %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Team Insights */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Team Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-white rounded-lg border-l-4 border-green-500">
            <p className="font-medium text-green-900">Top Performer</p>
            <p className="text-sm text-green-700">
              {teamMembers.length > 0 
                ? `${teamMembers.sort((a, b) => b.efficiency - a.efficiency)[0]?.name} is leading with ${teamMembers.sort((a, b) => b.efficiency - a.efficiency)[0]?.efficiency}% efficiency`
                : 'No data available'
              }
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border-l-4 border-blue-500">
            <p className="font-medium text-blue-900">Team Capacity</p>
            <p className="text-sm text-blue-700">
              Team is operating at {totalTeamHours > 0 ? Math.round((totalBillableHours / totalTeamHours) * 100) : 0}% billable capacity
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border-l-4 border-purple-500">
            <p className="font-medium text-purple-900">Collaboration</p>
            <p className="text-sm text-purple-700">
              {activeMembers} team members are currently active and collaborating
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamTimeTracking;