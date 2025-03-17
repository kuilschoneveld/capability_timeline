import {
  TimelineNode,
  TimelineConnection,
  TimelineBranch,
  NetworkedTimelineState
} from '../types/networkedTimeline';

import {
  mockTimelineState,
  nodes as timelineNodes,
  connections as timelineConnections,
  timelineBranches
} from '../data/networkedMockData';

// Get all nodes for a specific branch
export const getNodesForBranch = async (branchId: string): Promise<TimelineNode[]> => {
  return Object.values(timelineNodes).filter(node => node.branchId === branchId);
};

// Get all connections between nodes
export const getConnections = async (): Promise<TimelineConnection[]> => {
  return timelineConnections;
};

// Get incoming connections for a node
export const getIncomingConnections = async (nodeId: string): Promise<string[]> => {
  return Object.values(timelineNodes)
    .filter(node => node.connections?.includes(nodeId) ?? false)
    .map(node => node.id);
};

// Get the initial timeline state
export const getInitialState = async (): Promise<NetworkedTimelineState> => {
  return mockTimelineState;
};

// Filter nodes based on various criteria
export const filterNodes = async (
  dimension: string,
  threshold: number,
  dateRange: [Date, Date] | null = null
): Promise<TimelineNode[]> => {
  let filteredNodes = Object.values(timelineNodes)
    .filter(node => node.branchId === 'main');

  // Apply thematic filter if dimension is provided
  if (dimension && threshold > 0) {
    filteredNodes = filteredNodes.filter(node =>
      node.thematicTags[dimension] !== undefined &&
      node.thematicTags[dimension] >= threshold
    );
  }

  // Apply date range filter if provided
  if (dateRange) {
    const [startDate, endDate] = dateRange;
    filteredNodes = filteredNodes.filter(node => {
      const nodeDate = new Date(node.date);
      return nodeDate >= startDate && nodeDate <= endDate;
    });
  }

  return filteredNodes;
};

// Search nodes by title or description
export const searchNodes = async (term: string): Promise<TimelineNode[]> => {
  const searchTerm = term.toLowerCase();
  return Object.values(timelineNodes).filter(node =>
    node.title.toLowerCase().includes(searchTerm) ||
    node.description.toLowerCase().includes(searchTerm)
  );
};

// Calculate node importance based on connections and thematic tags
export const calculateNodeImportance = async (nodeId: string): Promise<number> => {
  const node = timelineNodes[nodeId];
  if (!node) return 0;

  // Count outgoing connections
  const outgoingCount = node.connections?.length ?? 0;

  // Count incoming connections
  const incomingCount = Object.values(timelineNodes)
    .filter(node => node.connections?.includes(nodeId) ?? false)
    .length;

  // Sum thematic tag values
  const thematicSum = Object.values(node.thematicTags).reduce((sum, val) => sum + val, 0);

  // Return weighted importance score
  return Promise.resolve(outgoingCount * 2 + incomingCount * 3 + thematicSum * 0.5);
};

// Add a new node to the timeline
export const addNode = async (node: TimelineNode): Promise<TimelineNode> => {
  const newNode: TimelineNode = {
    ...node,
    connections: []
  };
  
  timelineNodes[node.id] = newNode;
  return newNode;
};

// Remove a node and its connections
export const removeNode = async (nodeId: string): Promise<void> => {
  // Remove the node's connections from other nodes
  Object.values(timelineNodes).forEach(node => {
    node.connections = node.connections ?? [];
    node.connections = node.connections.filter(id => id !== nodeId);
  });

  // Remove the node from branch nodeIds
  Object.values(timelineBranches).forEach(branch => {
    branch.nodeIds = branch.nodeIds.filter(id => id !== nodeId);
  });

  // Delete the node
  delete timelineNodes[nodeId];
};

// Add a connection between nodes
export const addConnection = async (sourceId: string, targetId: string): Promise<void> => {
  const sourceNode = timelineNodes[sourceId];
  if (!sourceNode) throw new Error(`Source node ${sourceId} not found`);

  sourceNode.connections = sourceNode.connections ?? [];
  if (!sourceNode.connections.includes(targetId)) {
    sourceNode.connections.push(targetId);
  }
};

// Remove a connection between nodes
export const removeConnection = async (sourceId: string, targetId: string): Promise<void> => {
  const sourceNode = timelineNodes[sourceId];
  if (!sourceNode) return;

  sourceNode.connections = sourceNode.connections ?? [];
  sourceNode.connections = sourceNode.connections.filter(id => id !== targetId);
};

/**
 * NetworkedTimelineService provides methods for manipulating and querying timeline data
 */
