
import React, { useContext } from 'react';
import Header from '../components/layout/Header';
import { ProgramContext } from '../App'; // To apply theme to header

const LearnPage: React.FC = () => {
  const programContext = useContext(ProgramContext);
  const pageThemeClass = programContext?.activeProgram?.themeClass || 'theme-weight';

  return (
    <div className="flex flex-col flex-grow">
      <Header title="Learn" subtitle="Expand your knowledge" />
      <main className={`px-6 pt-5 pb-36 flex-grow ${pageThemeClass}`} role="main">
        <div className="text-center py-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Learning Center</h2>
          <p className="text-lg text-gray-600 mb-8">
            Discover articles, guides, and resources to help you on your health journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="program-card p-6">
                <img src={`https://picsum.photos/seed/${index+10}/400/200`} alt={`Learning module ${index + 1}`} className="rounded-lg mb-4 aspect-video object-cover"/>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Module {index + 1}: Understanding Your Plan</h3>
                <p className="text-gray-600 mb-4">An introduction to the core concepts and benefits of personalized health.</p>
                <button className="cta-secondary w-full">Start Learning</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearnPage;
