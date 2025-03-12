import { 
  TimelineNode, 
  TimelineConnection, 
  TimelineBranch,
  NetworkedTimelineBranch, 
  NetworkConfig,
  NetworkedTimelineState
} from '../types/networkedTimeline';

/**
 * Default network configuration
 */
export const defaultNetworkConfig: NetworkConfig = {
  nodeSize: 40,
  nodeBorderWidth: 2,
  connectionLineWidth: 2,
  connectionLineOpacity: 0.7,
  
  springLength: 180,
  springStrength: 0.1,
  repulsionStrength: 300,
  
  zoomRange: [0.5, 2],
  initialZoom: 0.8,
  
  defaultNodeColor: '#4B6BFF',
  defaultLineColor: '#8a8a8a',
  
  highlightConnections: true
};

/**
 * Mock data for the networked timeline visualization
 */

// Define branches for the timeline
export const branches: Record<string, TimelineBranch> = {
  main: {
    id: 'main',
    name: 'Main Timeline',
    description: 'The primary timeline of capability development',
    color: '#3b82f6', // Blue
    nodeIds: ['node1', 'node2', 'node3', 'node4', 'node5']
  },
  ai: {
    id: 'ai',
    name: 'AI Development',
    description: 'Major milestones in artificial intelligence',
    color: '#8b5cf6', // Purple
    nodeIds: ['node6', 'node7', 'node8']
  },
  web: {
    id: 'web',
    name: 'Web Technologies',
    description: 'Evolution of web technologies',
    color: '#10b981', // Green
    nodeIds: ['node9', 'node10']
  }
};

// Define nodes with more spread out positions
export const nodes: TimelineNode[] = [
  {
    id: 'node1',
    title: 'ENIAC First General-Purpose Computer',
    date: '1945-02-15',
    description: 'The first electronic general-purpose computer, capable of being programmed to solve a wide range of computing problems.',
    position: { x: 100, y: 200 },
    branchId: 'main',
    thematicTags: {
      technical: 9,
      societal: 7,
      philosophical: 5
    }
  },
  {
    id: 'node2',
    title: 'First Stored Program',
    date: '1948-06-21',
    description: 'The Manchester Small-Scale Experimental Machine (SSEM) ran the world\'s first stored program.',
    position: { x: 300, y: 200 },
    branchId: 'main',
    thematicTags: {
      technical: 8,
      societal: 6,
      philosophical: 4
    }
  },
  {
    id: 'node3',
    title: 'UNIVAC I First Commercial Computer',
    date: '1951-06-14',
    description: 'The first commercial computer produced in the United States, designed principally by J. Presper Eckert and John Mauchly.',
    position: { x: 500, y: 200 },
    branchId: 'main',
    thematicTags: {
      technical: 7,
      societal: 8,
      philosophical: 3
    }
  },
  {
    id: 'node4',
    title: 'Transistor Computers',
    date: '1953-11-01',
    description: 'The first transistor computers were developed, replacing vacuum tubes with transistors.',
    position: { x: 700, y: 200 },
    branchId: 'main',
    thematicTags: {
      technical: 8,
      societal: 7,
      philosophical: 2
    }
  },
  {
    id: 'node5',
    title: 'Integrated Circuit',
    date: '1958-09-12',
    description: 'The first working integrated circuit was demonstrated by Jack Kilby at Texas Instruments.',
    position: { x: 900, y: 200 },
    branchId: 'main',
    thematicTags: {
      technical: 9,
      societal: 8,
      philosophical: 3
    }
  },
  {
    id: 'node6',
    title: 'First AI Workshop at Dartmouth',
    date: '1956-08-31',
    description: 'The Dartmouth Conference was the first workshop on artificial intelligence, marking the birth of AI as a field.',
    position: { x: 400, y: 50 },
    branchId: 'ai',
    thematicTags: {
      technical: 6,
      societal: 5,
      philosophical: 8
    }
  },
  {
    id: 'node7',
    title: 'Perceptron Neural Network',
    date: '1958-01-01',
    description: 'Frank Rosenblatt created the perceptron, a type of artificial neural network, the first implementation of a learning algorithm.',
    position: { x: 600, y: 50 },
    branchId: 'ai',
    thematicTags: {
      technical: 7,
      societal: 4,
      philosophical: 7
    }
  },
  {
    id: 'node8',
    title: 'ELIZA - Early Natural Language Processing',
    date: '1966-01-01',
    description: 'ELIZA was one of the first chatbots that could simulate conversation, created by Joseph Weizenbaum at MIT.',
    position: { x: 800, y: 50 },
    branchId: 'ai',
    thematicTags: {
      technical: 7,
      societal: 6,
      philosophical: 9
    }
  },
  {
    id: 'node9',
    title: 'ARPANET - First Network Connection',
    date: '1969-10-29',
    description: 'The first ARPANET link was established between UCLA and Stanford Research Institute, the beginning of the internet.',
    position: { x: 600, y: 350 },
    branchId: 'web',
    thematicTags: {
      technical: 9,
      societal: 10,
      philosophical: 7
    }
  },
  {
    id: 'node10',
    title: 'World Wide Web Created',
    date: '1989-03-12',
    description: 'Tim Berners-Lee proposed the World Wide Web, creating HTML and the first web browser and server.',
    position: { x: 800, y: 350 },
    branchId: 'web',
    thematicTags: {
      technical: 10,
      societal: 10,
      philosophical: 8
    }
  }
];

// Define connections between nodes
export const connections: TimelineConnection[] = [
  {
    id: 'conn1-2',
    sourceId: 'node1',
    targetId: 'node2',
    style: 'solid'
  },
  {
    id: 'conn2-3',
    sourceId: 'node2',
    targetId: 'node3',
    style: 'solid'
  },
  {
    id: 'conn3-4',
    sourceId: 'node3',
    targetId: 'node4',
    style: 'solid'
  },
  {
    id: 'conn4-5',
    sourceId: 'node4',
    targetId: 'node5',
    style: 'solid'
  },
  {
    id: 'conn3-6',
    sourceId: 'node3',
    targetId: 'node6',
    style: 'dashed'
  },
  {
    id: 'conn5-7',
    sourceId: 'node5',
    targetId: 'node7',
    style: 'dashed'
  },
  {
    id: 'conn6-7',
    sourceId: 'node6',
    targetId: 'node7',
    style: 'solid'
  },
  {
    id: 'conn7-8',
    sourceId: 'node7',
    targetId: 'node8',
    style: 'solid'
  },
  {
    id: 'conn4-9',
    sourceId: 'node4',
    targetId: 'node9',
    style: 'dashed'
  },
  {
    id: 'conn9-10',
    sourceId: 'node9',
    targetId: 'node10',
    style: 'solid'
  },
  {
    id: 'conn5-10',
    sourceId: 'node5',
    targetId: 'node10',
    style: 'dashed'
  }
];

// Initial state for the networked timeline
export const initialTimelineState: NetworkedTimelineState = {
  nodes,
  connections,
  branches,
  selectedNode: null,
  viewState: {
    position: { x: 0, y: 0 }, // This will be set properly in the hook
    zoom: 1,
    highlightedNodeIds: [],
    highlightedConnectionIds: []
  }
};

/**
 * Mock data for timeline branches
 */
export const timelineBranches: Record<string, NetworkedTimelineBranch> = {
  'main': {
    id: 'main',
    name: 'Historical Timeline',
    description: 'The historical progression of algorithmic capability',
    isMainTimeline: true,
    nodeIds: Object.keys(nodes).filter(id => nodes[id].branchId === 'main'),
    color: '#4B6BFF',
  },
  'future-optimistic': {
    id: 'future-optimistic',
    name: 'Optimistic Future',
    description: 'A future where algorithmic advances lead to broadly positive outcomes',
    isMainTimeline: false,
    nodeIds: Object.keys(nodes).filter(id => nodes[id].branchId === 'future-optimistic'),
    color: '#45D795',
    startDate: '2025-01-01',
    parentBranchId: 'main',
  },
  'future-pessimistic': {
    id: 'future-pessimistic',
    name: 'Pessimistic Future',
    description: 'A future where algorithmic advances lead to concerning outcomes',
    isMainTimeline: false,
    nodeIds: Object.keys(nodes).filter(id => nodes[id].branchId === 'future-pessimistic'),
    color: '#FF6C6C',
    startDate: '2025-01-01',
    parentBranchId: 'main',
  },
};

/**
 * Initial state for the networked timeline
 */
export const initialNetworkedTimelineState: NetworkedTimelineState = {
  nodes,
  connections,
  branches,
  selectedNode: null,
  viewState: {
    position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    zoom: 1,
    highlightedNodeIds: [],
    highlightedConnectionIds: []
  },
  activeFilters: {
    thematicDimensions: {
      technical: true,
      societal: true,
      philosophical: true,
    },
    minThresholds: {
      technical: 0,
      societal: 0,
      philosophical: 0,
    },
    showBranches: true,
  },
}; 