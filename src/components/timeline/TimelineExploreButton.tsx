import React from 'react';
import TelescopeIcon from '../icons/TelescopeIcon';

interface TimelineExploreButtonProps {
  visible: boolean;
  onClick: () => void;
}

const TimelineExploreButton: React.FC<TimelineExploreButtonProps> = ({ visible, onClick }) => {
  return (
    <div className={`timeline-explore-button ${visible ? 'visible' : ''}`}>
      <button 
        className="explore-button"
        onClick={onClick}
        title="Explore Further"
      >
        <TelescopeIcon className="telescope-icon" />
      </button>
    </div>
  );
};

export default TimelineExploreButton; 