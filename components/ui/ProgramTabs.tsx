
import React from 'react';
import { Program } from '../../types';

interface ProgramTabsProps {
  programs: Program[];
  activeProgramId: string;
  onTabClick: (programId: string) => void;
}

const ProgramTabs: React.FC<ProgramTabsProps> = ({ programs, activeProgramId, onTabClick }) => {
  return (
    <div className="program-tabs" role="tablist" aria-label="Select treatment program">
      {programs.map((program) => (
        <button
          key={program.id}
          className={`program-tab ${program.themeClass} ${activeProgramId === program.id ? 'active' : ''}`}
          data-program={program.id}
          role="tab"
          aria-selected={activeProgramId === program.id}
          aria-controls={`${program.id}-content`}
          id={`${program.id}-tab`}
          onClick={() => onTabClick(program.id)}
        >
          {activeProgramId === program.id && <span className="sr-only">Currently selected: </span>}
          {program.name}
        </button>
      ))}
    </div>
  );
};

export default ProgramTabs;
