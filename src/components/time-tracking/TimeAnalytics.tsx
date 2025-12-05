
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Clock, DollarSign, TrendingUp, Users } from "lucide-react";

interface TimeAnalyticsProps {
  analytics: {
    totalHours: number;
    billableHours: number;
    totalRevenue: number;
    billedRevenue: number;
    unbilledRevenue: number;
    projectBreakdown: Array<{
      name: string;
      hours: number;
      billableHours: number;
      revenue: number;
    }>;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const TimeAnalytics = ({ analytics }: TimeAnalyticsProps) => {
  const billablePercentage = analytics.totalHours > 0 
    ? (analytics.billableHours / analytics.totalHours) * 100 
    : 0;

  const chartData = analytics.projectBreakdown.map(project => ({
    name: project.name,
    hours: project.hours,
    revenue: project.revenue
  }));

  const pieData = analytics.projectBreakdown.map((project, index) => ({
    name: project.name,
    value: project.hours,
    fill: COLORS[index % COLORS.length]
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{analytics.totalHours.toFixed(1)}h</p>
                <p className="text-sm text-muted-foreground">Total Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{analytics.billableHours.toFixed(1)}h</p>
                <p className="text-sm text-muted-foreground">Billable Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">${analytics.unbilledRevenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Unbilled Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billable Percentage */}
      <Card>
        <CardHeader>
          <CardTitle>Billable Hours Ratio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Billable: {analytics.billableHours.toFixed(1)}h</span>
              <span>Total: {analytics.totalHours.toFixed(1)}h</span>
            </div>
            <Progress value={billablePercentage} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">
              {billablePercentage.toFixed(1)}% billable
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Project Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hours by Project Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Hours by Project</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hours Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Project Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Project Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.projectBreakdown.map((project, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{project.name}</h4>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {project.hours.toFixed(1)}h total
                    </Badge>
                    <Badge variant="outline">
                      {project.billableHours.toFixed(1)}h billable
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Revenue: ${project.revenue.toFixed(2)}
                  </span>
                  <span>
                    Billable: {project.hours > 0 ? ((project.billableHours / project.hours) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeAnalytics;