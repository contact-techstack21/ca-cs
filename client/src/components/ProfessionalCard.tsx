import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, MessageCircle } from 'lucide-react';
import BookingModal from './BookingModal';
import { useState } from 'react';

interface ProfessionalCardProps {
  professional: any;
}

export default function ProfessionalCard({ professional }: ProfessionalCardProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);

  const rating = professional.rating ? (professional.rating / 10).toFixed(1) : '0.0';
  
  return (
    <>
      <Card className="professional-card border border-slate-200 hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg">
                {professional.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'P'}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {professional.qualification} {professional.user?.name || 'Professional'}
              </h3>
              <p className="text-sm text-slate-600">{professional.experience}+ years experience</p>
              <div className="flex items-center mt-1">
                <div className="flex rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-slate-600 ml-2">
                  {rating} ({professional.totalReviews || 0} reviews)
                </span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-900 mb-2">Specializations:</h4>
            <div className="flex flex-wrap gap-2">
              {professional.specializations?.slice(0, 3).map((spec: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-600">Starting from</p>
              <p className="text-lg font-semibold text-slate-900">
                ₹{professional.hourlyRate?.toLocaleString() || '2,000'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-600">Next available</p>
              <p className="text-sm font-medium text-slate-900">Today, 4 PM</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              className="flex-1 btn-primary" 
              onClick={() => setShowBookingModal(true)}
            >
              Book Consultation
            </Button>
            <Button variant="outline" size="icon">
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <BookingModal 
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        professional={professional}
      />
    </>
  );
}
