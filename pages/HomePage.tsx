
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import ProgramTabs from '../components/ui/ProgramTabs';
import NotificationBanner from '../components/ui/NotificationBanner';
import { ProgramContext, ToastContext } from '../App';
import { PROGRAMS_DATA, PackageIcon, CheckCircleIcon, ArrowTrendingDownIcon, CalendarIcon, RefillIcon, InformationCircleIcon, CheckIcon, FireIcon, ChevronRightIcon } from '../constants';
import { Program } from '../types';
import { useHomePageData } from '../hooks/useHomePageData';


const HomePage: React.FC = () => {
  // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL LOGIC
  const navigate = useNavigate();
  const programContext = useContext(ProgramContext);
  const toastContext = useContext(ToastContext);
  const { data: homeData, loading, error, logWeight, completeTask } = useHomePageData();
  const [expandedRefills, setExpandedRefills] = useState(false);
  const [logWeightButtonText, setLogWeightButtonText] = useState("Log Today's Weight");
  const [taskCompleted, setTaskCompleted] = useState(false);

  // NOW we can do conditional returns
  if (!programContext) {
    return <div>Loading program data...</div>; // Or some other loading state
  }
  
  if (loading) {
    return <div>Loading your health data...</div>;
  }
  
  if (error) {
    return <div>Error loading data: {error}</div>;
  }
  
  // Create fallback data to maintain layout structure
  const safeData = homeData || {
    profile: { first_name: 'User', id: '', user_id: '', last_name: '', date_of_birth: '', weight: 0, height: 0, created_at: '', updated_at: '' },
    activeOrders: [],
    nextAppointment: null,
    recentCheckIns: [],
    pendingTasks: [],
    recommendedResources: [],
    weeklyProgress: {
      currentWeight: 0,
      weightChange: 0,
      progressPercentage: 0,
      remainingToGoal: 0
    },
    allPrograms: []
  };

  const { activeProgram, setActiveProgramById } = programContext;

  const handleTabClick = (programId: string) => {
    setActiveProgramById(programId);
    setTaskCompleted(false); // Reset task completion status when switching tabs
    setLogWeightButtonText(programId === 'weight' ? "Log Today's Weight" : "Log Today's Task");
  };
  
  const handlePriorityAction = () => {
    toastContext?.addToast('Priority task marked as complete!', 'success');
    // Add logic for completing the task
  };

  const handleLogWeight = async () => {
    setLogWeightButtonText("Logging...");
    const success = await logWeight(safeData.weeklyProgress.currentWeight + 1); // Demo: add 1 lb
    if (success) {
      setLogWeightButtonText("Weight Logged!");
      toastContext?.addToast('Weight logged successfully!', 'success');
      setTimeout(() => setLogWeightButtonText("Log Today's Weight"), 2000);
    } else {
      setLogWeightButtonText("Log Today's Weight");
      toastContext?.addToast('Failed to log weight', 'error');
    }
  };
  
  const handleMarkTaskComplete = async () => {
    if (safeData.pendingTasks.length > 0) {
      const taskId = safeData.pendingTasks[0].id;
      const success = await completeTask(taskId);
      if (success) {
        setTaskCompleted(true);
        toastContext?.addToast('Task marked as complete!', 'success');
      } else {
        toastContext?.addToast('Failed to complete task', 'error');
      }
    }
  };
  
  const handleViewInstructions = (type: string) => {
    navigate(`/instructions/${type}`);
  }

  // Content for the active program. This is simplified.
  // In a real app, this would be more dynamic or component-based.
  const renderProgramContent = (program: Program) => {
    // Weight Loss Program (existing implementation)
    if (program.id === 'weight') {
      return (
        <div id="weight-content" className="program-content" role="tabpanel" aria-labelledby="weight-tab">
          {/* ...existing weight content... */}
          <div className="hero-card mb-8">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Week 4 Progress</h3>
                  <p className="text-gray-600 text-lg">You're doing great! 🎉</p>
                </div>
                <div className="progress-text">On track</div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <p className="text-3xl font-bold text-gray-900">
                      {safeData.weeklyProgress.currentWeight > 0 ? Math.round(safeData.weeklyProgress.currentWeight) : '--'}
                    </p>
                    <span className="text-lg text-gray-500 ml-1">lbs</span>
                    {safeData.weeklyProgress.currentWeight > 0 && <ArrowTrendingDownIcon className="w-5 h-5 ml-2 text-green-600" />}
                  </div>
                  <p className="text-sm text-gray-500">Current weight</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 mb-2">
                    {safeData.weeklyProgress.currentWeight > 0 
                      ? `${safeData.weeklyProgress.weightChange >= 0 ? '+' : ''}${safeData.weeklyProgress.weightChange.toFixed(1)} lbs`
                      : '--'
                    }
                  </p>
                  <p className="text-sm text-gray-500">This week</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress to goal</span>
                  <span>
                    <strong>{safeData.weeklyProgress.progressPercentage}%</strong> • {Math.round(safeData.weeklyProgress.remainingToGoal)} lbs remaining
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden" role="progressbar" aria-label="Progress toward weight loss goal">
                  <div 
                    className="progress-indicator h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, safeData.weeklyProgress.progressPercentage))}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-center items-center text-sm text-gray-500 mb-6">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>
                  Next check-in: {safeData.nextAppointment?.appointment_date 
                    ? new Date(safeData.nextAppointment.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'Not scheduled'
                  }
                </span>
              </div>
              
              <div>
                <button className="cta-primary w-full" onClick={handleLogWeight} aria-describedby="weight-log-help">
                  {logWeightButtonText}
                </button>
                <p id="weight-log-help" className="text-xs text-gray-500 text-center mt-2">Track your progress with daily weigh-ins</p>
              </div>
            </div>
          </div>

          {renderMedicationCard('weight')}
          {renderLearningSection('weight')}
        </div>
      );
    }

    // Hair Loss Program
    if (program.id === 'hair') {
      return (
        <div id="hair-content" className="program-content" role="tabpanel" aria-labelledby="hair-tab">
          <div className="hero-card mb-8">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Hair Loss Treatment</h3>
                  <p className="text-gray-600 text-lg">Consistent progress! 💪</p>
                </div>
                <div className="progress-text">Active</div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">12</p>
                  <p className="text-sm text-gray-500">Weeks on treatment</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600 mb-2">Improving</p>
                  <p className="text-sm text-gray-500">Overall progress</p>
                </div>
              </div>
              
              <div className="flex justify-center items-center text-sm text-gray-500 mb-6">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>Next photo check: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              
              <button className="cta-primary w-full">
                Upload Progress Photos
              </button>
            </div>
          </div>
          
          {renderMedicationCard('hair')}
          {renderLearningSection('hair')}
        </div>
      );
    }

    // Anti-Aging Program
    if (program.id === 'aging') {
      return (
        <div id="aging-content" className="program-content" role="tabpanel" aria-labelledby="aging-tab">
          <div className="hero-card mb-8">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Anti-Aging Protocol</h3>
                  <p className="text-gray-600 text-lg">Looking younger every day! ✨</p>
                </div>
                <div className="progress-text">Excellent</div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">8</p>
                  <p className="text-sm text-gray-500">Weeks on protocol</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600 mb-2">95%</p>
                  <p className="text-sm text-gray-500">Treatment adherence</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Skin improvement</span>
                  <span><strong>Visible results</strong></span>
                </div>
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-400 to-amber-600 w-3/4 h-full"></div>
                </div>
              </div>
              
              <button className="cta-primary w-full">
                Log Skincare Routine
              </button>
            </div>
          </div>
          
          {renderMedicationCard('aging')}
          {renderLearningSection('aging')}
        </div>
      );
    }

    // Peptides Program
    if (program.id === 'peptides') {
      return (
        <div id="peptides-content" className="program-content" role="tabpanel" aria-labelledby="peptides-tab">
          <div className="hero-card mb-8">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Peptide Therapy</h3>
                  <p className="text-gray-600 text-lg">Optimizing performance! 🎯</p>
                </div>
                <div className="progress-text">Active</div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">6</p>
                  <p className="text-sm text-gray-500">Weeks on therapy</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 mb-2">Enhanced</p>
                  <p className="text-sm text-gray-500">Recovery & energy</p>
                </div>
              </div>
              
              <button className="cta-primary w-full">
                Log Performance Metrics
              </button>
            </div>
          </div>
          
          {renderMedicationCard('peptides')}
          {renderLearningSection('peptides')}
        </div>
      );
    }

    // ED Treatment Program
    if (program.id === 'ed') {
      return (
        <div id="ed-content" className="program-content" role="tabpanel" aria-labelledby="ed-tab">
          <div className="hero-card mb-8">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">ED Treatment</h3>
                  <p className="text-gray-600 text-lg">Confidence restored! 💪</p>
                </div>
                <div className="progress-text">Effective</div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">4</p>
                  <p className="text-sm text-gray-500">Weeks on treatment</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600 mb-2">Excellent</p>
                  <p className="text-sm text-gray-500">Treatment response</p>
                </div>
              </div>
              
              <button className="cta-primary w-full">
                Private Check-in
              </button>
            </div>
          </div>
          
          {renderMedicationCard('ed')}
          {renderLearningSection('ed')}
        </div>
      );
    }

    // Sleep Program
    if (program.id === 'sleep') {
      return (
        <div id="sleep-content" className="program-content" role="tabpanel" aria-labelledby="sleep-tab">
          <div className="hero-card mb-8">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Sleep Optimization</h3>
                  <p className="text-gray-600 text-lg">Better rest, better you! 😴</p>
                </div>
                <div className="progress-text">Improving</div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">7.2</p>
                  <p className="text-sm text-gray-500">Avg hours sleep</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600 mb-2">85%</p>
                  <p className="text-sm text-gray-500">Sleep quality</p>
                </div>
              </div>
              
              <button className="cta-primary w-full">
                Log Sleep Quality
              </button>
            </div>
          </div>
          
          {renderMedicationCard('sleep')}
          {renderLearningSection('sleep')}
        </div>
      );
    }

    // Women's Health Program
    if (program.id === 'women') {
      return (
        <div id="women-content" className="program-content" role="tabpanel" aria-labelledby="women-tab">
          <div className="hero-card mb-8">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Women's Health</h3>
                  <p className="text-gray-600 text-lg">Empowering your wellness! 🌸</p>
                </div>
                <div className="progress-text">Thriving</div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">10</p>
                  <p className="text-sm text-gray-500">Weeks on program</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-pink-600 mb-2">Balanced</p>
                  <p className="text-sm text-gray-500">Hormone levels</p>
                </div>
              </div>
              
              <button className="cta-primary w-full">
                Log Wellness Check
              </button>
            </div>
          </div>
          
          {renderMedicationCard('women')}
          {renderLearningSection('women')}
        </div>
      );
    }

    // Default fallback
    return (
      <div id={`${program.id}-content`} className="program-content p-6 bg-white rounded-lg shadow" role="tabpanel" aria-labelledby={`${program.id}-tab`}>
        <h3 className="text-xl font-semibold mb-4 text-gray-900">{program.name} Program</h3>
        <p className="text-gray-600">Details for the {program.name.toLowerCase()} program will be displayed here. This program's priority task is: "{program.priorityText}".</p>
        <button className="mt-4 cta-primary" onClick={() => toastContext?.addToast(`Completing task for ${program.name}`, 'success')}>
          Complete Today's Task
        </button>
      </div>
    );
  };

  // Helper function to render medication card for any program
  const renderMedicationCard = (programType: string) => {
    const programOrders = safeData.allPrograms.filter(order => 
      order.products?.category?.toLowerCase().includes(programType.toLowerCase())
    );
    const programTasks = safeData.pendingTasks.filter(task => 
      task.task_type?.toLowerCase().includes(programType.toLowerCase())
    );

    const order = programOrders[0] || safeData.activeOrders[0];
    const hasActiveTasks = programTasks.length > 0;

    return (
      <div className="program-card mb-8">
        <div className="flex items-start mb-4">
          <span className={`status-dot ${taskCompleted || !hasActiveTasks ? 'status-complete' : 'status-urgent'} mt-2`} 
                role="img" aria-label={taskCompleted ? "Task complete" : "Urgent task"}></span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold text-gray-900">
                {order?.products?.name || `${programType.charAt(0).toUpperCase() + programType.slice(1)} Medication`}
              </h4>
              {!taskCompleted && hasActiveTasks && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">Due Today</span>}
              {(taskCompleted || !hasActiveTasks) && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Completed</span>}
            </div>
            <p className="text-gray-600 mb-3">
              {order?.frequency || 'Daily'} dose • {order?.dosage || '1 unit'} • Follow prescribed instructions
            </p>
            
            {order && (
              <div className="bg-[var(--light)] rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <RefillIcon className="w-4 h-4 text-[var(--primary)] mr-2" />
                    <span className="text-sm font-medium text-[var(--dark-text)]">Refill Status</span>
                  </div>
                  <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full font-medium">
                    {order.status === 'active' ? 'Ordered' : order.status || 'Pending'}
                  </span>
                </div>
                <p className="text-sm text-[var(--dark-text)] mt-1">
                  Due {order.next_refill_date 
                    ? new Date(order.next_refill_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'TBD'
                  } • Arriving {order.next_refill_date 
                    ? new Date(new Date(order.next_refill_date).getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'TBD'
                  }
                </p>
              </div>
            )}
            
            <button 
              onClick={() => handleViewInstructions(programType)}
              className="text-sm text-[var(--primary)] font-medium hover:text-[var(--secondary)] transition-colors inline-flex items-center group"
            >
              <InformationCircleIcon className="w-4 h-4 mr-2" />
              View detailed instructions
              <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
        {!taskCompleted && hasActiveTasks && (
          <button className="cta-secondary w-full" onClick={handleMarkTaskComplete}>
            <CheckIcon className="w-4 h-4 mr-2 inline-block" />
            Mark as Complete
          </button>
        )}
        {(taskCompleted || !hasActiveTasks) && (
          <p className="text-sm text-center text-green-600 font-medium">Task completed for today!</p>
        )}
      </div>
    );
  };

  // Helper function to render learning section for any program
  const renderLearningSection = (programType: string) => {
    const programResources = safeData.recommendedResources.filter(resource => 
      resource.category?.toLowerCase().includes(programType.toLowerCase())
    );

    const displayResources = programResources.length > 0 ? programResources : safeData.recommendedResources;

    return (
      <section aria-label="Learning resources and educational content">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Learning & Resources</h3>
          <button
            onClick={() => navigate('/learn')}
            className="text-sm text-[var(--primary)] font-medium hover:text-[var(--secondary)] transition-colors"
            aria-label="View all resources"
          >
            View All
          </button>
        </div>
        
        <div className="program-card mb-8">          
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <FireIcon className="w-4 h-4 text-orange-600"/>
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Recommended for You</h4>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {displayResources.length > 0 ? (
                displayResources.slice(0, 3).map((resource) => (
                  <article 
                    key={resource.id}
                    className="resource-card" 
                    tabIndex={0} 
                    role="button" 
                    aria-label={`Learn about ${resource.title}`} 
                    onClick={() => toastContext?.addToast(`Opening article: ${resource.title}`, 'info')}
                  >
                    <div className="p-4">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium mr-2">
                              {resource.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              {resource.read_time || 4} min read
                            </span>
                          </div>
                          <h5 className="font-semibold text-base mb-2 text-gray-900">{resource.title}</h5>
                          <p className="text-sm text-gray-600">
                            {resource.content.substring(0, 80)}...
                          </p>
                        </div>
                        <img className="w-12 h-12 rounded-lg object-cover ml-4 flex-shrink-0" src="https://picsum.photos/96/96?grayscale&blur=2" alt="Resource thumbnail"/>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No learning resources available for {programType} at the moment.</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <InformationCircleIcon className="w-4 h-4 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Quick Help</h4>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left p-4 border border-gray-100 rounded-xl hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 group" 
                      onClick={() => handleViewInstructions(`${programType}-instructions`)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-base font-medium text-gray-900 mb-1">{programType.charAt(0).toUpperCase() + programType.slice(1)} Guidelines</h5>
                    <p className="text-sm text-gray-600">Best practices and important tips</p>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };


  return (
    <div className="flex flex-col flex-grow">
      <Header userName={safeData.profile.first_name} showNotificationBell={true} />
      
      <div className="status-bar px-6 py-3" role="region" aria-label="Treatment status summary">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <PackageIcon className="w-4 h-4 text-[var(--primary)]" />
            <button onClick={() => setExpandedRefills(!expandedRefills)} className="status-indicator due-soon" id="nextRefillText">
              Next refill {safeData.activeOrders[0]?.next_refill_date ? new Date(safeData.activeOrders[0].next_refill_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'} {expandedRefills ? '▲' : '▼'}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="status-indicator on-track">
              Check-in {safeData.nextAppointment?.appointment_date ? new Date(safeData.nextAppointment.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'}
            </span>
            <CheckCircleIcon className="w-4 h-4 text-green-500" />
          </div>
        </div>
        
        {expandedRefills && (
          <div className="mt-3 pt-3 border-t border-gray-100" role="region" aria-label="Detailed refill information">
            <div className="space-y-2 text-sm">
              {safeData.activeOrders.map((order, index) => (
                <div key={order.id} className="flex justify-between items-center">
                  <span className="flex items-center text-gray-700">
                    <span className={`w-2 h-2 ${index === 0 ? 'bg-blue-500' : 'bg-purple-500'} rounded-full mr-3`}></span>
                    {order.products?.name || 'Medication'}
                  </span>
                  <span className={`status-indicator ${index === 0 ? 'due-soon' : 'on-track'}`}>
                    {new Date(order.next_refill_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
              {safeData.activeOrders.length === 0 && (
                <div className="text-gray-500 text-center">No active refills</div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <main className="px-6 pt-5 pb-36 flex-grow" role="main">
        <NotificationBanner 
          text={safeData.pendingTasks[0]?.title || activeProgram.priorityText}
          subtext={safeData.pendingTasks[0]?.description || "Tap to complete this task"}
          actionText="Complete"
          onClick={handlePriorityAction}
        />
        
        <section className="mt-8" aria-label="Treatment programs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Plans</h2>
            <button
              onClick={() => navigate('/plans')}
              className="text-sm text-[var(--primary)] font-medium hover:text-[var(--secondary)] transition-colors"
              aria-label="View all programs"
            >
              View All
            </button>
          </div>
          <ProgramTabs programs={PROGRAMS_DATA} activeProgramId={activeProgram.id} onTabClick={handleTabClick} />
        </section>
        
        <div className={`mt-2 ${activeProgram.themeClass}`}> {/* Ensure main content area gets theme class */}
          {renderProgramContent(activeProgram)}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
