import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Plus,
  MessageCircle
} from 'lucide-react';

export default function BusinessDashboard() {
  const { user } = useAuth();

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['/api/bookings/business', user?.id],
    enabled: !!user?.id,
  });

  const { data: requirements = [], isLoading: requirementsLoading } = useQuery({
    queryKey: ['/api/requirements/business', user?.id],
    enabled: !!user?.id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'completed':
        return 'status-completed';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    {
      title: 'Active Requirements',
      value: requirements.filter((r: any) => r.status === 'open').length,
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Scheduled Meetings',
      value: bookings.filter((b: any) => b.status === 'confirmed').length,
      icon: Calendar,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Pending Tasks',
      value: bookings.filter((b: any) => b.status === 'pending').length,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Completed',
      value: bookings.filter((b: any) => b.status === 'completed').length,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
    },
  ];

  if (bookingsLoading || requirementsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Business Dashboard</h1>
          <p className="text-slate-600">Manage your compliance requirements and bookings</p>
        </div>
        <Button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Post New Requirement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Requirements */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              {requirements.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No requirements posted yet</p>
                  <Button className="mt-4 btn-primary" size="sm">
                    Post Your First Requirement
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {requirements.slice(0, 3).map((req: any) => (
                    <div key={req.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg slide-in">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium text-slate-900">{req.title}</h4>
                          <p className="text-sm text-slate-600">
                            Posted {new Date(req.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(req.status)}>
                          {req.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Meetings */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.filter((b: any) => b.status === 'confirmed').length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No upcoming meetings</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings
                    .filter((b: any) => b.status === 'confirmed')
                    .slice(0, 3)
                    .map((booking: any) => (
                      <div key={booking.id} className="flex items-center slide-in">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {booking.professional?.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-slate-900">
                            {booking.professional?.user?.name || 'Professional'}
                          </p>
                          <p className="text-xs text-slate-600">
                            {new Date(booking.scheduledAt).toLocaleDateString()} • {new Date(booking.scheduledAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
