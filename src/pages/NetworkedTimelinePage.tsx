import React, { useState, useCallback, useEffect } from 'react';
import { useNetworkedTimeline } from '../hooks/useNetworkedTimeline';
import { TimelineNode, TimelineConnection } from '../types/networkedTimeline';
import NodeDetailPanel from '../components/nodeDetailPanel/NodeDetailPanel';

/**
 * NetworkedTimelinePage using the BasicTestPage rendering approach
 * combined with the networked timeline data structure
 */
const NetworkedTimelinePage: React.FC = () => {
  // Use the networked timeline hook to get data and functionality
  const {
    timelineState,
    setTimelineState,
    resetView,
    zoomIn,
    zoomOut,
    selectNode,
    clearSelectedNode,
    centerOnNode,
    searchNodes,
    isLoading,
    error
  } = useNetworkedTimeline();

  // Local state for search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<TimelineNode[]>([]);

  // Local state for handling dragging
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Store window dimensions for centering
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Branch colors
  const branchColors = {
    main: '#3b82f6',   // Blue
    ai: '#8b5cf6',     // Purple
    web: '#10b981',    // Green
    mobile: '#f59e0b', // Amber
    quantum: '#ec4899', // Pink
    other: '#6b7280'    // Gray
  };

  // Update window dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Force center view on initial load
  useEffect(() => {
    console.log('NetworkedTimelinePage mounted - ensuring centered view');
    
    // Enhanced reset view that ensures content is in the center
    const centerView = () => {
      if (timelineState) {
        setTimelineState(prev => {
          if (!prev) return prev;
          
          return {
            ...prev,
            viewState: {
              ...prev.viewState,
              position: {
                x: windowDimensions.width / 2,
                y: windowDimensions.height / 2 
              },
              zoom: 1
            }
          };
        });
      }
    };
    
    // Initial centering only, without any subsequent resets
    const timer = setTimeout(() => {
      centerView();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []); // Only run once on mount, removed timelineState and other dependencies

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      const results = searchNodes(term);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchNodes]);

  // Handle selecting a search result
  const handleSearchResultClick = useCallback((nodeId: string) => {
    selectNode(nodeId);
    centerOnNode(nodeId);
    setSearchResults([]);
    setSearchTerm('');
  }, [selectNode, centerOnNode]);

  // Mouse event handlers for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only respond to left mouse button
    
    // Don't initiate dragging if clicking on interactive elements
    if ((e.target as Element).closest('button, input, .timeline-node')) {
      return;
    }
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    document.body.style.cursor = 'grabbing';
    
    // Prevent default to avoid text selection during drag
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !timelineState) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setTimelineState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        viewState: {
          ...prev.viewState,
          position: {
            x: prev.viewState.position.x + dx,
            y: prev.viewState.position.y + dy
          }
        }
      };
    });
    
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart, timelineState, setTimelineState]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = 'grab';
  }, []);

  // Check if a node is highlighted because it's connected to the selected node
  const isNodeHighlighted = useCallback((nodeId: string) => {
    if (!timelineState?.selectedNode) return false;
    
    return timelineState.connections.some(conn => 
      (conn.sourceId === timelineState.selectedNode?.id && conn.targetId === nodeId) ||
      (conn.targetId === timelineState.selectedNode?.id && conn.sourceId === nodeId)
    );
  }, [timelineState?.selectedNode, timelineState?.connections]);

  // Get branch color
  const getBranchColor = useCallback((branchId: string) => {
    return branchColors[branchId as keyof typeof branchColors] || branchColors.other;
  }, [branchColors]);

  // Calculate adjusted position with the view offset
  const getAdjustedPosition = useCallback((node: TimelineNode) => {
    if (!timelineState) return { x: 0, y: 0 };
    
    const { position, zoom } = timelineState.viewState;
    
    return {
      x: node.position.x * zoom + position.x,
      y: node.position.y * zoom + position.y
    };
  }, [timelineState]);

  // Common button style based on the image (Dark style)
  const buttonStyle = {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    color: 'white',
    padding: '8px 16px',
    border: '1px solid rgba(99, 102, 241, 0.4)',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    backdropFilter: 'blur(4px)',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
  };

  // Message with loading status or debug info
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  useEffect(() => {
    if (timelineState) {
      setStatusMessage(`Nodes: ${timelineState.nodes.length}, Center: (${Math.round(timelineState.viewState.position.x)}, ${Math.round(timelineState.viewState.position.y)}), Zoom: ${timelineState.viewState.zoom.toFixed(1)}`);
      
      // Clear message after 5 seconds
      const timer = setTimeout(() => setStatusMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [timelineState]);

  // Add effect to prevent scrolling at the document level
  useEffect(() => {
    // Save original styles
    const originalStyle = {
      html: document.documentElement.style.cssText,
      body: document.body.style.cssText
    };
    
    // Apply no-scroll styles
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    // Cleanup function to restore original styles
    return () => {
      document.documentElement.style.cssText = originalStyle.html;
      document.body.style.cssText = originalStyle.body;
    };
  }, []);

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Loading timeline data...</div>;
  if (error) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Error: {error}</div>;
  if (!timelineState) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Timeline data is not available</div>;

  return (
    <div 
      style={{
        width: '100%',
        height: '100%',
        maxWidth: '100vw',
        maxHeight: '100vh',
        backgroundColor: '#1a202c',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        margin: 0,
        padding: 0
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header with search and controls */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        padding: '16px',
        backgroundColor: 'rgba(26, 32, 44, 0.9)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50
      }}>
        {/* Search input */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search timeline..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              backgroundColor: 'rgba(45, 55, 72, 0.8)',
              color: 'white',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: '20px',
              padding: '8px 16px',
              width: '250px'
            }}
          />
          
          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              width: '100%',
              backgroundColor: '#2d3748',
              border: '1px solid #4a5568',
              borderRadius: '0 0 4px 4px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 51
            }}>
              {searchResults.map(node => (
                <div
                  key={node.id}
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid #4a5568',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4a5568'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => handleSearchResultClick(node.id)}
                >
                  <div style={{ fontWeight: 'bold' }}>{node.title}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>{node.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={zoomIn}
            style={{
              ...buttonStyle,
              fontSize: '18px',
              padding: '8px 12px',
            }}
            title="Zoom In"
          >
            +
          </button>
          <button 
            onClick={zoomOut}
            style={{
              ...buttonStyle,
              fontSize: '18px',
              padding: '8px 14px',
            }}
            title="Zoom Out"
          >
            -
          </button>
          <button 
            onClick={() => {
              resetView();
              setStatusMessage("View reset to center");
            }}
            style={buttonStyle}
            title="Reset View"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Status message */}
      {statusMessage && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          zIndex: 100,
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
        }}>
          {statusMessage}
        </div>
      )}

      {/* Network visualization container */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(rgba(26, 32, 44, 0.97), rgba(26, 32, 44, 0.97)), radial-gradient(circle, rgba(66, 153, 225, 0.15) 1px, transparent 1px) 0 0 / 20px 20px repeat',
        overflow: 'hidden'
      }}>
        {/* Debug center marker */}
        <div style={{
          position: 'absolute',
          left: `${timelineState.viewState.position.x - 5}px`,
          top: `${timelineState.viewState.position.y - 5}px`,
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: 'red',
          zIndex: 3
        }} />

        {/* Vertical metric axis */}
        <div className="vertical-metric-axis">
          <span>PFlops / some loose metric</span>
        </div>

        {/* SVG for connections */}
        <svg 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            overflow: 'visible'
          }}
        >
          {timelineState.connections.map((conn) => {
            // Find source and target nodes
            const sourceNode = timelineState.nodes.find(n => n.id === conn.sourceId);
            const targetNode = timelineState.nodes.find(n => n.id === conn.targetId);
            
            if (!sourceNode || !targetNode) return null;
            
            // Calculate positions
            const sourcePos = getAdjustedPosition(sourceNode);
            const targetPos = getAdjustedPosition(targetNode);
            
            // Determine if the connection is highlighted
            const isSelected = Boolean(
              timelineState.selectedNode && 
              (timelineState.selectedNode.id === conn.sourceId || 
              timelineState.selectedNode.id === conn.targetId)
            );
            
            // Get color from the source node's branch
            const color = getBranchColor(sourceNode.branchId);
            
            return (
              <line
                key={`${conn.sourceId}-${conn.targetId}`}
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke={color}
                strokeWidth={isSelected ? 3 : 2}
                strokeOpacity={isSelected ? 0.9 : 0.7}
                strokeDasharray={conn.style === 'dashed' ? '5,5' : 'none'}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {timelineState.nodes.map(node => {
          const position = getAdjustedPosition(node);
          const isSelected = timelineState.selectedNode?.id === node.id;
          const isHighlighted = isNodeHighlighted(node.id);
          const branchColor = getBranchColor(node.branchId);
          
          // Adjust size based on selection/highlight state
          const nodeSize = isSelected ? 150 : isHighlighted ? 140 : 130;
          
          return (
            <div
              key={node.id}
              className="timeline-node"
              style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -50%)',
                width: `${nodeSize}px`,
                padding: '12px',
                backgroundColor: isSelected ? branchColor : `${branchColor}dd`, // Slightly more opaque for better visibility
                color: 'white',
                borderRadius: '8px',
                boxShadow: isSelected 
                  ? `0 0 20px 3px ${branchColor}80`
                  : isHighlighted
                    ? `0 0 15px 2px ${branchColor}40`
                    : '0 4px 12px rgba(0, 0, 0, 0.4)',
                zIndex: isSelected ? 10 : 2,
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.2s ease',
                border: isSelected ? '3px solid white' : isHighlighted ? '2px solid rgba(255,255,255,0.7)' : 'none'
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling to background
                if (isSelected) {
                  clearSelectedNode();
                } else {
                  selectNode(node.id);
                }
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                {node.title}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                {node.date}
              </div>
              {isSelected && (
                <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.9 }}>
                  {node.description?.substring(0, 100)}
                  {node.description && node.description.length > 100 ? '...' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Node detail panel when a node is selected */}
      {timelineState.selectedNode && (
        <NodeDetailPanel
          node={timelineState.selectedNode}
          onClose={clearSelectedNode}
          connections={timelineState.connections.filter(
            conn => conn.sourceId === timelineState.selectedNode?.id || conn.targetId === timelineState.selectedNode?.id
          )}
          onNodeSelect={selectNode}
          allNodes={timelineState.nodes}
        />
      )}
    </div>
  );
};

export default NetworkedTimelinePage; 