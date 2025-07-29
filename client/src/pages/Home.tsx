import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building, UserCheck, Shield } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  const getRoleRoute = (role: string) => {
    switch (role) {
      case 'business':
        return '/dashboard/business';
      case 'professional':
        return '/dashboard/professional';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/register';
    }
  };

  if (user) {
    // Redirect authenticated users to their dashboard
    window.location.href = getRoleRoute(user.role);
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect with Certified <span className="text-blue-300">CA & CS</span> Professionals
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto">
              Streamline your compliance needs with verified Chartered Accountants and Company Secretaries across India
            </p>
            
            {/* Role Selection Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              {/* Business User Card */}
              <Card className="glass-card hover:bg-white/15 transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Building className="text-blue-300 w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Business Owner</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Find and hire certified professionals for your compliance needs
                  </p>
                  <Link href="/register?role=business">
                    <Button className="btn-primary">Start Now</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Professional Card */}
              <Card className="glass-card hover:bg-white/15 transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <UserCheck className="text-green-300 w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">CA/CS Professional</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Showcase your expertise and grow your practice
                  </p>
                  <Link href="/register?role=professional">
                    <Button className="btn-secondary">Join Platform</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Admin Card */}
              <Card className="glass-card hover:bg-white/15 transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Shield className="text-yellow-300 w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Platform Admin</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Manage platform operations and user verification
                  </p>
                  <Link href="/login">
                    <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                      Admin Panel
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose ComplianceConnect?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience seamless compliance management with our trusted platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
              <p className="text-slate-600">All CA and CS professionals are thoroughly verified with proper credentials</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-slate-600">End-to-end encryption and robust security measures protect your data</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-slate-600">Simple booking system with integrated payments and scheduling</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-slate-600 mb-8">
            Join thousands of businesses and professionals already using our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=business">
              <Button size="lg" className="btn-primary">Find Professionals</Button>
            </Link>
            <Link href="/register?role=professional">
              <Button size="lg" variant="outline">Join as Professional</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
