import React, { useState, useCallback } from 'react';

/**
 * An enhanced basic test page with dragging functionality and more nodes
 */
const BasicTestPage: React.FC = () => {
  // State for panning the view
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

  // Branch colors
  const branchColors = {
    main: '#3b82f6', // Blue
    ai: '#8b5cf6',   // Purple
    web: '#10b981'   // Green
  };

  // Mouse event handlers for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
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
  }, []);

  // Reset view to center
  const resetView = useCallback(() => {
    setViewPosition({ x: 0, y: 0 });
  }, []);

  // Find a node by ID
  const getNodeById = (id: string) => testNodes.find(node => node.id === id);

  // Calculate adjusted position with the view offset
  const getAdjustedPosition = (x: number, y: number) => ({
    x: x + viewPosition.x,
    y: y + viewPosition.y
  });

  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#1a202c',
        position: 'relative',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab'
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

      {/* Network visualization container */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%'
      }}>
        {/* SVG for connections */}
        <svg 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
        >
          {connections.map((conn, idx) => {
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
        {testNodes.map(node => {
          const pos = getAdjustedPosition(node.x, node.y);
          const branchColor = branchColors[node.branch as keyof typeof branchColors];
          
          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -50%)',
                width: '140px',
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
            backgroundColor: '#4299e1',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={resetView}
        >
          Reset View
        </button>
      </div>
    </div>
  );
};

export default BasicTestPage; 