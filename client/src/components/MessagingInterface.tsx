import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { X, Send, Paperclip } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface MessagingInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MessagingInterface({ isOpen, onClose }: MessagingInterfaceProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get user's bookings to show available conversations
  const { data: bookings = [] } = useQuery({
    queryKey: ['/api/bookings', user?.role, user?.id],
    queryFn: async () => {
      if (!user) return [];
      const endpoint = user.role === 'business' 
        ? `/api/bookings/business/${user.id}`
        : `/api/bookings/professional/${user.id}`;
      
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    },
    enabled: !!user && isOpen,
  });

  // Get messages for selected booking
  const { data: messages = [] } = useQuery({
    queryKey: ['/api/messages/booking', selectedBooking?.id],
    enabled: !!selectedBooking?.id,
    refetchInterval: 3000, // Poll for new messages every 3 seconds
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: any) => {
      return apiRequest('POST', '/api/messages', messageData);
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['/api/messages/booking', selectedBooking?.id] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedBooking) return;

    sendMessageMutation.mutate({
      bookingId: selectedBooking.id,
      senderId: user?.id,
      content: newMessage.trim(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Select first booking by default
  useEffect(() => {
    if (bookings.length > 0 && !selectedBooking) {
      setSelectedBooking(bookings[0]);
    }
  }, [bookings, selectedBooking]);

  if (!isOpen) return null;

  const getOtherParty = (booking: any) => {
    if (user?.role === 'business') {
      return {
        name: booking.professional?.user?.name || 'Professional',
        role: booking.professional?.qualification || 'Professional',
        avatar: booking.professional?.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'P'
      };
    } else {
      return {
        name: booking.businessUser?.name || 'Business Client',
        role: 'Business',
        avatar: booking.businessUser?.name?.split(' ').map((n: string) => n[0]).join('') || 'B'
      };
    }
  };

  const otherParty = selectedBooking ? getOtherParty(selectedBooking) : null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-xl shadow-xl border border-slate-200 z-50 flex flex-col">
      {/* Header */}
      <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-3">
          {otherParty && (
            <>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-sm">
                  {otherParty.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-sm font-medium text-slate-900">{otherParty.name}</h4>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs online-indicator">
                    Online
                  </Badge>
                </div>
              </div>
            </>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      {/* Conversation List (if multiple bookings) */}
      {bookings.length > 1 && (
        <div className="p-2 border-b border-slate-200 bg-slate-50">
          <div className="flex space-x-2 overflow-x-auto">
            {bookings.slice(0, 3).map((booking: any) => {
              const party = getOtherParty(booking);
              return (
                <Button
                  key={booking.id}
                  variant={selectedBooking?.id === booking.id ? "default" : "ghost"}
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <Avatar className="w-5 h-5 mr-2">
                    <AvatarFallback className="text-xs">
                      {party.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs truncate max-w-[80px]">{party.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Send className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600">No messages yet</p>
            <p className="text-xs text-slate-500 mt-1">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message: any) => {
            const isOwn = message.senderId === user?.id;
            return (
              <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-start max-w-[80%]">
                  {!isOwn && otherParty && (
                    <Avatar className="w-6 h-6 mr-2 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {otherParty.avatar}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg p-3 ${
                    isOwn 
                      ? 'message-sent ml-2' 
                      : 'message-received'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      isOwn ? 'text-blue-200' : 'text-slate-500'
                    }`}>
                      {new Date(message.sentAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  {isOwn && (
                    <Avatar className="w-6 h-6 ml-2 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
              disabled={sendMessageMutation.isPending}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <Paperclip className="w-3 h-3 text-slate-400" />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
            className="btn-primary p-2"
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
