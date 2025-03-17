import { useState, useEffect, useCallback, useRef } from 'react';
import { TimelineNode, TimelineConnection, NetworkedTimelineState } from '../types/networkedTimeline';
import { mockTimelineState } from '../data/networkedMockData';

/**
 * Custom hook for managing networked timeline state
 */
export const useNetworkedTimeline = () => {
  const [timelineState, setTimelineState] = useState<NetworkedTimelineState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add ref to track if initial centering has been done
  const hasInitialized = useRef(false);

  // Initialize timeline data
  useEffect(() => {
    if (hasInitialized.current) {
      return; // Skip if already initialized
    }
    
    try {
      // In a real application, we might fetch this data from an API
      // Create a new object to ensure we're not mutating external data
      const initialState = {
        ...mockTimelineState,
        viewState: {
          ...mockTimelineState.viewState,
          // Ensure position is centered in the window
          position: { 
            x: window.innerWidth / 2, 
            y: window.innerHeight / 2 
          },
          zoom: 0.9
        }
      };
      
      console.log("Setting initial state:", initialState);
      setTimelineState(initialState);
      setIsLoading(false);
      hasInitialized.current = true;
    } catch (err) {
      console.error("Failed to load timeline data:", err);
      setError('Failed to load timeline data');
      setIsLoading(false);
    }
  }, []);

  // Reset the view to default position and zoom (user-requested reset, not automatic)
  const resetView = useCallback(() => {
    if (!timelineState) return;
    
    console.log("User requested reset view");
    
    setTimelineState(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        viewState: {
          ...prev.viewState,
          position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
          zoom: 0.9
        }
      };
    });
  }, [timelineState]);

  // Zoom in
  const zoomIn = useCallback(() => {
    if (!timelineState) return;
    
    console.log("Zooming in");
    
    setTimelineState(prev => {
      if (!prev) return prev;
      
      const newZoom = Math.min(prev.viewState.zoom + 0.1, 2); // Max zoom is 2x
      
      return {
        ...prev,
        viewState: {
          ...prev.viewState,
          zoom: newZoom
        }
      };
    });
  }, [timelineState]);

  // Zoom out
  const zoomOut = useCallback(() => {
    if (!timelineState) return;
    
    console.log("Zooming out");
    
    setTimelineState(prev => {
      if (!prev) return prev;
      
      const newZoom = Math.max(prev.viewState.zoom - 0.1, 0.5); // Min zoom is 0.5x
      
      return {
        ...prev,
        viewState: {
          ...prev.viewState,
          zoom: newZoom
        }
      };
    });
  }, [timelineState]);

  // Select a node by ID
  const selectNode = useCallback((nodeId: string) => {
    if (!timelineState) return;
    
    const selectedNode = timelineState.nodes.find(node => node.id === nodeId) || null;
    
    setTimelineState(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        selectedNode
      };
    });
  }, [timelineState]);

  // Clear the selected node
  const clearSelectedNode = useCallback(() => {
    if (!timelineState) return;
    
    setTimelineState(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        selectedNode: null
      };
    });
  }, [timelineState]);

  // Center the view on a specific node
  const centerOnNode = useCallback((nodeId: string) => {
    if (!timelineState) return;
    
    const node = timelineState.nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calculate the new position to center on the node
    const newPosition = {
      x: windowWidth / 2 - node.position.x * timelineState.viewState.zoom,
      y: windowHeight / 2 - node.position.y * timelineState.viewState.zoom
    };
    
    setTimelineState(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        viewState: {
          ...prev.viewState,
          position: newPosition
        }
      };
    });
  }, [timelineState]);

  // Search nodes by title or description
  const searchNodes = useCallback((searchTerm: string): TimelineNode[] => {
    if (!timelineState || !searchTerm.trim()) {
      return [];
    }
    
    const term = searchTerm.toLowerCase();
    
    return timelineState.nodes.filter(node => 
      node.title.toLowerCase().includes(term) || 
      node.description.toLowerCase().includes(term)
    );
  }, [timelineState]);

  return {
    timelineState,
    setTimelineState,
    isLoading,
    error,
    resetView,
    zoomIn,
    zoomOut,
    selectNode,
    clearSelectedNode,
    centerOnNode,
    searchNodes
  };
};

export default useNetworkedTimeline; 