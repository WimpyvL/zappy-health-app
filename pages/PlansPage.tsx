import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { ProgramContext } from '../App';
import { PROGRAMS_DATA } from '../constants';
import { useHomePageData } from '../hooks/useHomePageData';

const PlansPage: React.FC = () => {
  const navigate = useNavigate();
  const programContext = useContext(ProgramContext);
  const { data: homeData, loading } = useHomePageData();

  if (!programContext) {
    return <div>Loading program data...</div>;
  }

  const safeData = homeData || {
    profile: { first_name: 'User', id: '', user_id: '', last_name: '', date_of_birth: '', weight: 0, height: 0, created_at: '', updated_at: '' },
    allPrograms: []
  };

  const { setActiveProgramById } = programContext;

  const handlePlanClick = (programId: string) => {
    setActiveProgramById(programId);
    navigate('/');
  };

  // Get active programs from user's data
  const activePrograms = safeData.allPrograms || [];

  // Map active programs to program data
  const userPrograms = PROGRAMS_DATA.filter(program => {
    // Check if user has any orders related to this program
    return activePrograms.some(order =>
      order.products?.category?.toLowerCase().includes(program.id.toLowerCase()) ||
      program.id === 'weight' // Always show weight program for demo
    );
  });

  // If no specific programs found, show all available programs
  const displayPrograms = userPrograms.length > 0 ? userPrograms : PROGRAMS_DATA;

  return (
    <div className="flex flex-col flex-grow">
      <Header userName={safeData.profile.first_name} showNotificationBell={true} />

      <main className="px-6 pt-5 pb-24 flex-grow" role="main">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-[var(--primary)] hover:text-[var(--secondary)] flex items-center mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Plans</h1>
          <p className="text-gray-600">All your active treatment plans and programs</p>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading your plans...</div>
        ) : (
          <div className="space-y-4">
            {displayPrograms.map((program) => {
              const programOrders = activePrograms.filter(order =>
                order.products?.category?.toLowerCase().includes(program.id.toLowerCase())
              );
              const isActive = programOrders.length > 0 || program.id === 'weight';

              return (
                <div
                  key={program.id}
                  onClick={() => handlePlanClick(program.id)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && handlePlanClick(program.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${program.themeClass} bg-gradient-to-br from-current to-transparent`}>
                        <span className="text-2xl">{program.icon}</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                        <p className="text-sm text-gray-500">{program.tagline}</p>
                      </div>
                    </div>
                    <div>
                      {isActive ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                          Available
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {program.priorityText}
                  </p>

                  {programOrders.length > 0 && (
                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Current medication:</span>
                        <span className="font-medium text-gray-900">
                          {programOrders[0].products?.name || 'Prescribed medication'}
                        </span>
                      </div>
                      {programOrders[0].next_refill_date && (
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-gray-600">Next refill:</span>
                          <span className="font-medium text-gray-900">
                            {new Date(programOrders[0].next_refill_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex items-center text-[var(--primary)] font-medium">
                    <span>View details</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default PlansPage;