export class NetworkedTimelineService {
  /**
   * Get all nodes in the timeline
   */
  async getAllNodes(): Promise<Record<string, TimelineNode>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return timelineNodes;
  }
  
  /**
   * Get a specific node by its ID
   */
  async getNodeById(nodeId: string): Promise<TimelineNode | undefined> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return timelineNodes[nodeId];
  }
  
  /**
   * Get all branches in the timeline
   */
  async getAllBranches(): Promise<Record<string, TimelineBranch>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return timelineBranches;
  }
  
  /**
   * Get a specific branch by ID
   */
  async getBranchById(branchId: string): Promise<TimelineBranch | undefined> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return timelineBranches[branchId];
  }
  
  /**
   * Get all nodes in a specific branch
   */
  async getNodesByBranch(branchId: string): Promise<TimelineNode[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 400));
    return Object.values(timelineNodes).filter(node => node.branchId === branchId);
  }
  
  /**
   * Get all connections between nodes
   */
  async getAllConnections(): Promise<TimelineConnection[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const connections: TimelineConnection[] = [];
    
    // Collect all connections from nodes
    Object.values(timelineNodes).forEach((node: TimelineNode) => {
      if (node.connections) {
        node.connections.forEach((targetId: string) => {
          connections.push({
            id: `${node.id}-${targetId}`,
            sourceId: node.id,
            targetId
          });
        });
      }
    });
    
    return connections;
  }
  
  /**
   * Get all connections for a specific node
   */
  async getNodeConnections(nodeId: string): Promise<{
    outgoing: string[],
    incoming: string[]
  }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const node = timelineNodes[nodeId];
    const outgoing = node ? node.connections : [];
    
    // Find all nodes that connect to this node
    const incoming = Object.values(timelineNodes)
      .filter(n => n.connections.includes(nodeId))
      .map(n => n.id);
    
    return { outgoing, incoming };
  }
  
  /**
   * Filter nodes based on criteria
   */
  async filterNodes(
    filter: {
      thematicDimensions: Record<string, boolean>,
      minThresholds: Record<string, number>,
      showBranches: boolean,
      dateRange?: { start: string, end: string }
    }
  ): Promise<Record<string, TimelineNode>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Start with all nodes
    let filteredNodes = { ...timelineNodes };
    
    // Filter by branch visibility
    if (!filter.showBranches) {
      // Only show main timeline if branches are hidden
      filteredNodes = Object.fromEntries(
        Object.entries(filteredNodes)
          .filter(([_, node]) => node.branchId === 'main')
      );
    }
    
    // Filter by thematic dimensions
    if (filter.thematicDimensions) {
      // For each active dimension, check if the node meets the threshold
      Object.entries(filter.thematicDimensions).forEach(([dimension, isActive]) => {
        if (isActive && filter.minThresholds[dimension] !== undefined) {
          const threshold = filter.minThresholds[dimension];
          filteredNodes = Object.fromEntries(
            Object.entries(filteredNodes)
              .filter(([_, node]) => 
                node.thematicTags[dimension] !== undefined && 
                node.thematicTags[dimension] >= threshold
              )
          );
        }
      });
    }
    
    // Filter by date range if provided
    if (filter.dateRange) {
      const { start, end } = filter.dateRange;
      filteredNodes = Object.fromEntries(
        Object.entries(filteredNodes)
          .filter(([_, node]) => {
            const nodeDate = new Date(node.date);
            return (
              (!start || nodeDate >= new Date(start)) && 
              (!end || nodeDate <= new Date(end))
            );
          })
      );
    }
    
    return filteredNodes;
  }
  
  /**
   * Search nodes by title and description
   */
  async searchNodes(searchTerm: string): Promise<TimelineNode[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Case-insensitive search
    const term = searchTerm.toLowerCase();
    
    return Object.values(timelineNodes).filter(node => 
      node.title.toLowerCase().includes(term) || 
      node.description.toLowerCase().includes(term)
    );
  }
  
  /**
   * Find a path between two nodes
   */
  async findPath(startNodeId: string, endNodeId: string): Promise<string[] | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Implementation of breadth-first search to find the shortest path
    const visited = new Set<string>();
    const queue: { nodeId: string, path: string[] }[] = [{ nodeId: startNodeId, path: [startNodeId] }];
    
    while (queue.length > 0) {
      const { nodeId, path } = queue.shift()!;
      
      if (nodeId === endNodeId) {
        return path;
      }
      
      if (!visited.has(nodeId)) {
        visited.add(nodeId);
        
        const node = timelineNodes[nodeId];
        if (node) {
          for (const nextNodeId of node.connections) {
            if (!visited.has(nextNodeId)) {
              queue.push({ nodeId: nextNodeId, path: [...path, nextNodeId] });
            }
          }
        }
      }
    }
    
    // No path found
    return null;
  }
  
  /**
   * Get all nodes that are reachable from a starting node
   */
  async getReachableNodes(startNodeId: string): Promise<string[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const visited = new Set<string>();
    const queue: string[] = [startNodeId];
    
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      
      if (!visited.has(nodeId)) {
        visited.add(nodeId);
        
        const node = timelineNodes[nodeId];
        if (node) {
          for (const nextNodeId of node.connections) {
            if (!visited.has(nextNodeId)) {
              queue.push(nextNodeId);
            }
          }
        }
      }
    }
    
    return Array.from(visited);
  }
  
  /**
   * Save a timeline node (create or update)
   */
  async saveNode(node: TimelineNode): Promise<TimelineNode> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real implementation, this would save to a database
    // Here we just update our in-memory data
    timelineNodes[node.id] = {
      ...node,
      // Ensure any missing fields have defaults
      connections: node.connections || []
    };
    
    return timelineNodes[node.id];
  }
  
  /**
   * Delete a timeline node
   */
  async deleteNode(nodeId: string): Promise<boolean> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // In a real implementation, this would delete from a database
    if (timelineNodes[nodeId]) {
      // Remove the node
      delete timelineNodes[nodeId];
      
      // Remove references to this node from other nodes' connections
      Object.values(timelineNodes).forEach(node => {
        node.connections = node.connections.filter(id => id !== nodeId);
      });
      
      // Remove from branch nodeIds
      Object.values(timelineBranches).forEach(branch => {
        branch.nodeIds = branch.nodeIds.filter(id => id !== nodeId);
      });
      
      return true;
    }
    
    return false;
  }
} 