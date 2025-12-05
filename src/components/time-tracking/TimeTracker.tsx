
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, Square } from "lucide-react";
import { getActiveTimeTrackingSession, startTimeTracking, stopTimeTracking } from "@/services/timeTrackingService";
import { getProjects } from "@/services/projectService";
import { TimeTrackingSession, Project } from "@/types/database";

interface TimeTrackerProps {
  onTimeEntrySaved?: () => void;
}

const TimeTracker = ({ onTimeEntrySaved }: TimeTrackerProps) => {
  const [activeSession, setActiveSession] = useState<TimeTrackingSession | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [description, setDescription] = useState("");
  const [hourlyRate, setHourlyRate] = useState<number>(50);
  const [billable, setBillable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadActiveSession();
    loadProjects();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeSession) {
      interval = setInterval(() => {
        const start = new Date(activeSession.start_time);
        const now = new Date();
        setElapsedTime(Math.floor((now.getTime() - start.getTime()) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession]);

  const loadActiveSession = async () => {
    const session = await getActiveTimeTrackingSession();
    setActiveSession(session);
    
    if (session) {
      setSelectedProject(session.project_id || "");
      setDescription(session.description || "");
      
      // Calculate elapsed time
      const start = new Date(session.start_time);
      const now = new Date();
      setElapsedTime(Math.floor((now.getTime() - start.getTime()) / 1000));
    }
  };

  const loadProjects = async () => {
    const projectData = await getProjects();
    setProjects(projectData);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    if (!selectedProject) {
      return;
    }

    setIsLoading(true);
    const session = await startTimeTracking({
      project_id: selectedProject,
      task_id: null,
      description
    });

    if (session) {
      setActiveSession(session);
      setElapsedTime(0);
    }
    setIsLoading(false);
  };

  const handleStop = async () => {
    if (!activeSession) return;

    setIsLoading(true);
    const timeEntry = await stopTimeTracking(activeSession.id, {
      description,
      hourly_rate: hourlyRate,
      billable
    });

    if (timeEntry) {
      setActiveSession(null);
      setElapsedTime(0);
      setDescription("");
      onTimeEntrySaved?.();
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Time Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-primary mb-2">
            {formatTime(elapsedTime)}
          </div>
          <div className="text-sm text-muted-foreground">
            {activeSession ? "Currently tracking" : "Not tracking"}
          </div>
        </div>

        {/* Project Selection */}
        <div className="space-y-2">
          <Label htmlFor="project">Project</Label>
          <Select
            value={selectedProject}
            onValueChange={setSelectedProject}
            disabled={!!activeSession}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="What are you working on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!!activeSession}
            rows={2}
          />
        </div>

        {!activeSession && (
          <>
            {/* Hourly Rate */}
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>

            {/* Billable Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="billable"
                checked={billable}
                onCheckedChange={setBillable}
              />
              <Label htmlFor="billable">Billable</Label>
            </div>
          </>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-2">
          {!activeSession ? (
            <Button
              onClick={handleStart}
              disabled={!selectedProject || isLoading}
              className="flex items-center gap-2 px-8"
              size="lg"
            >
              <Play className="h-4 w-4" />
              Start
            </Button>
          ) : (
            <Button
              onClick={handleStop}
              disabled={isLoading}
              variant="destructive"
              className="flex items-center gap-2 px-8"
              size="lg"
            >
              <Square className="h-4 w-4" />
              Stop
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeTracker;