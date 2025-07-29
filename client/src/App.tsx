import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import BusinessDashboard from "@/pages/BusinessDashboard";
import ProfessionalDashboard from "@/pages/ProfessionalDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import ServiceDiscovery from "@/pages/ServiceDiscovery";
import MessagingInterface from "@/components/MessagingInterface";
import PrivacyModal from "@/components/PrivacyModal";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/services" component={ServiceDiscovery} />
      
      {/* Protected Routes */}
      <Route path="/dashboard/business">
        <ProtectedRoute requiredRole="business">
          <BusinessDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/professional">
        <ProtectedRoute requiredRole="professional">
          <ProfessionalDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard/admin">
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showMessaging, setShowMessaging] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Router />
            <Toaster />
            
            {/* Floating Action Buttons */}
            <div className="fixed bottom-4 left-4 space-y-3 z-40">
              <button 
                onClick={() => setShowMessaging(true)}
                className="floating-action w-12 h-12 bg-secondary text-white rounded-full hover:bg-green-700 transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button 
                onClick={() => setShowPrivacyModal(true)}
                className="floating-action w-12 h-12 bg-slate-600 text-white rounded-full hover:bg-slate-700 transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </button>
            </div>

            {/* Messaging Interface */}
            <MessagingInterface 
              isOpen={showMessaging} 
              onClose={() => setShowMessaging(false)} 
            />

            {/* Privacy Modal */}
            <PrivacyModal 
              isOpen={showPrivacyModal} 
              onClose={() => setShowPrivacyModal(false)} 
            />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
