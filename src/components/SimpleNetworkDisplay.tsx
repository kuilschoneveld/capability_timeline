import React from 'react';

/**
 * A completely standalone network visualization component
 * Uses only inline styles with no external dependencies or complex calculations
 */
const SimpleNetworkDisplay: React.FC = () => {
  // Hardcoded nodes and connections for simplicity
  const nodes = [
    { id: 1, title: "First Computer", x: 150, y: 100 },
    { id: 2, title: "Transistors", x: 300, y: 100 },
    { id: 3, title: "Integrated Circuits", x: 450, y: 100 },
    { id: 4, title: "Personal Computing", x: 300, y: 250 },
    { id: 5, title: "Internet", x: 450, y: 250 }
  ];

  const connections = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 5 },
    { from: 4, to: 5 }
  ];

  // Simple function to get node by id
  const getNodeById = (id: number) => nodes.find(node => node.id === id);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      backgroundColor: '#111',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '10px',
        backgroundColor: '#222',
        color: 'white',
        textAlign: 'center',
        zIndex: 10
      }}>
        <h1>Simple Network Visualization</h1>
      </div>

      {/* Network container */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: 0,
        right: 0,
        bottom: 0
      }}>
        {/* SVG for connections */}
        <svg width="100%" height="100%" style={{ position: 'absolute' }}>
          {connections.map((conn, idx) => {
            const fromNode = getNodeById(conn.from);
            const toNode = getNodeById(conn.to);
            
            if (!fromNode || !toNode) return null;
            
            return (
              <line
                key={idx}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="white"
                strokeWidth={2}
                strokeOpacity={0.6}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map(node => (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: `${node.x}px`,
              top: `${node.y}px`,
              transform: 'translate(-50%, -50%)',
              width: '120px',
              padding: '10px',
              backgroundColor: '#0066cc',
              color: 'white',
              borderRadius: '5px',
              textAlign: 'center',
              fontWeight: 'bold',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
            }}
          >
            {node.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleNetworkDisplay; 