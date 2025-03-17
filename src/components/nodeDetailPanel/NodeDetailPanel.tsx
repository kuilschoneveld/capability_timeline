import React from 'react';
import { TimelineEvent, TimelineConnection } from '../../types/timeline';

interface NodeDetailPanelProps {
  node: TimelineEvent;
  onClose: () => void;
  connections: TimelineConnection[];
  onNodeSelect: (nodeId: string) => void;
  allNodes: TimelineEvent[];
}

/**
 * Component for displaying detailed information about a selected node
 */
const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({
  node,
  onClose,
  connections,
  onNodeSelect,
  allNodes
}) => {
  // Get a connected node by its ID
  const getConnectedNode = (nodeId: string): TimelineEvent | undefined => {
    return allNodes.find((n: TimelineEvent) => n.id === nodeId);
  };

  // Get dimension color for thematic tags
  const getDimensionColor = (dimension: string): string => {
    switch (dimension.toLowerCase()) {
      case 'technical':
        return '#3b82f6'; // blue
      case 'societal':
        return '#10b981'; // green
      case 'philosophical':
        return '#8b5cf6'; // purple
      default:
        return '#d1d5db'; // gray
    }
  };

  return (
    <div className="node-detail-panel fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-700 shadow-xl p-6 overflow-y-auto z-50">
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      {/* Node title and date */}
      <h2 className="text-xl font-bold text-white mb-2">{node.title}</h2>
      <div className="text-sm text-gray-400 mb-4">{node.date}</div>
      
      {/* Node description */}
      <div className="mb-6">
        <p className="text-gray-300 text-sm leading-relaxed">{node.description}</p>
      </div>
      
      {/* Thematic dimensions */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Thematic Dimensions</h3>
        <div className="space-y-3">
          {Object.entries(node.thematicTags).map(([dimension, value]: [string, number]) => (
            <div key={dimension} className="flex items-center">
              <div className="w-24 text-sm capitalize text-gray-300">{dimension}</div>
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${value * 10}%`,
                    backgroundColor: getDimensionColor(dimension)
                  }}
                />
              </div>
              <div className="w-8 text-right text-xs text-gray-400 ml-2">{value}/10</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Connected nodes */}
      {connections.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Connected Events</h3>
          <div className="space-y-2">
            {connections.map(connection => {
              // Determine which node is the "other" node in the connection
              const connectedNodeId = connection.sourceId === node.id 
                ? connection.targetId 
                : connection.sourceId;
              
              const connectedNode = getConnectedNode(connectedNodeId);
              if (!connectedNode) return null;
              
              // Determine the relationship direction
              const relationshipType = connection.sourceId === node.id 
                ? "Leads to" 
                : "Follows from";
              
              return (
                <div 
                  key={connectedNodeId}
                  className="p-2 bg-gray-800 rounded border border-gray-700 hover:border-gray-500 cursor-pointer transition-colors"
                  onClick={() => onNodeSelect(connectedNodeId)}
                >
                  <div className="text-xs text-gray-400 mb-1">{relationshipType}</div>
                  <div className="text-sm font-medium text-white">{connectedNode.title}</div>
                  <div className="text-xs text-gray-500">{connectedNode.date}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeDetailPanel; 