import React, { useState, useEffect, useCallback } from 'react';
import { useNetworkedTimeline } from '../../hooks/useNetworkedTimeline';
import { TimelineNode, TimelineConnection } from '../../types/networkedTimeline';
import NodeDetailPanel from '../nodeDetailPanel/NodeDetailPanel';
import './NetworkedTimeline.css';
import timelineEvents from '../../data/timelineDatabase';

interface NetworkedTimelineProps {
  initialSearchTerm?: string;
}

/**
 * NetworkedTimeline component with simplified rendering approach to ensure visibility
 */
const NetworkedTimeline: React.FC<NetworkedTimelineProps> = ({ initialSearchTerm = '' }) => {
  // Initialize timeline state with custom hook
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

  // Local state for search functionality
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchResults, setSearchResults] = useState<TimelineNode[]>([]);
  
  // State for tracking dragging
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Define branch colors
  const branchColors: { [key: string]: string } = {
    'main': '#3b82f6',    // Blue
    'ai': '#8b5cf6',      // Purple
    'web': '#10b981',     // Green
    'mobile': '#f59e0b',  // Amber
    'quantum': '#ec4899',  // Pink
    'other': '#6b7280',   // Gray
  };

  // Reset view on initial load
  useEffect(() => {
    console.log('NetworkedTimeline mounted');
    resetView();
  }, [resetView]);

  // Handle search change
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      const results = searchNodes(term);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchNodes]);

  // Handle search result selection
  const handleSearchResultClick = useCallback((nodeId: string) => {
    selectNode(nodeId);
    centerOnNode(nodeId);
    setSearchResults([]);
    setSearchTerm('');
  }, [selectNode, centerOnNode]);

  // Mouse event handlers for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only respond to left mouse button
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    
    // Change cursor style
    document.body.style.cursor = 'grabbing';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !timelineState) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    // Update view position using position from state
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
    document.body.style.cursor = 'default';
  }, []);

  // Get color for a branch
  const getBranchColor = useCallback((branchId: string) => {
    return branchColors[branchId] || branchColors.other;
  }, [branchColors]);

  // Check if a node is highlighted because it's connected to the selected node
  const isNodeHighlighted = useCallback((nodeId: string) => {
    if (!timelineState?.selectedNode) return false;
    
    return timelineState.connections.some(conn => 
      (conn.sourceId === timelineState.selectedNode?.id && conn.targetId === nodeId) ||
      (conn.targetId === timelineState.selectedNode?.id && conn.sourceId === nodeId)
    );
  }, [timelineState?.selectedNode, timelineState?.connections]);

  // Calculate position accounting for view position and zoom
  const getAdjustedPosition = useCallback((node: TimelineNode) => {
    if (!timelineState) return { x: 0, y: 0 };
    
    const { position, zoom } = timelineState.viewState;
    
    return {
      x: node.position.x * zoom + position.x,
      y: node.position.y * zoom + position.y
    };
  }, [timelineState]);

  // Render loading and error states
  if (isLoading) return <div className="loading-container">Loading timeline data...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;
  if (!timelineState) return <div className="error-container">Timeline data is not available</div>;

  return (
    <div className="networked-timeline-container" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#0f172a' }}>
      {/* Header with search and controls */}
      <div className="timeline-header" style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        padding: '16px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(4px)',
        zIndex: 50
      }}>
        {/* Search input */}
        <div className="search-container" style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search timeline..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              backgroundColor: '#1e293b',
              color: 'white',
              border: '1px solid #334155',
              borderRadius: '4px',
              padding: '8px 12px',
              width: '250px'
            }}
          />
          
          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '0 0 4px 4px',
              marginTop: '4px',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 51
            }}>
              {searchResults.map(node => (
                <div
                  key={node.id}
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid #334155',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2d3748')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  onClick={() => handleSearchResultClick(node.id)}
                >
                  <div style={{ fontWeight: 'bold' }}>{node.title}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>{node.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* View controls */}
        <div className="controls" style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={zoomIn} 
            style={{ 
              backgroundColor: '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              padding: '8px 12px',
              cursor: 'pointer'
            }}
          >
            +
          </button>
          <button 
            onClick={zoomOut} 
            style={{ 
              backgroundColor: '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              padding: '8px 12px',
              cursor: 'pointer'
            }}
          >
            -
          </button>
          <button 
            onClick={resetView} 
            style={{ 
              backgroundColor: '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              padding: '8px 12px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main network visualization area */}
      <div 
        className="network-container"
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: isDragging ? 'grabbing' : 'grab',
          background: 'linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95)), radial-gradient(circle, rgba(25, 33, 52, 0.4) 1px, transparent 1px) 0 0 / 20px 20px repeat'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* SVG Container for connections */}
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
          {/* Debug center marker */}
          <circle 
            cx={timelineState.viewState.position.x} 
            cy={timelineState.viewState.position.y} 
            r={5} 
            fill="red" 
          />
          
          {/* Render connections */}
          {timelineState.connections.map(connection => {
            // Find source and target nodes
            const sourceNode = timelineState.nodes.find(n => n.id === connection.sourceId);
            const targetNode = timelineState.nodes.find(n => n.id === connection.targetId);
            
            if (!sourceNode || !targetNode) return null;
            
            // Calculate positions
            const sourcePos = getAdjustedPosition(sourceNode);
            const targetPos = getAdjustedPosition(targetNode);
            
            // Determine highlighting
            const isSelected = Boolean(
              timelineState.selectedNode && 
              (timelineState.selectedNode.id === connection.sourceId || 
              timelineState.selectedNode.id === connection.targetId)
            );
            
            // Get branch color
            const color = getBranchColor(sourceNode.branchId);
            
            return (
              <line
                key={`${connection.sourceId}-${connection.targetId}`}
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke={color}
                strokeWidth={isSelected ? 3 : 2}
                strokeOpacity={isSelected ? 0.9 : 0.6}
                strokeDasharray={connection.style === 'dashed' ? '5,5' : 'none'}
              />
            );
          })}
        </svg>
        
        {/* Render nodes */}
        {timelineState.nodes.map(node => {
          const position = getAdjustedPosition(node);
          const isSelected = timelineState.selectedNode?.id === node.id;
          const isHighlighted = isNodeHighlighted(node.id);
          const branchColor = getBranchColor(node.branchId);
          
          // Adjust size based on selection/highlight state
          const nodeSize = isSelected ? 140 : isHighlighted ? 130 : 120;
          
          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -50%)',
                width: `${nodeSize}px`,
                padding: '12px',
                backgroundColor: isSelected ? branchColor : `${branchColor}99`, // Add transparency if not selected
                borderRadius: '8px',
                color: 'white',
                boxShadow: isSelected 
                  ? `0 0 15px 2px ${branchColor}80` 
                  : isHighlighted 
                    ? `0 0 10px 1px ${branchColor}40`
                    : '0 2px 10px rgba(0, 0, 0, 0.3)',
                zIndex: isSelected ? 10 : 2,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: isSelected ? '2px solid white' : isHighlighted ? '1px solid rgba(255,255,255,0.5)' : 'none',
                userSelect: 'none'
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent dragging when clicking nodes
                selectNode(node.id);
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
                  {node.description?.substring(0, 80)}
                  {node.description && node.description.length > 80 ? '...' : ''}
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

export default NetworkedTimeline; 