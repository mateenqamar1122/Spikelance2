import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Target, Users, TrendingUp, Brain, Zap } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import TimeTracker from "@/components/time-tracking/TimeTracker";
import TimeAnalytics from "@/components/time-tracking/TimeAnalytics";
import TimeGoals from "@/components/time-tracking/TimeGoals";
import ProductivityInsights from "@/components/time-tracking/ProductivityInsights";
import TeamTimeTracking from "@/components/time-tracking/TeamTimeTracking";
import { getTimeEntries, getTimeAnalytics } from "@/services/timeTrackingService";
import { getProjects } from "@/services/projectService";
import { TimeEntry, Project } from "@/types/database";

const TimeTracking = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [dateRange, setDateRange] = useState({
    start: format(startOfWeek(new Date()), 'yyyy-MM-dd'),
    end: format(endOfWeek(new Date()), 'yyyy-MM-dd')
  });
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [dateRange, selectedProject]);

  const loadData = async () => {
    setIsLoading(true);
    
    const [entriesData, projectsData, analyticsData] = await Promise.all([
      getTimeEntries({
        start_date: dateRange.start,
        end_date: dateRange.end,
        project_id: selectedProject !== "all" ? selectedProject : undefined
      }),
      getProjects(),
      getTimeAnalytics({
        start_date: dateRange.start,
        end_date: dateRange.end,
        project_id: selectedProject !== "all" ? selectedProject : undefined
      })
    ]);

    setTimeEntries(entriesData);
    setProjects(projectsData);
    setAnalytics(analyticsData);
    setIsLoading(false);
  };

  const handleDateRangePreset = (preset: string) => {
    const now = new Date();
    let start: Date, end: Date;

    switch (preset) {
      case 'thisWeek':
        start = startOfWeek(now);
        end = endOfWeek(now);
        break;
      case 'thisMonth':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'lastWeek':
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        start = startOfWeek(lastWeek);
        end = endOfWeek(lastWeek);
        break;
      case 'lastMonth':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        break;
      default:
        return;
    }

    setDateRange({
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd')
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Advanced Time Tracking
          </h1>
          <p className="text-muted-foreground">
            AI-powered time tracking with productivity insights and team collaboration
          </p>
        </div>
      </div>

      <Tabs defaultValue="tracker" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white border shadow-sm">
          <TabsTrigger value="tracker" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <Clock className="h-4 w-4" />
            Tracker
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <Target className="h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <Brain className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <TimeTracker onTimeEntrySaved={loadData} />
            </div>
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Recent Time Entries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {timeEntries.slice(0, 5).length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No recent time entries</p>
                      <p className="text-gray-400 text-sm">Start tracking time to see entries here</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {timeEntries.slice(0, 5).map((entry) => (
                        <div key={entry.id} className="border rounded-lg p-3 hover:bg-gray-50/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {entry.project?.name || entry.projects?.name || "No Project"}
                              </p>
                              <p className="text-sm text-muted-foreground">{entry.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {entry.duration_minutes ? `${Math.floor(entry.duration_minutes / 60)}h ${entry.duration_minutes % 60}m` : "Active"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(entry.start_time), "MMM d, h:mm a")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Date Range Filters */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Date Range
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Quick Range</Label>
                  <Select onValueChange={handleDateRangePreset}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thisWeek">This Week</SelectItem>
                      <SelectItem value="lastWeek">Last Week</SelectItem>
                      <SelectItem value="thisMonth">This Month</SelectItem>
                      <SelectItem value="lastMonth">Last Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Project</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="All projects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All projects</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {analytics && <TimeAnalytics analytics={analytics} />}
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <TimeGoals analytics={analytics} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <ProductivityInsights analytics={analytics} />
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <TeamTimeTracking analytics={analytics} dateRange={dateRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeTracking;