
import React, { useState, useContext, useEffect } from 'react';
import Header from '../components/layout/Header';
import ProgramTabs from '../components/ui/ProgramTabs';
import NotificationBanner from '../components/ui/NotificationBanner';
import { ProgramContext, ToastContext } from '../App';
import { PROGRAMS_DATA, PackageIcon, CheckCircleIcon, ArrowTrendingDownIcon, CalendarIcon, RefillIcon, InformationCircleIcon, CheckIcon, FireIcon, ChevronRightIcon } from '../constants';
import { Program } from '../types';


const HomePage: React.FC = () => {
  const programContext = useContext(ProgramContext);
  const toastContext = useContext(ToastContext);

  if (!programContext) {
    return <div>Loading program data...</div>; // Or some other loading state
  }
  const { activeProgram, setActiveProgramById } = programContext;
  
  const [expandedRefills, setExpandedRefills] = useState(false);
  const [logWeightButtonText, setLogWeightButtonText] = useState("Log Today's Weight");
  const [taskCompleted, setTaskCompleted] = useState(false);

  const handleTabClick = (programId: string) => {
    setActiveProgramById(programId);
    setTaskCompleted(false); // Reset task completion status when switching tabs
    setLogWeightButtonText(programId === 'weight' ? "Log Today's Weight" : "Log Today's Task");
  };
  
  const handlePriorityAction = () => {
    toastContext?.addToast('Priority task marked as complete!', 'success');
    // Add logic for completing the task
  };

  const handleLogWeight = () => {
    setLogWeightButtonText("Weight Logged!");
    toastContext?.addToast('Weight logged successfully!', 'success');
    setTimeout(() => setLogWeightButtonText("Log Today's Weight"), 2000);
  };
  
  const handleMarkTaskComplete = () => {
    setTaskCompleted(true);
    toastContext?.addToast('Task marked as complete!', 'success');
  };
  
  const handleViewInstructions = (type: string) => {
     toastContext?.addToast(`Viewing instructions for ${type.replace('-', ' ')}...`, 'info');
  }

  // Content for the active program. This is simplified.
  // In a real app, this would be more dynamic or component-based.
  const renderProgramContent = (program: Program) => {
    if (program.id === 'weight') {
      return (
        <div id="weight-content" className="program-content" role="tabpanel" aria-labelledby="weight-tab">
          <div className="hero-card mb-8">
            <div className="p-6 md:p-8"> {/* Adjusted padding */}
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
                    <p className="text-3xl font-bold text-gray-900">220</p>
                    <span className="text-lg text-gray-500 ml-1">lbs</span>
                    <ArrowTrendingDownIcon className="w-5 h-5 ml-2 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-500">Current weight</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 mb-2">-2.1 lbs</p>
                  <p className="text-sm text-gray-500">This week</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress to goal</span>
                  <span><strong>33%</strong> • 35 lbs remaining</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden" role="progressbar" aria-valuenow={33} aria-valuemin={0} aria-valuemax={100} aria-label="33% progress toward weight loss goal">
                  <div className="progress-indicator w-1/3 h-full"></div>
                </div>
              </div>
              
              <div className="flex justify-center items-center text-sm text-gray-500 mb-6">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>Next check-in: Dec 20</span>
              </div>
              
              <div>
                <button className="cta-primary w-full" onClick={handleLogWeight} aria-describedby="weight-log-help">
                  {logWeightButtonText}
                </button>
                <p id="weight-log-help" className="text-xs text-gray-500 text-center mt-2">Track your progress with daily weigh-ins</p>
              </div>
            </div>
          </div>

          <div className="program-card mb-8">
            <div className="flex items-start mb-4">
              <span className={`status-dot ${taskCompleted ? 'status-complete' : 'status-urgent'} mt-2`} role="img" aria-label={taskCompleted ? "Task complete" : "Urgent task"}></span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">Semaglutide Injection</h4>
                  {!taskCompleted && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">Due Today</span>}
                  {taskCompleted && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Completed</span>}
                </div>
                <p className="text-gray-600 mb-3">Weekly dose • 0.5mg • Take with or without food</p>
                
                <div className="bg-[var(--light)] rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <RefillIcon className="w-4 h-4 text-[var(--primary)] mr-2" />
                      <span className="text-sm font-medium text-[var(--dark-text)]">Refill Status</span>
                    </div>
                    <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full font-medium">Ordered</span>
                  </div>
                  <p className="text-sm text-[var(--dark-text)] mt-1">Due Dec 15 • Arriving Dec 12</p>
                </div>
                
                <button 
                  onClick={() => handleViewInstructions('semaglutide')}
                  className="text-sm text-[var(--primary)] font-medium hover:text-[var(--secondary)] transition-colors inline-flex items-center group"
                >
                  <InformationCircleIcon className="w-4 h-4 mr-2" />
                  View detailed instructions
                  <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
            {!taskCompleted && (
              <button className="cta-secondary w-full" onClick={handleMarkTaskComplete}>
                <CheckIcon className="w-4 h-4 mr-2 inline-block" />
                Mark as Complete
              </button>
            )}
             {taskCompleted && (
              <p className="text-sm text-center text-green-600 font-medium">Task completed for today!</p>
            )}
          </div>
           {/* Learning & Resources Section (Simplified) */}
        <section aria-label="Learning resources and educational content">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Learning & Resources</h3>
            <button className="text-sm text-[var(--primary)] font-medium hover:text-[var(--secondary)] transition-colors" aria-label="View all resources">
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
                <article className="resource-card" tabIndex={0} role="button" aria-label="Learn about managing appetite changes" onClick={() => toastContext?.addToast('Opening article: Managing Appetite Changes', 'info')}>
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium mr-2">New</span>
                          <span className="text-xs text-gray-500">4 min read</span>
                        </div>
                        <h5 className="font-semibold text-base mb-2 text-gray-900">Managing Appetite Changes</h5>
                        <p className="text-sm text-gray-600">Learn about common side effects and practical strategies.</p>
                      </div>
                      <img className="w-12 h-12 rounded-lg object-cover ml-4 flex-shrink-0" src="https://picsum.photos/96/96?grayscale&blur=2" alt="Healthy salad"/>
                    </div>
                  </div>
                </article>
                {/* ... more articles */}
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
                <button className="w-full text-left p-4 border border-gray-100 rounded-xl hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 group" onClick={() => handleViewInstructions('injection-rotation')}>
                   {/* ... content ... */}
                   <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-base font-medium text-gray-900 mb-1">Injection Site Rotation</h5>
                      <p className="text-sm text-gray-600">Best practices for rotating injection sites</p>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </button>
                 {/* ... more quick help items ... */}
              </div>
            </div>
          </div>
        </section>
        </div>
      );
    }
    // Placeholder for other programs
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


  return (
    <div className="flex flex-col flex-grow">
      <Header userName="Michel" showNotificationBell={true} />
      
      <div className="status-bar px-6 py-3" role="region" aria-label="Treatment status summary">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <PackageIcon className="w-4 h-4 text-[var(--primary)]" />
            <button onClick={() => setExpandedRefills(!expandedRefills)} className="status-indicator due-soon" id="nextRefillText">
              Next refill Dec 15 {expandedRefills ? '▲' : '▼'}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="status-indicator on-track">Check-in Dec 20</span>
            <CheckCircleIcon className="w-4 h-4 text-green-500" />
          </div>
        </div>
        
        {expandedRefills && (
          <div className="mt-3 pt-3 border-t border-gray-100" role="region" aria-label="Detailed refill information">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Semaglutide
                </span>
                <span className="status-indicator due-soon">Dec 15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Finasteride
                </span>
                <span className="status-indicator on-track">Dec 18</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <main className="px-6 pt-5 pb-36 flex-grow" role="main">
        <NotificationBanner 
          text={activeProgram.priorityText}
          subtext="Tap to complete this task"
          actionText="Complete"
          onClick={handlePriorityAction}
        />
        
        <section className="mt-8" aria-label="Treatment programs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Plans</h2>
            <button className="text-sm text-[var(--primary)] font-medium hover:text-[var(--secondary)] transition-colors" aria-label="View all programs">
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
