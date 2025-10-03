import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Target, Calendar, Award, Activity, ChevronLeft } from 'lucide-react';
import Header from '../components/layout/Header';

const WeightProgramPage: React.FC = () => {
  const navigate = useNavigate();

  const milestones = [
    { date: 'Sep 15, 2025', weight: '173 lbs', description: 'Program Start', status: 'completed' },
    { date: 'Oct 3, 2025', weight: '165 lbs', description: 'Current Progress', status: 'current' },
    { date: 'Nov 1, 2025', weight: '162 lbs', description: 'Month 2 Goal', status: 'upcoming' },
    { date: 'Dec 1, 2025', weight: '158 lbs', description: 'Target Weight', status: 'upcoming' }
  ];

  const weeklyStats = [
    { label: 'Starting Weight', value: '173 lbs', icon: Activity },
    { label: 'Current Weight', value: '165 lbs', icon: TrendingUp },
    { label: 'Weight Lost', value: '8 lbs', icon: Award },
    { label: 'Goal Weight', value: '158 lbs', icon: Target }
  ];

  return (
    <div className="flex flex-col flex-grow">
      <Header
        title="Weight Management"
        subtitle="Track your progress and stay motivated"
      />

      <main className="px-6 pt-5 pb-36 flex-grow" role="main">
        {/* Back Button */}
        <button
          onClick={() => navigate('/health')}
          className="flex items-center text-[var(--primary)] mb-6 hover:opacity-80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="font-medium">Back to Health</span>
        </button>

        {/* Program Overview Card */}
        <section className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-100 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Weight Management Program</h2>
              <p className="text-sm text-gray-600">Target: Lose 15 lbs by December 2025</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-gray-900">8 lbs lost (53%)</span>
            </div>
            <div className="w-full bg-white rounded-full h-3">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full" style={{ width: '53%' }}></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm bg-white rounded-lg p-3">
            <span className="text-gray-600">Days in Program</span>
            <span className="font-semibold text-gray-900">18 days</span>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            {weeklyStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl border-2 border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Milestones */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Milestones</h3>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl border-2 p-4 ${
                  milestone.status === 'completed'
                    ? 'border-green-200 bg-green-50'
                    : milestone.status === 'current'
                    ? 'border-purple-200 bg-purple-50'
                    : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{milestone.description}</h4>
                      {milestone.status === 'completed' && (
                        <span className="text-green-600 text-xs">✓</span>
                      )}
                      {milestone.status === 'current' && (
                        <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">Current</span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 space-x-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{milestone.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Activity className="w-4 h-4 mr-1" />
                        <span>{milestone.weight}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium py-3 px-4 rounded-xl hover:opacity-90 transition-opacity"
            >
              Log Today's Weight
            </button>
            <button
              onClick={() => navigate('/messages')}
              className="w-full bg-white border-2 border-gray-200 text-gray-900 font-medium py-3 px-4 rounded-xl hover:border-purple-300 transition-colors"
            >
              Message Your Care Team
            </button>
            <button
              onClick={() => navigate('/learn')}
              className="w-full bg-white border-2 border-gray-200 text-gray-900 font-medium py-3 px-4 rounded-xl hover:border-purple-300 transition-colors"
            >
              View Nutrition Tips
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WeightProgramPage;
