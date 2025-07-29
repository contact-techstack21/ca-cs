import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, Download, Trash2, Eye, Lock, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  const { toast } = useToast();
  
  // Privacy settings state
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    contactInfoSharing: true,
    communicationHistory: false,
    documentRetention: '90',
    documentEncryption: true,
    downloadPrevention: true,
    emailNotifications: true,
    smsNotifications: false,
    marketingCommunications: false,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    toast({
      title: "Settings Saved",
      description: "Your privacy preferences have been updated.",
    });
    onClose();
  };

  const handleDataExport = () => {
    toast({
      title: "Export Requested",
      description: "Your data export will be available for download within 24 hours.",
    });
  };

  const handleAccountDeletion = () => {
    toast({
      title: "Account Deletion",
      description: "Please contact support to proceed with account deletion.",
      variant: "destructive",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>Privacy & Data Controls</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Data Access Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Data Access & Sharing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">Profile Visibility</p>
                  <p className="text-xs text-slate-600">Control who can see your profile information</p>
                </div>
                <Select
                  value={settings.profileVisibility}
                  onValueChange={(value) => handleSettingChange('profileVisibility', value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="verified">Verified Professionals Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">Contact Information</p>
                  <p className="text-xs text-slate-600">Share contact details with matched professionals</p>
                </div>
                <Switch
                  checked={settings.contactInfoSharing}
                  onCheckedChange={(checked) => handleSettingChange('contactInfoSharing', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">Communication History</p>
                  <p className="text-xs text-slate-600">Allow professionals to view past interaction history</p>
                </div>
                <Switch
                  checked={settings.communicationHistory}
                  onCheckedChange={(checked) => handleSettingChange('communicationHistory', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Document Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Document Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">Automatic Document Deletion</p>
                  <p className="text-xs text-slate-600">Delete documents after project completion</p>
                </div>
                <Select
                  value={settings.documentRetention}
                  onValueChange={(value) => handleSettingChange('documentRetention', value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="manual">Manual deletion only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">Document Encryption</p>
                  <p className="text-xs text-slate-600">End-to-end encryption for sensitive documents</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.documentEncryption}
                    onCheckedChange={(checked) => handleSettingChange('documentEncryption', checked)}
                    disabled
                  />
                  <Badge variant="secondary" className="text-xs">Required</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">Download Prevention</p>
                  <p className="text-xs text-slate-600">Prevent professionals from downloading your documents</p>
                </div>
                <Switch
                  checked={settings.downloadPrevention}
                  onCheckedChange={(checked) => handleSettingChange('downloadPrevention', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span>Notification Privacy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">Email Notifications</p>
                  <p className="text-xs text-slate-600">Receive updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">SMS Notifications</p>
                  <p className="text-xs text-slate-600">Receive important updates via SMS</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">Marketing Communications</p>
                  <p className="text-xs text-slate-600">Receive promotional offers and updates</p>
                </div>
                <Switch
                  checked={settings.marketingCommunications}
                  onCheckedChange={(checked) => handleSettingChange('marketingCommunications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Data Rights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">Data Export</p>
                  <p className="text-xs text-slate-600">Download all your data in a portable format</p>
                </div>
                <Button
                  onClick={handleDataExport}
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <Download className="w-3 h-3 mr-2" />
                  Request Export
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">Account Deletion</p>
                  <p className="text-xs text-slate-600">Permanently delete your account and all data</p>
                </div>
                <Button
                  onClick={handleAccountDeletion}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">Your Data is Protected</p>
                <p className="text-xs text-blue-700">
                  ComplianceConnect uses industry-standard encryption and security measures to protect your personal and business data. 
                  All data processing complies with applicable privacy regulations including GDPR and the Indian IT Act.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="btn-primary">
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
