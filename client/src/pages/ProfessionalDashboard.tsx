import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DollarSign, 
  Users, 
  Star, 
  CheckSquare,
  Calendar,
  Plus,
  MessageCircle,
  Upload
} from 'lucide-react';

export default function ProfessionalDashboard() {
  const { user } = useAuth();

  const { data: professional } = useQuery({
    queryKey: ['/api/professionals/user', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/professionals?userId=${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch professional data');
      const professionals = await response.json();
      return professionals.find((p: any) => p.userId === user?.id);
    }
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['/api/bookings/professional', professional?.id],
    enabled: !!professional?.id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'completed':
        return 'status-completed';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const monthlyEarnings = bookings
    .filter((b: any) => b.status === 'completed' && b.paymentStatus === 'paid')
    .reduce((total: number, booking: any) => total + booking.totalAmount, 0);

  const activeClients = new Set(bookings.filter((b: any) => b.status !== 'cancelled').map((b: any) => b.businessId)).size;

  const stats = [
    {
      title: 'Monthly Earnings',
      value: `₹${(monthlyEarnings / 100).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Active Clients',
      value: activeClients,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Rating',
      value: professional?.rating ? `${(professional.rating / 10).toFixed(1)}/5` : '0.0/5',
      icon: Star,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Tasks Completed',
      value: bookings.filter((b: any) => b.status === 'completed').length,
      icon: CheckSquare,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const kycDocuments = [
    { name: 'PAN Card', status: 'verified' },
    { name: 'Aadhaar', status: 'verified' },
    { name: `${professional?.qualification} Certificate`, status: professional?.kycStatus || 'pending' },
  ];

  if (bookingsLoading) {
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
          <h1 className="text-3xl font-bold text-slate-900">Professional Dashboard</h1>
          <p className="text-slate-600">Manage your services, bookings, and client communications</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Manage Calendar
          </Button>
          <Button className="btn-secondary">
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>
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
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No bookings yet</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Complete your profile to start receiving bookings
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg slide-in">
                      <div className="flex items-center">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {booking.businessUser?.name?.split(' ').map((n: string) => n[0]).join('') || 'B'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <h4 className="font-medium text-slate-900">
                            {booking.businessUser?.name || 'Business Client'} - {booking.service?.title}
                          </h4>
                          <p className="text-sm text-slate-600">
                            {new Date(booking.scheduledAt).toLocaleDateString()} • ₹{(booking.totalAmount / 100).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* KYC Status */}
          <Card>
            <CardHeader>
              <CardTitle>KYC Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {kycDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{doc.name}</span>
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 btn-primary" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-3 text-primary" />
                  <span className="text-sm text-slate-700">Set Availability</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-3 text-secondary" />
                  <span className="text-sm text-slate-700">View Earnings</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-3 text-yellow-600" />
                  <span className="text-sm text-slate-700">Client Reviews</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
