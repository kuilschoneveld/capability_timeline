import React, { useState, useCallback, useEffect } from 'react';

/**
 * An enhanced basic test page with dragging functionality and more nodes
 */
const BasicTestPage: React.FC = () => {
  // State for panning the view
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  // Add zoom state
  const [zoom, setZoom] = useState(1);
  // Add state for hiding future branches
  const [hideFutureBranches, setHideFutureBranches] = useState(false);
  
  // To store window dimensions
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

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

  // Static test data - timeline nodes with position and branch information
  const testNodes = [
    { id: 'node1', title: 'ENIAC (1945)', x: 100, y: 200, branch: 'main' },
    { id: 'node2', title: 'Stored Program (1948)', x: 250, y: 200, branch: 'main' },
    { id: 'node3', title: 'UNIVAC I (1951)', x: 400, y: 200, branch: 'main' },
    { id: 'node4', title: 'Transistors (1953)', x: 550, y: 200, branch: 'main' },
    { id: 'node5', title: 'Integrated Circuit (1958)', x: 700, y: 200, branch: 'main' },
    { id: 'node6', title: 'AI Workshop (1956)', x: 300, y: 100, branch: 'ai' },
    { id: 'node7', title: 'Perceptron (1958)', x: 450, y: 100, branch: 'ai' },
    { id: 'node8', title: 'ELIZA (1966)', x: 600, y: 100, branch: 'ai' },
    { id: 'node9', title: 'ARPANET (1969)', x: 500, y: 300, branch: 'web' },
    { id: 'node10', title: 'World Wide Web (1989)', x: 650, y: 300, branch: 'web' }
  ];

  // Define connections between nodes
  const connections = [
    { from: 'node1', to: 'node2', type: 'solid' },
    { from: 'node2', to: 'node3', type: 'solid' },
    { from: 'node3', to: 'node4', type: 'solid' },
    { from: 'node4', to: 'node5', type: 'solid' },
    { from: 'node3', to: 'node6', type: 'dashed' },
    { from: 'node6', to: 'node7', type: 'solid' },
    { from: 'node7', to: 'node8', type: 'solid' },
    { from: 'node4', to: 'node9', type: 'dashed' },
    { from: 'node9', to: 'node10', type: 'solid' },
    { from: 'node5', to: 'node10', type: 'dashed' }
  ];

  // Define which branches are "future" branches (for demo purposes)
  const futureBranches = ['ai', 'web'];

  // Get filtered nodes based on hideFutureBranches state
  const getFilteredNodes = () => {
    if (!hideFutureBranches) return testNodes;
    return testNodes.filter(node => !futureBranches.includes(node.branch));
  };

  // Get filtered connections based on hideFutureBranches state
  const getFilteredConnections = () => {
    if (!hideFutureBranches) return connections;
    
    // Get IDs of visible nodes
    const visibleNodeIds = getFilteredNodes().map(node => node.id);
    
    // Only keep connections where both source and target nodes are visible
    return connections.filter(conn => {
      return visibleNodeIds.includes(conn.from) && visibleNodeIds.includes(conn.to);
    });
  };

  // Toggle hide future branches
  const toggleFutureBranches = () => {
    setHideFutureBranches(prev => !prev);
  };

  // Branch colors
  const branchColors = {
    main: '#3b82f6', // Blue
    ai: '#8b5cf6',   // Purple
    web: '#10b981'   // Green
  };

  // Mouse event handlers for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Don't initiate drag if clicking on interactive elements
    if ((e.target as Element).closest('button')) {
      return;
    }
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    document.body.style.cursor = 'grabbing';
    
    // Prevent default to avoid text selection during drag
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setViewPosition(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
  }, []);

  // Reset view to center
  const resetView = useCallback(() => {
    setViewPosition({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  // Zoom in
  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 2)); // Max zoom is 2x
  }, []);

  // Zoom out
  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.5)); // Min zoom is 0.5x
  }, []);

  // Find a node by ID
  const getNodeById = (id: string) => testNodes.find(node => node.id === id);

  // Calculate adjusted position with the view offset and zoom
  const getAdjustedPosition = (x: number, y: number) => {
    // Use window center as the zoom origin
    const centerX = windowDimensions.width / 2;
    const centerY = windowDimensions.height / 2;
    
    // Apply zoom and pan
    return {
      x: (x - centerX) * zoom + centerX + viewPosition.x,
      y: (y - centerY) * zoom + centerY + viewPosition.y
    };
  };

  // Common button style based on the image
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

  // Get the visible nodes and connections
  const filteredNodes = getFilteredNodes();
  const filteredConnections = getFilteredConnections();

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
      {/* Page header */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        Basic Network Test (Draggable)
      </div>

      {/* Future branches toggle button */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 10,
      }}>
        <button 
          style={buttonStyle}
          onClick={toggleFutureBranches}
        >
          {hideFutureBranches ? 'Show Future Branches' : 'Hide Future Branches'}
        </button>
      </div>

      {/* Status display */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: '20px',
        zIndex: 10,
        color: 'white',
        fontSize: '14px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: '8px',
        borderRadius: '4px',
      }}>
        Zoom: {zoom.toFixed(1)}x
      </div>

      {/* Network visualization container */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
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
          {filteredConnections.map((conn, idx) => {
            const fromNode = getNodeById(conn.from);
            const toNode = getNodeById(conn.to);
            
            if (!fromNode || !toNode) return null;
            
            const fromPos = getAdjustedPosition(fromNode.x, fromNode.y);
            const toPos = getAdjustedPosition(toNode.x, toNode.y);
            
            // Get color from the source node's branch
            const color = branchColors[fromNode.branch as keyof typeof branchColors] || '#888';
            
            return (
              <line
                key={idx}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={color}
                strokeWidth={2}
                strokeOpacity={0.8}
                strokeDasharray={conn.type === 'dashed' ? '5,5' : 'none'}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {filteredNodes.map(node => {
          const pos = getAdjustedPosition(node.x, node.y);
          const branchColor = branchColors[node.branch as keyof typeof branchColors];
          // Scale node size based on zoom
          const nodeWidth = 140 * (1 / Math.max(zoom, 0.8));
          
          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -50%)',
                width: `${nodeWidth}px`,
                padding: '10px',
                backgroundColor: `${branchColor}`,
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                zIndex: 2,
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'transform 0.1s ease, box-shadow 0.1s ease'
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling to background
                console.log(`Clicked: ${node.title}`);
              }}
            >
              {node.title}
            </div>
          );
        })}
      </div>

      {/* Control panel */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 10,
        display: 'flex',
        gap: '10px'
      }}>
        <button 
          style={{
            ...buttonStyle,
            fontSize: '18px',
            padding: '8px 14px',
          }}
          onClick={zoomOut}
          title="Zoom Out"
        >
          –
        </button>

        <button 
          style={{
            ...buttonStyle,
            fontSize: '18px',
            padding: '8px 12px',
          }}
          onClick={zoomIn}
          title="Zoom In"
        >
          +
        </button>

        <button 
          style={buttonStyle}
          onClick={resetView}
        >
          Reset View
        </button>
      </div>
    </div>
  );
};

export default BasicTestPage; 