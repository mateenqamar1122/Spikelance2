
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BarChart3, Calendar } from "lucide-react";
import { format } from "date-fns";
import TimeTracker from "@/components/time-tracking/TimeTracker";
import TimeAnalytics from "@/components/time-tracking/TimeAnalytics";
import { getTimeEntries, getTimeAnalytics } from "@/services/timeTrackingService";
import { getProjects } from "@/services/projectService";
import { TimeEntry, Project } from "@/types/database";
import { useNavigate } from "react-router-dom";

const TimeTracking = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    
    const [entriesData, projectsData, analyticsData] = await Promise.all([
      getTimeEntries({}),
      getProjects(),
      getTimeAnalytics({})
    ]);

    setTimeEntries(entriesData);
    setProjects(projectsData);
    setAnalytics(analyticsData);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Time Tracking</h1>
          <p className="text-muted-foreground">
            Track time, manage projects, and generate insights
          </p>
        </div>
        <Button onClick={() => navigate("/timesheet")}>
          View Timesheet
        </Button>
      </div>

      <Tabs defaultValue="tracker" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tracker" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Tracker
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <TimeTracker onTimeEntrySaved={loadData} />
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Time Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  {timeEntries.slice(0, 5).length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No recent time entries
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {timeEntries.slice(0, 5).map((entry) => (
                        <div key={entry.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {projects.find(p => p.id === entry.project_id)?.name || "No Project"}
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
          {analytics && <TimeAnalytics analytics={analytics} />}
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Generate detailed reports for billing, project analysis, and time management insights.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => navigate("/timesheet")}
                >
                  <Clock className="h-6 w-6" />
                  <span>Timesheet Report</span>
                  <span className="text-xs text-muted-foreground">Detailed time entries</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>Analytics Report</span>
                  <span className="text-xs text-muted-foreground">Charts and insights</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>Invoice Report</span>
                  <span className="text-xs text-muted-foreground">Billable hours summary</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeTracking;