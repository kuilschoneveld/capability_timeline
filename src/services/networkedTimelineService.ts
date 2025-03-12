import { 
  TimelineNode,
  NetworkedTimelineBranch,
  NetworkedTimelineState,
  ThematicTags
} from '../types/networkedTimeline';
import {
  timelineNodes,
  timelineBranches,
  initialNetworkedTimelineState
} from '../data/networkedMockData';

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
  async getAllBranches(): Promise<Record<string, NetworkedTimelineBranch>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return timelineBranches;
  }
  
  /**
   * Get a specific branch by ID
   */
  async getBranchById(branchId: string): Promise<NetworkedTimelineBranch | undefined> {
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
  async getAllConnections(): Promise<{sourceId: string, targetId: string}[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const connections: {sourceId: string, targetId: string}[] = [];
    
    // Collect all connections from nodes
    Object.values(timelineNodes).forEach(node => {
      node.connections.forEach(targetId => {
        connections.push({
          sourceId: node.id,
          targetId
        });
      });
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
   * Get the initial state for the networked timeline
   */
  async getInitialState(): Promise<NetworkedTimelineState> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return initialNetworkedTimelineState;
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
   * Calculate impact score for a node based on its connections
   */
  async calculateNodeImpact(nodeId: string): Promise<number> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simplified impact calculation based on:
    // 1. Number of direct outgoing connections
    // 2. Number of incoming connections (how many other nodes reference this one)
    // 3. Sum of thematic tag values
    
    const node = timelineNodes[nodeId];
    if (!node) return Promise.resolve(0);
    
    // Count outgoing connections
    const outgoingCount = node.connections.length;
    
    // Count incoming connections
    const incomingCount = Object.values(timelineNodes)
      .filter(n => n.connections.includes(nodeId))
      .length;
    
    // Sum thematic tags
    const thematicSum = Object.values(node.thematicTags).reduce((sum, val) => sum + val, 0);
    
    // Weighted impact score
    return Promise.resolve(outgoingCount * 2 + incomingCount * 3 + thematicSum * 0.5);
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
  
  /**
   * Add a connection between two nodes
   */
  async addConnection(sourceId: string, targetId: string): Promise<boolean> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const sourceNode = timelineNodes[sourceId];
    const targetNode = timelineNodes[targetId];
    
    if (sourceNode && targetNode) {
      // Add connection if it doesn't already exist
      if (!sourceNode.connections.includes(targetId)) {
        sourceNode.connections.push(targetId);
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Remove a connection between two nodes
   */
  async removeConnection(sourceId: string, targetId: string): Promise<boolean> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const sourceNode = timelineNodes[sourceId];
    
    if (sourceNode) {
      // Remove connection if it exists
      const initialLength = sourceNode.connections.length;
      sourceNode.connections = sourceNode.connections.filter(id => id !== targetId);
      
      return sourceNode.connections.length < initialLength;
    }
    
    return false;
  }
} 