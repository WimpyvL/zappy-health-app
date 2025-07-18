import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

/**
 * Development tool for testing messaging functionality
 * This component allows switching between different user perspectives
 * for testing conversations and real-time messaging
 */
export const MessagingTestUtils: React.FC = () => {
  const [testUserId, setTestUserId] = useState<string>('00000000-0000-0000-0000-000000000010');
  const [connected, setConnected] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Test user IDs for different personas
  const testUsers = [
    { id: '00000000-0000-0000-0000-000000000010', name: 'Test Patient', role: 'patient' },
    { id: '00000000-0000-0000-0000-000000000001', name: 'Dr. Sarah Chen', role: 'doctor' },
    { id: '00000000-0000-0000-0000-000000000002', name: 'Dr. Michael Torres', role: 'doctor' },
    { id: '00000000-0000-0000-0000-000000000003', name: 'Dr. Emily Rodriguez', role: 'doctor' },
  ];

  const handleUserSwitch = (userId: string) => {
    setTestUserId(userId);
    // In a real app, this would involve proper authentication
    console.log(`Switched to test user: ${userId}`);
  };

  const testDatabaseConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('Database connection test failed:', error);
        setConnected(false);
      } else {
        console.log('Database connection successful:', data);
        setConnected(true);
      }
    } catch (err) {
      console.error('Database connection error:', err);
      setConnected(false);
    }
  };

  const createTestMessage = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: '11111111-1111-1111-1111-111111111111',
          sender_id: testUserId,
          content: `Test message from ${testUsers.find(u => u.id === testUserId)?.name} at ${new Date().toLocaleTimeString()}`,
        });

      if (error) {
        console.error('Failed to create test message:', error);
      } else {
        console.log('Test message created:', data);
      }
    } catch (err) {
      console.error('Error creating test message:', err);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg max-w-sm z-50">
      {/* Header with toggle button */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-t-lg"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-sm font-semibold text-gray-800">Messaging Test Utils</h3>
        <div className="flex items-center">
          <span className={`text-xs mr-2 ${connected ? 'text-green-600' : 'text-red-600'}`}>
            {connected ? '●' : '●'}
          </span>
          {isCollapsed ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </div>
      
      {/* Collapsible content */}
      {!isCollapsed && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-200">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Test User Perspective
            </label>
            <select 
              value={testUserId}
              onChange={(e) => handleUserSwitch(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded px-2 py-1"
              aria-label="Select test user perspective"
            >
              {testUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={testDatabaseConnection}
              className="flex-1 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Test DB
            </button>
            <button
              onClick={createTestMessage}
              className="flex-1 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
            >
              Send Test
            </button>
          </div>

          <div className="text-xs">
            <span className="text-gray-600">Status: </span>
            <span className={connected ? 'text-green-600' : 'text-red-600'}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <div className="text-xs text-gray-500">
            Current User: {testUsers.find(u => u.id === testUserId)?.name}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingTestUtils;
