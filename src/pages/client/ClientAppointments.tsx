import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, Video } from "lucide-react";

interface Appointment {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  meeting_link?: string;
}

const ClientAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    // This is a mock function since we don't have the actual appointments table yet
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, you would fetch from the database
        // For now, we'll use mock data
        const mockAppointments: Appointment[] = [
          {
            id: "1",
            title: "Project Kickoff Meeting",
            description: "Initial discussion about project scope and timeline",
            start_time: "2023-06-15T14:00:00Z",
            end_time: "2023-06-15T15:00:00Z",
            status: "scheduled",
            meeting_link: "https://meet.google.com/abc-defg-hij"
          },
          {
            id: "2",
            title: "Design Review",
            description: "Review the initial design concepts",
            start_time: "2023-06-20T10:00:00Z",
            end_time: "2023-06-20T11:00:00Z",
            status: "scheduled"
          },
          {
            id: "3",
            title: "Progress Update",
            description: "Weekly progress update and feedback session",
            start_time: "2023-06-10T16:00:00Z",
            end_time: "2023-06-10T16:30:00Z",
            status: "completed"
          }
        ];

        setAppointments(mockAppointments);
      } catch (error: any) {
        toast.error(`Failed to load appointments: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatAppointmentTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const isAppointmentOnSelectedDate = (appointment: Appointment) => {
    if (!date) return false;

    const appointmentDate = new Date(appointment.start_time);
    return (
      appointmentDate.getDate() === date.getDate() &&
      appointmentDate.getMonth() === date.getMonth() &&
      appointmentDate.getFullYear() === date.getFullYear()
    );
  };

  const filteredAppointments = appointments.filter(isAppointmentOnSelectedDate);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">
          View and manage your scheduled meetings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {date ? formatAppointmentDate(date.toISOString()) : "No date selected"}
            </CardTitle>
            <CardDescription>
              {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No appointments for this date</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{appointment.title}</h3>
                          <p className="text-sm text-muted-foreground">{appointment.description}</p>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="flex items-center mt-2 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {formatAppointmentTime(appointment.start_time)} - {formatAppointmentTime(appointment.end_time)}
                        </span>
                      </div>
                      {appointment.meeting_link && (
                        <div className="flex items-center">
                          <Video className="h-4 w-4 mr-1" />
                          <a
                            href={appointment.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Join Meeting
                          </a>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        {appointment.status === 'scheduled' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Handle rescheduling logic
                                toast.info('Rescheduling feature coming soon');
                              }}
                            >
                              Reschedule
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => {
                                // Handle cancellation logic
                                toast.info('Cancellation feature coming soon');
                              }}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {appointment.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Handle view details logic
                              toast.info('Meeting details feature coming soon');
                            }}
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal dialog */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>View or modify appointment details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{selectedAppointment.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatAppointmentTime(selectedAppointment.start_time)} - {formatAppointmentTime(selectedAppointment.end_time)}
                  </span>
                </div>
                {selectedAppointment.meeting_link && (
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <a
                      href={selectedAppointment.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Join Meeting
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
            <div className="flex justify-end gap-2 p-6 pt-0">
              <Button
                variant="outline"
                onClick={() => setSelectedAppointment(null)}
              >
                Close
              </Button>
              {selectedAppointment.status === 'scheduled' && (
                <Button
                  variant="default"
                  onClick={() => {
                    // Handle edit logic
                    toast.info('Edit feature coming soon');
                  }}
                >
                  Edit
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClientAppointments;