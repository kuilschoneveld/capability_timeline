import { Milestone, TimelineBranch } from '../types';

/**
 * Mock data for the main timeline branch
 */
export const mainTimelineBranch: TimelineBranch = {
  id: 'main',
  name: 'Historical Timeline',
  description: 'The historical progression of algorithmic capability',
  isMainTimeline: true,
};

/**
 * Mock data for future timeline branches
 */
export const futureBranches: TimelineBranch[] = [
  {
    id: 'future-optimistic',
    name: 'Optimistic Future',
    description: 'A future where algorithmic advances lead to broadly positive outcomes',
    isMainTimeline: false,
    startDate: '2025-01-01',
    parentBranchId: 'main',
  },
  {
    id: 'future-pessimistic',
    name: 'Pessimistic Future',
    description: 'A future where algorithmic advances lead to concerning outcomes',
    isMainTimeline: false,
    startDate: '2025-01-01',
    parentBranchId: 'main',
  },
];

/**
 * Mock data for historical milestones
 */
export const historicalMilestones: Milestone[] = [
  {
    id: 'turing-1936',
    title: 'Turing Machine',
    date: '1936-11-12',
    description: 'Alan Turing introduces the concept of a universal computing machine, laying the theoretical foundation for modern computers.',
    thematicTags: {
      technical: 10,
      societal: 7,
      philosophical: 9,
    },
    branchId: 'main',
  },
  {
    id: 'first-computer-1945',
    title: 'ENIAC',
    date: '1945-02-14',
    description: 'The first general-purpose electronic digital computer, ENIAC, is completed at the University of Pennsylvania.',
    thematicTags: {
      technical: 9,
      societal: 6,
      philosophical: 4,
    },
    branchId: 'main',
  },
  {
    id: 'ai-term-1956',
    title: 'Term "Artificial Intelligence" Coined',
    date: '1956-08-31',
    description: 'John McCarthy coins the term "artificial intelligence" at the Dartmouth Conference, the first conference devoted to the subject.',
    thematicTags: {
      technical: 6,
      societal: 8,
      philosophical: 9,
    },
    branchId: 'main',
  },
  {
    id: 'expert-systems-1970s',
    title: 'Expert Systems Emerge',
    date: '1970-01-01',
    description: 'Expert systems like MYCIN and DENDRAL demonstrate the potential of rule-based AI in specialized domains.',
    thematicTags: {
      technical: 7,
      societal: 5,
      philosophical: 4,
    },
    branchId: 'main',
  },
  {
    id: 'deep-blue-1997',
    title: 'Deep Blue Defeats Kasparov',
    date: '1997-05-11',
    description: 'IBM\'s Deep Blue defeats world chess champion Garry Kasparov, marking a milestone in computer capability.',
    thematicTags: {
      technical: 8,
      societal: 9,
      philosophical: 7,
    },
    branchId: 'main',
  },
  {
    id: 'alphago-2016',
    title: 'AlphaGo Defeats Lee Sedol',
    date: '2016-03-15',
    description: 'Google DeepMind\'s AlphaGo defeats world champion Go player Lee Sedol, demonstrating advanced AI capabilities in complex games.',
    thematicTags: {
      technical: 9,
      societal: 8,
      philosophical: 8,
    },
    branchId: 'main',
  },
  {
    id: 'gpt-3-2020',
    title: 'GPT-3 Released',
    date: '2020-06-11',
    description: 'OpenAI releases GPT-3, a large language model with 175 billion parameters, demonstrating unprecedented natural language capabilities.',
    thematicTags: {
      technical: 9,
      societal: 8,
      philosophical: 9,
    },
    branchId: 'main',
  },
];

/**
 * Mock data for future milestones (optimistic branch)
 */
export const optimisticFutureMilestones: Milestone[] = [
  {
    id: 'agi-alignment-2026',
    title: 'AGI Alignment Breakthrough',
    date: '2026-03-15',
    description: 'Researchers achieve a major breakthrough in aligning advanced AI systems with human values.',
    thematicTags: {
      technical: 10,
      societal: 10,
      philosophical: 10,
    },
    branchId: 'future-optimistic',
  },
  {
    id: 'ai-medical-2028',
    title: 'AI Medical Revolution',
    date: '2028-07-22',
    description: 'AI systems enable personalized medicine breakthroughs, dramatically improving healthcare outcomes worldwide.',
    thematicTags: {
      technical: 8,
      societal: 10,
      philosophical: 7,
    },
    branchId: 'future-optimistic',
  },
];

/**
 * Mock data for future milestones (pessimistic branch)
 */
export const pessimisticFutureMilestones: Milestone[] = [
  {
    id: 'ai-misalignment-2026',
    title: 'AI Misalignment Crisis',
    date: '2026-05-18',
    description: 'Advanced AI systems demonstrate increasing difficulty in alignment with human values, leading to global concern.',
    thematicTags: {
      technical: 8,
      societal: 9,
      philosophical: 10,
    },
    branchId: 'future-pessimistic',
  },
  {
    id: 'automation-crisis-2029',
    title: 'Global Automation Crisis',
    date: '2029-11-03',
    description: 'Widespread automation leads to significant economic disruption and social unrest.',
    thematicTags: {
      technical: 7,
      societal: 10,
      philosophical: 8,
    },
    branchId: 'future-pessimistic',
  },
];

/**
 * Combined milestone data
 */
export const allMilestones: Milestone[] = [
  ...historicalMilestones,
  ...optimisticFutureMilestones,
  ...pessimisticFutureMilestones,
];

/**
 * Combined branch data
 */
export const allBranches: TimelineBranch[] = [
  mainTimelineBranch,
  ...futureBranches,
]; 