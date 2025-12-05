
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Clock, DollarSign, Calendar, Download } from "lucide-react";
import { format } from "date-fns";
import { TimeEntry, Project } from "@/types/database";
import { deleteTimeEntry } from "@/services/timeTrackingService";

interface TimeEntryListProps {
  entries: TimeEntry[];
  projects: Project[];
  onEntryDeleted?: () => void;
  onEntryEdit?: (entry: TimeEntry) => void;
}

const TimeEntryList = ({ entries, projects, onEntryDeleted, onEntryEdit }: TimeEntryListProps) => {
  const [filter, setFilter] = useState({
    project_id: "",
    billable: ""
  });

  const filteredEntries = entries.filter(entry => {
    if (filter.project_id && entry.project_id !== filter.project_id) return false;
    if (filter.billable && entry.billable.toString() !== filter.billable) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this time entry?")) {
      const success = await deleteTimeEntry(id);
      if (success) {
        onEntryDeleted?.();
      }
    }
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "0h 0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const calculateRevenue = (entry: TimeEntry) => {
    if (!entry.billable || !entry.hourly_rate || !entry.duration_minutes) return 0;
    return (entry.duration_minutes / 60) * entry.hourly_rate;
  };

  const totalHours = filteredEntries.reduce((sum, entry) => sum + (entry.duration_minutes || 0), 0) / 60;
  const totalRevenue = filteredEntries.reduce((sum, entry) => sum + calculateRevenue(entry), 0);
  const billableHours = filteredEntries.filter(entry => entry.billable).reduce((sum, entry) => sum + (entry.duration_minutes || 0), 0) / 60;

  const exportToCSV = () => {
    const headers = ['Date', 'Project', 'Description', 'Duration', 'Billable', 'Rate', 'Revenue'];
    const csvContent = [
      headers.join(','),
      ...filteredEntries.map(entry => [
        format(new Date(entry.start_time), 'yyyy-MM-dd'),
        entry.project?.name || 'No Project',
        entry.description || '',
        formatDuration(entry.duration_minutes),
        entry.billable ? 'Yes' : 'No',
        entry.hourly_rate ? `$${entry.hourly_rate}` : '',
        `$${calculateRevenue(entry).toFixed(2)}`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timesheet-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Timesheet
          </h2>
          <p className="text-muted-foreground">Track and manage your time entries</p>
        </div>
        <Button onClick={exportToCSV} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-800">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Project</Label>
              <Select value={filter.project_id} onValueChange={(value) => setFilter(f => ({ ...f, project_id: value }))}>
                <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue placeholder="All projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Billable</Label>
              <Select value={filter.billable} onValueChange={(value) => setFilter(f => ({ ...f, billable: value }))}>
                <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue placeholder="All entries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All entries</SelectItem>
                  <SelectItem value="true">Billable only</SelectItem>
                  <SelectItem value="false">Non-billable only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{totalHours.toFixed(1)}h</p>
                <p className="text-sm text-blue-700">Total Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">${totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-green-700">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">{billableHours.toFixed(1)}h</p>
                <p className="text-sm text-purple-700">Billable Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entries List */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-800">Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No time entries found</p>
                <p className="text-gray-400 text-sm">Start tracking time to see entries here</p>
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <Card key={entry.id} className="border border-gray-100 hover:border-gray-200 transition-colors bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="font-semibold text-gray-900">
                            {entry.project?.name || "No Project"}
                          </h4>
                          <Badge 
                            variant={entry.billable ? "default" : "secondary"}
                            className={entry.billable ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}
                          >
                            {entry.billable ? "Billable" : "Non-billable"}
                          </Badge>
                          {entry.billed && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Billed
                            </Badge>
                          )}
                        </div>
                        {entry.description && (
                          <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                            {entry.description}
                          </p>
                        )}
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(entry.start_time), "MMM d, yyyy")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {format(new Date(entry.start_time), "h:mm a")} - 
                            {entry.end_time ? format(new Date(entry.end_time), "h:mm a") : "Active"}
                          </span>
                          <span className="font-medium text-gray-700">
                            {formatDuration(entry.duration_minutes)}
                          </span>
                          {entry.billable && entry.hourly_rate && (
                            <span className="flex items-center gap-1 text-green-600">
                              <DollarSign className="h-4 w-4" />
                              ${calculateRevenue(entry).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEntryEdit?.(entry)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeEntryList;