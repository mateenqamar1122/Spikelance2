import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, ArrowLeft } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import TimeEntryList from "@/components/time-tracking/TimeEntryList";
import { getTimeEntries } from "@/services/timeTrackingService";
import { getProjects } from "@/services/projectService";
import { TimeEntry, Project } from "@/types/database";
import { useNavigate } from "react-router-dom";

const Timesheet = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [dateRange, setDateRange] = useState({
    start: format(startOfWeek(new Date()), 'yyyy-MM-dd'),
    end: format(endOfWeek(new Date()), 'yyyy-MM-dd')
  });
  // Initialize state with non-empty values
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [dateRange, selectedProject]);

  const loadData = async () => {
    setIsLoading(true);
    
    try {
      const [entriesData, projectsData] = await Promise.all([
        getTimeEntries({
          start_date: dateRange.start,
          end_date: dateRange.end,
          project_id: selectedProject === "all" ? undefined : selectedProject
        }),
        getProjects()
      ]);
  
      setTimeEntries(entriesData);
      setProjects(projectsData);
    } catch (error) {
      console.error("Error loading timesheet data:", error);
    } finally {
      setIsLoading(false);
    }
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
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/time-tracking")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Timesheet</h1>
            <p className="text-muted-foreground">
              View and manage your time entries
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.print()}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Quick Range</Label>
              <Select onValueChange={handleDateRangePreset} defaultValue="thisWeek">
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
            
            // Fix the project selection part
            <div className="space-y-2">
              <Label>Project</Label>
              <Select 
                value={selectedProject} 
                onValueChange={setSelectedProject} 
                defaultValue="all"
              >
                <SelectTrigger>
                  <SelectValue placeholder="All projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All projects</SelectItem>
                  {projects.map((project) => (
                    project.id ? (
                      <SelectItem 
                        key={project.id} 
                        value={project.id.toString()}
                      >
                        {project.name || "Unnamed Project"}
                      </SelectItem>
                    ) : null
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <TimeEntryList
        entries={timeEntries}
        projects={projects}
        onEntryDeleted={loadData}
        isLoading={isLoading}
      />

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="text-2xl font-bold">
                {Math.floor(timeEntries.reduce((acc, entry) => acc + (entry.duration_minutes || 0), 0) / 60)}h {timeEntries.reduce((acc, entry) => acc + (entry.duration_minutes || 0), 0) % 60}m
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Entries</p>
              <p className="text-2xl font-bold">{timeEntries.length}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Projects</p>
              <p className="text-2xl font-bold">
                {new Set(timeEntries.map(entry => entry.project_id)).size}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timesheet;