import React, { useState, useEffect } from 'react';
import timelineEvents from '../../data/timelineDatabase';
import { TimelineService } from '../../services/timelineService';

interface NarrativeLinesProps {
  milestoneId: string; // Kept for backwards compatibility, but refers to eventId
}

// Define the structure of narrative line data
interface NarrativeLine {
  id: string;
  name: string;
  relevance: number;
  color: string;
}

/**
 * Component to display narrative lines an event participates in
 */
const NarrativeLines: React.FC<NarrativeLinesProps> = ({ milestoneId: eventId }) => {
  const [narrativeLines, setNarrativeLines] = useState<NarrativeLine[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch event-specific narrative line data
  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        // Get the specific event data
        const event = await TimelineService.getMilestoneById(eventId);
        
        if (event) {
          // Generate narrative line data based on the event
          // This is where you would normally fetch from an API
          // For now, we'll generate it based on the event's data
          
          // Extract relevant cognitive dimensions from the source data if possible
          // In a real app, this could come directly from a backend API
          const foundEvent = timelineEvents.find(event => event.id === eventId);
          
          // Create narrative lines with values specific to this event
          const eventNarrativeLines: NarrativeLine[] = [
            { 
              id: 'n1', 
              name: 'AGI', 
              // Use actual data if available, or fallback to calculated values
              relevance: foundEvent?.cognitiveDimensions?.computation 
                ? foundEvent.cognitiveDimensions.computation / 10 
                : Math.random() * 0.5 + 0.3, 
              color: '#4CC9F0' 
            },
            { 
              id: 'n2', 
              name: 'Regulation', 
              relevance: foundEvent?.impact?.geopolitical 
                ? foundEvent.impact.geopolitical / 10 
                : Math.random() * 0.5 + 0.3, 
              color: '#F72585' 
            },
            { 
              id: 'n3', 
              name: 'AI Safety', 
              relevance: foundEvent?.impact?.societal 
                ? foundEvent.impact.societal / 10
                : Math.random() * 0.5 + 0.3, 
              color: '#7209B7' 
            },
            { 
              id: 'n4', 
              name: 'Compute', 
              relevance: foundEvent?.impact?.technical 
                ? foundEvent.impact.technical / 10 
                : Math.random() * 0.5 + 0.3, 
              color: '#3A0CA3' 
            },
          ];
          
          setNarrativeLines(eventNarrativeLines);
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        // Fallback to default data
        setNarrativeLines([
          { id: 'n1', name: 'AGI', relevance: 0.75, color: '#4CC9F0' },
          { id: 'n2', name: 'Regulation', relevance: 0.45, color: '#F72585' },
          { id: 'n3', name: 'AI Safety', relevance: 0.8, color: '#7209B7' },
          { id: 'n4', name: 'Compute', relevance: 0.35, color: '#3A0CA3' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventData();
  }, [eventId]);
  
  // Sort the narrative lines by relevance in descending order
  const sortedNarrativeLines = [...narrativeLines].sort((a, b) => b.relevance - a.relevance);
  
  // Helper function to get opacity based on relevance and position in the sorted array
  const getOpacity = (relevance: number, index: number) => {
    // Base opacity calculated from relevance (0.3 to 1.0 range)
    const baseOpacity = 0.3 + (relevance * 0.7);
    
    // Apply additional reduction based on position in the sorted list
    // This creates a more distinct step between items
    const positionFactor = 1 - (index * 0.1);
    
    return Math.max(0.3, baseOpacity * positionFactor);
  };
  
  // Show loading state if data is still being fetched
  if (loading) {
    return (
      <div className="narrative-lines-container">
        <div className="narrative-lines-header">
          <h4 className="narrative-lines-title">Narrative Lines</h4>
          <div className="info-icon-container">
            <span className="info-icon" title="These narrative lines represent themes or storylines that this event contributes to">ⓘ</span>
          </div>
        </div>
        <div className="narrative-panels-list vertical loading">
          <div className="narrative-panel-loading"></div>
          <div className="narrative-panel-loading"></div>
          <div className="narrative-panel-loading"></div>
          <div className="narrative-panel-loading"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="narrative-lines-container">
      <div className="narrative-lines-header">
        <h4 className="narrative-lines-title">Narrative Lines</h4>
        <div className="info-icon-container">
          <span className="info-icon" title="These narrative lines represent themes or storylines that this event contributes to">ⓘ</span>
        </div>
      </div>
      <div className="narrative-panels-list vertical">
        {sortedNarrativeLines.map((line, index) => (
          <div 
            key={line.id} 
            className="narrative-panel" 
            style={{ 
              backgroundColor: line.color,
              opacity: getOpacity(line.relevance, index),
            }}
            title={`${line.name}: ${Math.round(line.relevance * 100)}% relevance`}
          >
            <span className="narrative-rank">{index + 1}</span>
            <span className="narrative-panel-name">{line.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NarrativeLines; 