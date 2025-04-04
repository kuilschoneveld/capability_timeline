import React, { useEffect, useRef, useState } from 'react';
import { TimelineEvent } from '../../types';
import PieChart from './PieChart';
import NarrativeLines from './NarrativeLines';
import timelineEvents from '../../data/timelineDatabase';

interface TimelineItemProps {
  milestone: TimelineEvent;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}

/**
 * Component to display a single milestone in the timeline
 */
const TimelineItem: React.FC<TimelineItemProps> = ({ 
  milestone, 
  isExpanded, 
  onToggleExpand 
}) => {
  const { id, title, date, description, imageUrl, sourceUrls } = milestone;
  const impact = milestone.impact; // Use impact instead of thematicTags
  const itemRef = useRef<HTMLDivElement>(null);
  const prevExpandedState = useRef<boolean>(isExpanded);
  const [isCollapsing, setIsCollapsing] = useState(false);
  
  // Format the date for display
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Handle click to expand/collapse
  const handleClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent the parent container's click and drag events
    e.stopPropagation();
    
    // Store the center position of the element before expanding/collapsing
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const viewportCenterX = window.innerWidth / 2;
      const scrollOffset = elementCenterX - viewportCenterX;
      
      // Store the center position in a data attribute for use after the transition
      itemRef.current.dataset.centerX = elementCenterX.toString();
      itemRef.current.dataset.scrollOffset = scrollOffset.toString();
      itemRef.current.dataset.topPosition = rect.top.toString(); // Store the top position for upward expansion
      
      // Add collapsing animation if we're about to collapse
      if (isExpanded) {
        setIsCollapsing(true);
        // Wait for animation to complete before actually collapsing
        setTimeout(() => {
          onToggleExpand(id);
          setIsCollapsing(false);
        }, 200); // Slightly shorter than animation duration
      } else {
        // Expand immediately
        onToggleExpand(id);
      }
    } else {
      // Fallback if ref not available
      onToggleExpand(id);
    }
  };
  
  // Prevent collapse when interacting with details content
  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Effect to maintain scroll position when expanding/collapsing
  useEffect(() => {
    // Only run this when the expanded state changes
    if (prevExpandedState.current !== isExpanded && itemRef.current) {
      prevExpandedState.current = isExpanded;
      
      // If we're expanding, we need to adjust scroll after the element expands
      if (isExpanded) {
        const adjustScroll = () => {
          const rect = itemRef.current?.getBoundingClientRect();
          if (!rect) return;
          
          const currentCenterX = rect.left + rect.width / 2;
          const viewportCenterX = window.innerWidth / 2;
          const parentContainer = document.querySelector('.App-main');
          
          if (parentContainer) {
            // Calculate how much we need to scroll to keep the element centered
            const newScrollOffset = currentCenterX - viewportCenterX;
            // Get the stored offset from before expansion
            const oldScrollOffset = parseFloat(itemRef.current?.dataset.scrollOffset || '0');
            // Calculate the difference to maintain the same relative position
            const scrollAdjustment = newScrollOffset - oldScrollOffset;
            
            // Apply the scroll adjustment smoothly
            if (Math.abs(scrollAdjustment) > 5) { // Only adjust if significant
              parentContainer.scrollBy({
                left: scrollAdjustment,
                behavior: 'smooth'
              });
            }
          }
        };
        
        // Wait for the expansion transition to complete
        setTimeout(adjustScroll, 50); // Small delay to let render happen
      }
    }
  }, [isExpanded]);
  
  // Get the appropriate class names
  const getClassName = () => {
    let className = 'timeline-item';
    if (isExpanded) className += ' expanded';
    if (isCollapsing) className += ' collapsing';
    return className;
  };
  
  // Get notable innovation from milestone, or use default text if not available
  const notableInnovation = milestone.cognitiveDimensions?.notable_innovation || "Information on innovation not available.";
  
  return (
    <div 
      ref={itemRef}
      className={getClassName()}
      onClick={handleClick}
      data-branch={milestone.branchId}
      data-milestone-id={id}
      data-event-id={id}
      data-expanded={isExpanded ? 'true' : 'false'}
      data-milestone-year={new Date(date).getFullYear()}
    >
      <div className="timeline-item-header">
        <div className="timeline-item-date">{formattedDate}</div>
        <h3 className="timeline-item-title">{title}</h3>
      </div>
      
      {isExpanded && (
        <div 
          className="timeline-item-details" 
          onClick={handleDetailsClick}
          data-milestone-id={id}
        >
          {/* Pie chart visualization of impact dimensions */}
          <PieChart data={impact} />
          
          <p className="timeline-item-description">{description}</p>
          
          {/* Narrative lines and notable innovation side by side */}
          <div className="narrative-innovation-layout">
            <NarrativeLines milestoneId={id} />
            
            {/* Notable innovation section */}
            <div className="notable-innovation-container">
              <h4>Notable Innovation</h4>
              <div className="notable-innovation-content">
                <p>{notableInnovation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineItem; 