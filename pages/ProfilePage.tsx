import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { healthRecordsService, ordersService } from '../services/database'
import { UserProfile } from '../components/auth/UserProfile'
import { AuthForm } from '../components/auth/AuthForm'

export const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth()
  const [healthRecords, setHealthRecords] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    // Load health records
    const records = await healthRecordsService.getUserHealthRecords(user.id)
    setHealthRecords(records)

    // Load orders
    const userOrders = await ordersService.getUserOrders(user.id)
    setOrders(userOrders)
  }

  const createSampleHealthRecord = async () => {
    if (!user) return

    const success = await healthRecordsService.createHealthRecord({
      user_id: user.id,
      record_type: 'blood_pressure',
      data: {
        systolic: 120 + Math.floor(Math.random() * 20),
        diastolic: 80 + Math.floor(Math.random() * 10),
        timestamp: new Date().toISOString()
      },
      notes: 'Sample reading created from demo'
    })

    if (success) {
      loadUserData()
    }
  }

  const createSampleOrder = async () => {
    if (!user) return

    const orderId = await ordersService.createOrder({
      user_id: user.id,
      status: 'pending',
      total_amount: 49.99,
      items: [
        {
          product_id: 'demo_product',
          name: 'Health Supplement Demo',
          quantity: 1,
          price: 49.99
        }
      ],
      shipping_address: {
        street: '123 Demo Street',
        city: 'Demo City',
        state: 'DC',
        zip: '12345'
      }
    })

    if (orderId) {
      loadUserData()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-6 p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Welcome to Zappy Health</h2>
            <p className="mt-2 text-gray-600">Sign in to access your health profile</p>
          </div>
          
          <button
            onClick={() => setShowAuthForm(true)}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Get Started
          </button>

          {showAuthForm && (
            <AuthForm
              mode={authMode}
              onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              onClose={() => setShowAuthForm(false)}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Your Health Profile</h1>
            <p className="text-gray-600">Manage your profile and view your health data</p>
          </div>
          <div className="p-6">
            <UserProfile />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Health Records</h2>
              <button
                onClick={createSampleHealthRecord}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
              >
                Add Sample
              </button>
            </div>
            <div className="p-6">
              {healthRecords.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No health records yet</p>
              ) : (
                <div className="space-y-3">
                  {healthRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{record.record_type}</h3>
                          <p className="text-sm text-gray-600">{record.notes}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(record.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {record.data && (
                        <div className="mt-2 text-sm text-gray-700">
                          <pre className="bg-gray-50 p-2 rounded text-xs">
                            {JSON.stringify(record.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
              <button
                onClick={createSampleOrder}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Add Sample
              </button>
            </div>
            <div className="p-6">
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">Order #{order.id.slice(0, 8)}</h3>
                          <p className="text-sm text-gray-600">Status: {order.status}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-gray-900">${order.total_amount}</span>
                          <p className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage