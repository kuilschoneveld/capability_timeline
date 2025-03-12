import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

const TimelineVisualization = () => {
  // Mock data representing historical events in algorithm development
  const timelineData = [
    {
      id: "root",
      title: "Algorithmic Thinking",
      date: "300 BCE",
      description: "Euclid's Elements introduces systematic approach to mathematical problem solving",
      x: 0,
      y: 0,
      connections: ["arithmetic", "geometry"]
    },
    {
      id: "arithmetic",
      title: "Basic Arithmetic",
      date: "800 CE",
      description: "Al-Khwarizmi's work on algebra and Hindu-Arabic numerals",
      x: 1,
      y: -0.5,
      connections: ["calculus", "algebra"]
    },
    {
      id: "geometry",
      title: "Analytical Geometry",
      date: "1637 CE",
      description: "Descartes establishes coordinate system, linking algebra and geometry",
      x: 1,
      y: 0.5,
      connections: ["calculus"]
    },
    {
      id: "algebra",
      title: "Abstract Algebra",
      date: "1830 CE",
      description: "Galois develops group theory, revolutionizing algebra",
      x: 2,
      y: -1,
      connections: ["boolean"]
    },
    {
      id: "calculus",
      title: "Calculus",
      date: "1687 CE",
      description: "Newton and Leibniz develop calculus independently",
      x: 2,
      y: 0,
      connections: ["differentialEq", "numerical"]
    },
    {
      id: "boolean",
      title: "Boolean Algebra",
      date: "1854 CE",
      description: "Boole publishes 'Laws of Thought' introducing symbolic logic",
      x: 3,
      y: -1,
      connections: ["computing"]
    },
    {
      id: "computing",
      title: "Computing Theory",
      date: "1936 CE",
      description: "Turing's concept of a universal computing machine",
      x: 4,
      y: 0,
      connections: ["sorting", "searching"]
    }
  ];

  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [zoom, setZoom] = useState(1);
  const [activeNode, setActiveNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const targetPosition = useRef(position);
  
  // Space between nodes
  const baseNodeSpacing = 180;
  const nodeSpacing = baseNodeSpacing * zoom;
  
  // Zoom functions
  const zoomIn = () => setZoom(Math.min(zoom + 0.2, 2));
  const zoomOut = () => setZoom(Math.max(zoom - 0.2, 0.5));
  
  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (e.target === containerRef.current || e.target.classList.contains('connection-line')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      
      // Update target position immediately for lines
      targetPosition.current = { 
        x: targetPosition.current.x + dx, 
        y: targetPosition.current.y + dy 
      };
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Smooth animation loop for position updates
  const animate = () => {
    // Smooth transition between current position and target
    setPosition(prevPos => {
      const dx = targetPosition.current.x - prevPos.x;
      const dy = targetPosition.current.y - prevPos.y;
      
      return {
        x: Math.abs(dx) < 0.1 ? targetPosition.current.x : prevPos.x + dx * 0.5,
        y: Math.abs(dy) < 0.1 ? targetPosition.current.y : prevPos.y + dy * 0.5
      };
    });
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Setup and cleanup animation frame
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);
  
  // Add event listeners for mouse drag
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);
  
  // Sync target position when position changes directly (like from zoom)
  useEffect(() => {
    targetPosition.current = position;
  }, [zoom]);
  
  // Calculate node position
  const getNodePosition = (node) => {
    return {
      left: position.x + node.x * nodeSpacing,
      top: position.y + node.y * nodeSpacing
    };
  };
  
  // Handle node click
  const handleNodeClick = (e, nodeId) => {
    e.stopPropagation();
    setActiveNode(nodeId === activeNode ? null : nodeId);
  };
  
  // Draw connections between nodes
  const renderConnections = () => {
    return timelineData.flatMap(node => 
      node.connections.map(targetId => {
        const target = timelineData.find(n => n.id === targetId);
        if (!target) return null;
        
        const sourcePos = getNodePosition(node);
        const targetPos = getNodePosition(target);
        
        // Calculate center points of nodes
        const sourceX = sourcePos.left + 20;
        const sourceY = sourcePos.top + 20;
        const targetX = targetPos.left + 20;
        const targetY = targetPos.top + 20;
        
        // Calculate line length
        const length = Math.sqrt(Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2));
        const angle = Math.atan2(targetY - sourceY, targetX - sourceX) * 180 / Math.PI;
        
        return (
          <div 
            key={`${node.id}-${targetId}`}
            className="absolute h-0.5 bg-gray-400 origin-left connection-line"
            style={{
              left: sourceX,
              top: sourceY,
              width: length,
              transform: `rotate(${angle}deg)`,
              opacity: 0.8,
              zIndex: 0
            }}
          />
        );
      })
    );
  };
  
  return (
    <div className="flex flex-col w-full h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 bg-gray-800">
        <h1 className="text-xl font-bold">Algorithm Development Timeline</h1>
        <p className="text-sm text-gray-400">Click and drag to navigate the timeline</p>
      </div>
      
      {/* Timeline container */}
      <div 
        ref={containerRef}
        className="relative flex-1 overflow-hidden cursor-grab"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
      >
        {/* Render connections first (below nodes) */}
        {renderConnections()}
        
        {/* Render nodes */}
        {timelineData.map(node => {
          const nodePos = getNodePosition(node);
          return (
            <div 
              key={node.id}
              className={`absolute w-40 rounded-lg p-2 border transition-transform duration-100 cursor-pointer z-10
                        ${activeNode === node.id ? 'border-blue-400 shadow-lg' : 'border-gray-600'}
                        ${node.id === 'computing' ? 'bg-green-700' : 'bg-gray-800'}`}
              style={{
                left: nodePos.left,
                top: nodePos.top,
                transform: activeNode === node.id ? 'scale(1.05)' : 'scale(1)'
              }}
              onClick={(e) => handleNodeClick(e, node.id)}
            >
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <span className="font-bold text-sm">{node.title}</span>
                  <span className="text-xs text-gray-400">{node.date}</span>
                </div>
                {activeNode === node.id && (
                  <p className="text-xs mt-1 text-gray-300">{node.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Controls */}
      <div className="p-4 bg-gray-800 flex justify-center gap-4">
        <button onClick={zoomIn} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
          <ZoomIn size={20} />
        </button>
        <button onClick={zoomOut} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
          <ZoomOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default TimelineVisualization;
