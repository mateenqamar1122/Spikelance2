
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, DollarSign, TrendingUp, Plus, Edit2, Trash2 } from "lucide-react";

interface TimeGoalsProps {
  analytics: any;
}

const TimeGoals = ({ analytics }: TimeGoalsProps) => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Weekly Hours",
      target: 40,
      current: analytics?.totalHours || 0,
      unit: "hours",
      type: "time",
      deadline: "Weekly"
    },
    {
      id: 2,
      title: "Monthly Revenue",
      target: 5000,
      current: analytics?.totalRevenue || 0,
      unit: "USD",
      type: "revenue",
      deadline: "Monthly"
    },
    {
      id: 3,
      title: "Billable Hours Ratio",
      target: 80,
      current: analytics?.totalHours > 0 ? Math.round((analytics.billableHours / analytics.totalHours) * 100) : 0,
      unit: "%",
      type: "efficiency",
      deadline: "Ongoing"
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    title: "",
    target: 0,
    unit: "hours",
    type: "time",
    deadline: "Weekly"
  });

  const [isAddingGoal, setIsAddingGoal] = useState(false);

  const addGoal = () => {
    if (newGoal.title && newGoal.target > 0) {
      setGoals([...goals, {
        id: Date.now(),
        ...newGoal,
        current: 0
      }]);
      setNewGoal({ title: "", target: 0, unit: "hours", type: "time", deadline: "Weekly" });
      setIsAddingGoal(false);
    }
  };

  const deleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case "time": return <Clock className="h-5 w-5" />;
      case "revenue": return <DollarSign className="h-5 w-5" />;
      case "efficiency": return <TrendingUp className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Time Goals & Targets
          </h2>
          <p className="text-muted-foreground">Set and track your productivity goals</p>
        </div>
        <Button 
          onClick={() => setIsAddingGoal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const percentage = Math.min(100, (goal.current / goal.target) * 100);
          return (
            <Card key={goal.id} className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${goal.type === 'time' ? 'bg-blue-500/10 text-blue-600' : goal.type === 'revenue' ? 'bg-green-500/10 text-green-600' : 'bg-purple-500/10 text-purple-600'}`}>
                      {getGoalIcon(goal.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{goal.title}</CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {goal.deadline}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={percentage} className="h-3" />
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {goal.unit === "USD" ? `$${goal.current.toLocaleString()}` : 
                       goal.unit === "%" ? `${goal.current}%` : 
                       `${goal.current.toFixed(1)}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      of {goal.unit === "USD" ? `$${goal.target.toLocaleString()}` : 
                          goal.unit === "%" ? `${goal.target}%` : 
                          `${goal.target}`} {goal.unit !== "USD" && goal.unit !== "%" ? goal.unit : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      className={`${getProgressColor(percentage)} text-white`}
                    >
                      {percentage >= 100 ? "Achieved" : 
                       percentage >= 75 ? "On Track" : 
                       percentage >= 50 ? "Behind" : "Critical"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add New Goal Form */}
      {isAddingGoal && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Add New Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Goal Title</Label>
                <Input
                  placeholder="e.g., Daily Coding Hours"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Value</Label>
                <Input
                  type="number"
                  placeholder="e.g., 8"
                  value={newGoal.target || ""}
                  onChange={(e) => setNewGoal({ ...newGoal, target: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                >
                  <option value="hours">Hours</option>
                  <option value="USD">USD</option>
                  <option value="%">Percentage</option>
                  <option value="projects">Projects</option>
                  <option value="tasks">Tasks</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Ongoing">Ongoing</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={addGoal} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Add Goal
              </Button>
              <Button variant="outline" onClick={() => setIsAddingGoal(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals Summary */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-lg">Goals Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-900">
                {goals.filter(g => g.current >= g.target).length}
              </p>
              <p className="text-sm text-blue-700">Achieved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-900">
                {goals.filter(g => g.current >= g.target * 0.75 && g.current < g.target).length}
              </p>
              <p className="text-sm text-green-700">On Track</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-900">
                {goals.filter(g => g.current >= g.target * 0.5 && g.current < g.target * 0.75).length}
              </p>
              <p className="text-sm text-yellow-700">Behind</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-900">
                {goals.filter(g => g.current < g.target * 0.5).length}
              </p>
              <p className="text-sm text-red-700">Critical</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeGoals;