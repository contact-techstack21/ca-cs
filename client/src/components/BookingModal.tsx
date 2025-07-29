import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: any;
}

export default function BookingModal({ isOpen, onClose, professional }: BookingModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedService, setSelectedService] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');

  const serviceFee = professional.hourlyRate || 2000;
  const platformFee = 100;
  const gst = Math.round((serviceFee + platformFee) * 0.18);
  const totalAmount = serviceFee + platformFee + gst;

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return apiRequest('POST', '/api/bookings', bookingData);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your booking has been confirmed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleBooking = () => {
    if (!selectedService || !selectedSlot) {
      toast({
        title: "Missing Information",
        description: "Please select a service and time slot.",
        variant: "destructive",
      });
      return;
    }

    // Create mock service ID and scheduled time
    const mockServiceId = 'service-1';
    const scheduledAt = new Date();
    scheduledAt.setDate(scheduledAt.getDate() + 1); // Tomorrow

    bookingMutation.mutate({
      businessId: user?.id,
      professionalId: professional.id,
      serviceId: mockServiceId,
      scheduledAt: scheduledAt.toISOString(),
      totalAmount: totalAmount * 100, // Convert to paisa
      notes,
    });
  };

  const timeSlots = [
    { time: 'Today, 4:00 PM', available: true },
    { time: 'Today, 6:00 PM', available: true },
    { time: 'Tomorrow, 10:00 AM', available: true },
    { time: 'Tomorrow, 2:00 PM', available: false },
  ];

  const services = [
    'Tax Planning Consultation',
    'GST Return Filing',
    'Financial Advisory',
    'Audit & Assurance',
    'Company Registration',
    'Legal Compliance Review',
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Consultation</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Professional Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-lg">
                  {professional.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'P'}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-slate-900">
                  {professional.qualification} {professional.user?.name || 'Professional'}
                </h4>
                <p className="text-sm text-slate-600">
                  {professional.specializations?.[0] || 'Professional Services'}
                </p>
                <div className="flex items-center mt-1">
                  <div className="flex rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-600 ml-2">
                    {professional.rating ? (professional.rating / 10).toFixed(1) : '4.9'} ({professional.totalReviews || 127} reviews)
                  </span>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <h5 className="font-medium text-slate-900 mb-2">Service Details</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Consultation Fee</span>
                    <span className="font-medium">₹{serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Platform Fee</span>
                    <span className="font-medium">₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">GST (18%)</span>
                    <span className="font-medium">₹{gst}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="time-slot">Select Date & Time</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {timeSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={selectedSlot === slot.time ? "default" : "outline"}
                    className={`p-3 h-auto text-xs ${
                      !slot.available ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot.time)}
                  >
                    <div className="text-center">
                      <div>{slot.time.split(', ')[0]}</div>
                      <div className="text-xs opacity-75">{slot.time.split(', ')[1]}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="service">Service Required</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service, index) => (
                    <SelectItem key={index} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your specific requirements..."
                className="mt-2"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleBooking} 
                className="flex-1 btn-primary"
                disabled={bookingMutation.isPending}
              >
                {bookingMutation.isPending ? 'Processing...' : 'Proceed to Payment'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
