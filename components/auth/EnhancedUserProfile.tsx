import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Heart, 
  Phone, 
  CreditCard,
  Edit2,
  Save,
  X,
  Camera,
  Bell,
  Lock,
  UserCircle2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import type { UserProfile, ProfileSettings } from '../../types';

const profileSections: ProfileSettings[] = [
  { section: 'personal', title: 'Personal Information', icon: User },
  { section: 'medical', title: 'Medical Information', icon: Heart },
  { section: 'emergency', title: 'Emergency Contact', icon: Phone },
  { section: 'preferences', title: 'Preferences & Privacy', icon: Settings },
  { section: 'subscription', title: 'Subscription & Billing', icon: CreditCard },
];

export const EnhancedUserProfile: React.FC = () => {
  const { signOut } = useAuth();
  const { profile, isProfileLoading, updateProfile } = useProfile();
  
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  React.useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;

    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
      setAvatarPreview(null);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditing(false);
    setAvatarPreview(null);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        // TODO: Upload to storage and update formData.avatar_url
      };
      reader.readAsDataURL(file);
    }
  };

  const updateFormField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...((prev as any)[parent] || {}),
        [field]: value
      }
    }));
  };

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Unable to load profile</p>
      </div>
    );
  }

  const renderPersonalSection = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {avatarPreview || formData.avatar_url ? (
              <img
                src={avatarPreview || formData.avatar_url!}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle2 className="w-12 h-12 text-gray-400" />
            )}
          </div>
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 cursor-pointer hover:bg-blue-700">
              <Camera className="w-3 h-3 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                aria-label="Upload profile picture"
              />
            </label>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{formData.full_name || 'Add your name'}</h3>
          <p className="text-gray-600">{formData.email}</p>
        </div>
      </div>

      {/* Personal Information Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.full_name || ''}
              onChange={(e) => updateFormField('full_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          ) : (
            <p className="text-gray-900">{formData.full_name || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          {isEditing ? (
            <input
              type="tel"
              value={formData.phone_number || ''}
              onChange={(e) => updateFormField('phone_number', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1 (555) 123-4567"
            />
          ) : (
            <p className="text-gray-900">{formData.phone_number || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          {isEditing ? (
            <input
              type="date"
              value={formData.date_of_birth || ''}
              onChange={(e) => updateFormField('date_of_birth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              aria-label="Date of birth"
            />
          ) : (
            <p className="text-gray-900">
              {formData.date_of_birth 
                ? new Date(formData.date_of_birth).toLocaleDateString()
                : 'Not set'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          {isEditing ? (
            <select
              value={formData.gender || ''}
              onChange={(e) => updateFormField('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              aria-label="Select gender"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          ) : (
            <p className="text-gray-900 capitalize">
              {formData.gender?.replace('_', ' ') || 'Not set'}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderMedicalSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
          {isEditing ? (
            <input
              type="number"
              value={formData.medical_info?.height || ''}
              onChange={(e) => updateNestedField('medical_info', 'height', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="175"
            />
          ) : (
            <p className="text-gray-900">
              {formData.medical_info?.height ? `${formData.medical_info.height} cm` : 'Not set'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          {isEditing ? (
            <input
              type="number"
              value={formData.medical_info?.weight || ''}
              onChange={(e) => updateNestedField('medical_info', 'weight', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="70"
            />
          ) : (
            <p className="text-gray-900">
              {formData.medical_info?.weight ? `${formData.medical_info.weight} kg` : 'Not set'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
          {isEditing ? (
            <select
              value={formData.medical_info?.blood_type || ''}
              onChange={(e) => updateNestedField('medical_info', 'blood_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              aria-label="Select blood type"
            >
              <option value="">Select blood type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          ) : (
            <p className="text-gray-900">{formData.medical_info?.blood_type || 'Not set'}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
        {isEditing ? (
          <textarea
            value={formData.medical_info?.allergies?.join(', ') || ''}
            onChange={(e) => updateNestedField('medical_info', 'allergies', e.target.value.split(', ').filter(Boolean))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="List any allergies, separated by commas"
            rows={2}
          />
        ) : (
          <p className="text-gray-900">
            {formData.medical_info?.allergies?.length ? formData.medical_info.allergies.join(', ') : 'None listed'}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
        {isEditing ? (
          <textarea
            value={formData.medical_info?.medications?.join(', ') || ''}
            onChange={(e) => updateNestedField('medical_info', 'medications', e.target.value.split(', ').filter(Boolean))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="List current medications, separated by commas"
            rows={2}
          />
        ) : (
          <p className="text-gray-900">
            {formData.medical_info?.medications?.length ? formData.medical_info.medications.join(', ') : 'None listed'}
          </p>
        )}
      </div>
    </div>
  );

  const renderEmergencySection = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
        {isEditing ? (
          <input
            type="text"
            value={formData.emergency_contact?.name || ''}
            onChange={(e) => updateNestedField('emergency_contact', 'name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Contact name"
          />
        ) : (
          <p className="text-gray-900">{formData.emergency_contact?.name || 'Not set'}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
        {isEditing ? (
          <input
            type="tel"
            value={formData.emergency_contact?.phone || ''}
            onChange={(e) => updateNestedField('emergency_contact', 'phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        ) : (
          <p className="text-gray-900">{formData.emergency_contact?.phone || 'Not set'}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
        {isEditing ? (
          <input
            type="text"
            value={formData.emergency_contact?.relationship || ''}
            onChange={(e) => updateNestedField('emergency_contact', 'relationship', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Spouse, Parent, Friend"
          />
        ) : (
          <p className="text-gray-900">{formData.emergency_contact?.relationship || 'Not set'}</p>
        )}
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
          <Bell className="w-4 h-4 mr-2" />
          Notification Preferences
        </h4>
        <div className="space-y-3">
          {[
            { key: 'email', label: 'Email notifications' },
            { key: 'sms', label: 'SMS notifications' },
            { key: 'push', label: 'Push notifications' },
            { key: 'marketing', label: 'Marketing communications' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-700">{label}</span>
              <input
                type="checkbox"
                checked={formData.preferences?.notifications?.[key as keyof typeof formData.preferences.notifications] || false}
                onChange={(e) => updateNestedField('preferences', 'notifications', {
                  ...formData.preferences?.notifications,
                  [key]: e.target.checked
                })}
                disabled={!isEditing}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                aria-label={label}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
          <Lock className="w-4 h-4 mr-2" />
          Privacy Settings
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Share data for research</span>
            <input
              type="checkbox"
              checked={formData.preferences?.privacy?.share_data_for_research || false}
              onChange={(e) => updateNestedField('preferences', 'privacy', {
                ...formData.preferences?.privacy,
                share_data_for_research: e.target.checked
              })}
              disabled={!isEditing}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              aria-label="Share data for research"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Share progress with providers</span>
            <input
              type="checkbox"
              checked={formData.preferences?.privacy?.share_progress_with_providers || false}
              onChange={(e) => updateNestedField('preferences', 'privacy', {
                ...formData.preferences?.privacy,
                share_progress_with_providers: e.target.checked
              })}
              disabled={!isEditing}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              aria-label="Share progress with providers"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubscriptionSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 capitalize">
              {formData.subscription_status || 'Free'} Plan
            </h4>
            <p className="text-gray-600 mt-1">
              {formData.subscription_status === 'premium' 
                ? 'Access to all premium features'
                : 'Upgrade to unlock premium features'}
            </p>
            {formData.subscription_expires_at && (
              <p className="text-sm text-gray-500 mt-2">
                Expires: {new Date(formData.subscription_expires_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="text-right">
            {formData.subscription_status !== 'premium' && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Upgrade Now
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">Billing Information</h4>
        <p className="text-gray-600">
          Manage your billing information and payment methods in your account settings.
        </p>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalSection();
      case 'medical':
        return renderMedicalSection();
      case 'emergency':
        return renderEmergencySection();
      case 'preferences':
        return renderPreferencesSection();
      case 'subscription':
        return renderSubscriptionSection();
      default:
        return renderPersonalSection();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account and preferences</p>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
              <button
                onClick={signOut}
                className="text-sm text-red-600 hover:text-red-700 px-3 py-2 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4">
              <nav className="space-y-1">
                {profileSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.section}
                      onClick={() => setActiveSection(section.section)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeSection === section.section
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {section.title}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {profileSections.find(s => s.section === activeSection)?.title}
              </h2>
            </div>
            <div className="p-6">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUserProfile;
