import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  UserCheck, 
  Handshake, 
  DollarSign,
  Download,
  AlertTriangle,
  Eye,
  Check,
  X
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: professionals = [], isLoading: professionalsLoading } = useQuery({
    queryKey: ['/api/professionals'],
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['/api/bookings'],
    queryFn: async () => {
      // Mock fetch all bookings for admin
      const response = await fetch('/api/professionals');
      if (!response.ok) throw new Error('Failed to fetch data');
      return []; // In real app, would fetch all bookings
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalUsers = 2847; // Mock data
  const verifiedProfessionals = professionals.filter((p: any) => p.kycStatus === 'approved').length;
  const totalBookings = 1523; // Mock data
  const platformRevenue = 1240000; // Mock data in paisa

  const pendingVerifications = professionals.filter((p: any) => p.kycStatus === 'pending');

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Verified Professionals',
      value: verifiedProfessionals,
      icon: UserCheck,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Total Bookings',
      value: totalBookings.toLocaleString(),
      icon: Handshake,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Platform Revenue',
      value: `₹${(platformRevenue / 100000).toFixed(1)}L`,
      icon: DollarSign,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  const systemHealth = [
    { name: 'Database', status: 'healthy' },
    { name: 'API Status', status: 'active' },
    { name: 'Payments', status: 'warning' },
  ];

  const handleApprove = async (professionalId: string) => {
    try {
      await fetch(`/api/professionals/${professionalId}/kyc`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      // In real app, would invalidate queries and show toast
      console.log('Professional approved');
    } catch (error) {
      console.error('Error approving professional:', error);
    }
  };

  const handleReject = async (professionalId: string) => {
    try {
      await fetch(`/api/professionals/${professionalId}/kyc`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      // In real app, would invalidate queries and show toast
      console.log('Professional rejected');
    } catch (error) {
      console.error('Error rejecting professional:', error);
    }
  };

  if (professionalsLoading || bookingsLoading) {
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
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600">Platform management and oversight</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="destructive">
            <AlertTriangle className="w-4 h-4 mr-2" />
            System Alerts
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
        {/* Pending Verifications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Pending KYC Verifications</CardTitle>
                <Badge className="status-pending">
                  {pendingVerifications.length} Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {pendingVerifications.length === 0 ? (
                <div className="text-center py-8">
                  <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No pending verifications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingVerifications.slice(0, 3).map((professional: any) => (
                    <div key={professional.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg slide-in">
                      <div className="flex items-center">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {professional.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <h4 className="font-medium text-slate-900">
                            {professional.qualification} {professional.user?.name || 'Professional'}
                          </h4>
                          <p className="text-sm text-slate-600">
                            Submitted {new Date().toLocaleDateString()} • {professional.qualification} Certificate
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-100 text-green-800 hover:bg-green-200"
                          onClick={() => handleApprove(professional.id)}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-red-300 text-red-800 hover:bg-red-50"
                          onClick={() => handleReject(professional.id)}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
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
          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemHealth.map((system, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{system.name}</span>
                    <Badge className={getStatusColor(system.status)}>
                      {system.status}
                    </Badge>
                  </div>
                ))}
              </div>
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
                  <Users className="w-4 h-4 mr-3 text-primary" />
                  <span className="text-sm text-slate-700">Manage Users</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Handshake className="w-4 h-4 mr-3 text-secondary" />
                  <span className="text-sm text-slate-700">View Analytics</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <AlertTriangle className="w-4 h-4 mr-3 text-yellow-600" />
                  <span className="text-sm text-slate-700">Send Notifications</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-3 text-slate-600" />
                  <span className="text-sm text-slate-700">Platform Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
