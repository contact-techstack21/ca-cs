import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProfessionalCard from '@/components/ProfessionalCard';
import { Search } from 'lucide-react';

export default function ServiceDiscovery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const { data: professionals = [], isLoading } = useQuery({
    queryKey: ['/api/professionals', selectedSpecialization, selectedCity],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedSpecialization && selectedSpecialization !== 'all') {
        params.append('specialization', selectedSpecialization);
      }
      if (selectedCity && selectedCity !== 'all') {
        params.append('city', selectedCity);
      }
      
      const response = await fetch(`/api/professionals?${params}`);
      if (!response.ok) throw new Error('Failed to fetch professionals');
      return response.json();
    }
  });

  const filteredProfessionals = professionals.filter((prof: any) => {
    if (!searchTerm) return true;
    return (
      prof.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.specializations?.some((spec: string) => 
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Find the Right Professional</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Connect with verified CA and CS professionals specializing in your compliance needs
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search for services or professionals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Specializations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specializations</SelectItem>
                    <SelectItem value="Tax Planning">Tax Planning</SelectItem>
                    <SelectItem value="GST Returns">GST Returns</SelectItem>
                    <SelectItem value="Company Law">Company Law</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="ROC Filing">ROC Filing</SelectItem>
                    <SelectItem value="Audit">Audit</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button className="btn-primary">
                  Search
                </Button>
              </div>
            </div>
          </Card>

          {/* Professional Listings */}
          {filteredProfessionals.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No professionals found</h3>
              <p className="text-slate-600">Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfessionals.map((professional: any) => (
                <ProfessionalCard 
                  key={professional.id} 
                  professional={professional} 
                />
              ))}
            </div>
          )}

          {/* Show result count */}
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Showing {filteredProfessionals.length} of {professionals.length} professionals
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
