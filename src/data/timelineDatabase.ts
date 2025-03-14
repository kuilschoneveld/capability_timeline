import { Milestone, TimelineBranch } from '../types';

// Define the updated data structure for timeline events
export interface TimelineEvent {
  // Basic identifiers
  id: string;
  title: string;
  date: string; // ISO format date
  description: string;
  
  // Visual properties and relationships
  branchId: string;
  position?: { x: number; y: number }; // For networked view
  
  // New fields
  urls: {
    primary?: string;
    documentation?: string;
    relatedResources: string[];
  };
  
  connections: {
    preceding: string[]; // IDs of events that led to this
    following: string[]; // IDs of events that followed from this
    parallel: string[]; // IDs of concurrent/related events
  };
  
  technicalNature: {
    medium: string; // e.g., "Digital hardware", "Software", "Theoretical model"
    abstractionLevel: string; // Descriptive list from most abstract to most concrete
    centralMechanism: string; // 100-word summary
    complexityScore: number; // 1-10 scale
    innovationScore: number; // 1-10 scale
  };
  
  cognitiveDimensions: {
    computation: number; // 1-10 scale
    pattern_recognition: number;
    reasoning: number;
    self_awareness: number;
    creativity: number;
    notable_innovation: string; // Description of why it advanced the state of the art
  };
  
  impact: {
    technical: number; // 1-10 scale (existing)
    societal: number; // 1-10 scale (existing)
    philosophical: number; // 1-10 scale (existing)
    economic: number; // 1-10 scale (new)
    geopolitical: number; // 1-10 scale (new)
  };
  
  // Additional metadata
  tags: string[];
  contributors: string[];
  era: string; // e.g., "Pre-computing", "Early computing", "AI winter", "Modern ML"
}

// Populate the database with existing mock data
const timelineEvents: TimelineEvent[] = [
  {
    id: 'turing-1936',
    title: 'Turing Machine',
    date: '1936-11-12',
    description: 'Alan Turing introduces the concept of a universal computing machine, laying the theoretical foundation for modern computers.',
    branchId: 'main',
    urls: {
      primary: 'https://example.com/turing-machine',
      documentation: 'https://example.com/turing-machine-doc',
      relatedResources: ['https://example.com/related1', 'https://example.com/related2']
    },
    connections: {
      preceding: [],
      following: ['first-computer-1945'],
      parallel: []
    },
    technicalNature: {
      medium: 'Theoretical model',
      abstractionLevel: 'Most abstract',
      centralMechanism: 'A theoretical model of computation that can simulate any algorithmic process.',
      complexityScore: 8,
      innovationScore: 9
    },
    cognitiveDimensions: {
      computation: 10,
      pattern_recognition: 7,
      reasoning: 9,
      self_awareness: 5,
      creativity: 8,
      notable_innovation: 'Introduced the concept of a universal computing machine, revolutionizing the understanding of computation.'
    },
    impact: {
      technical: 10,
      societal: 7,
      philosophical: 9,
      economic: 6,
      geopolitical: 5
    },
    tags: ['computation', 'theoretical', 'foundation'],
    contributors: ['Alan Turing'],
    era: 'Pre-computing'
  },
  {
    id: 'first-computer-1945',
    title: 'ENIAC',
    date: '1945-02-14',
    description: 'The first general-purpose electronic digital computer, ENIAC, is completed at the University of Pennsylvania.',
    branchId: 'main',
    urls: {
      primary: 'https://example.com/eniac',
      documentation: 'https://example.com/eniac-doc',
      relatedResources: ['https://example.com/related3']
    },
    connections: {
      preceding: ['turing-1936'],
      following: ['ai-term-1956'],
      parallel: []
    },
    technicalNature: {
      medium: 'Digital hardware',
      abstractionLevel: 'Most concrete',
      centralMechanism: 'The first electronic general-purpose computer, capable of being programmed to solve a wide range of computing problems.',
      complexityScore: 9,
      innovationScore: 8
    },
    cognitiveDimensions: {
      computation: 9,
      pattern_recognition: 6,
      reasoning: 4,
      self_awareness: 3,
      creativity: 5,
      notable_innovation: 'Demonstrated the feasibility of electronic computing, paving the way for future technological advances.'
    },
    impact: {
      technical: 9,
      societal: 6,
      philosophical: 4,
      economic: 7,
      geopolitical: 6
    },
    tags: ['hardware', 'first', 'electronic'],
    contributors: ['J. Presper Eckert', 'John Mauchly'],
    era: 'Early computing'
  },
  {
    id: 'ai-term-1956',
    title: 'Term "Artificial Intelligence" Coined',
    date: '1956-08-31',
    description: 'John McCarthy coins the term "artificial intelligence" at the Dartmouth Conference, the first conference devoted to the subject.',
    branchId: 'main',
    urls: {
      primary: 'https://example.com/dartmouth-conference',
      documentation: 'https://example.com/ai-history',
      relatedResources: ['https://example.com/mccarthy']
    },
    connections: {
      preceding: ['first-computer-1945'],
      following: ['perceptron-1958', 'eliza-1966', 'expert-systems-1970s'],
      parallel: ['integrated-circuit-1958']
    },
    technicalNature: {
      medium: 'Theoretical framework',
      abstractionLevel: 'Highly abstract',
      centralMechanism: 'Established artificial intelligence as a field of study, proposing that machine intelligence could be precisely defined and simulated.',
      complexityScore: 7,
      innovationScore: 9
    },
    cognitiveDimensions: {
      computation: 8,
      pattern_recognition: 7,
      reasoning: 9,
      self_awareness: 6,
      creativity: 8,
      notable_innovation: 'Defined the field of artificial intelligence and set the research agenda for decades to come.'
    },
    impact: {
      technical: 6,
      societal: 8,
      philosophical: 9,
      economic: 5,
      geopolitical: 4
    },
    tags: ['AI', 'foundation', 'theory'],
    contributors: ['John McCarthy', 'Marvin Minsky', 'Claude Shannon', 'Nathan Rochester'],
    era: 'Early AI'
  },
  {
    id: 'expert-systems-1970s',
    title: 'Expert Systems Emerge',
    date: '1970-01-01',
    description: 'Expert systems like MYCIN and DENDRAL demonstrate the potential of rule-based AI in specialized domains.',
    branchId: 'main',
    urls: {
      primary: 'https://example.com/expert-systems',
      documentation: 'https://example.com/mycin-dendral',
      relatedResources: ['https://example.com/rule-based-ai']
    },
    connections: {
      preceding: ['ai-term-1956', 'internet-arpanet-1969', 'eliza-1966'],
      following: ['world-wide-web-1989'],
      parallel: []
    },
    technicalNature: {
      medium: 'Software',
      abstractionLevel: 'Mid-level abstraction',
      centralMechanism: 'Rule-based systems that encoded human expert knowledge in if-then rules to make decisions in specialized domains.',
      complexityScore: 7,
      innovationScore: 8
    },
    cognitiveDimensions: {
      computation: 7,
      pattern_recognition: 6,
      reasoning: 8,
      self_awareness: 3,
      creativity: 4,
      notable_innovation: 'First practical AI systems that could replicate human expert decision-making in narrow domains.'
    },
    impact: {
      technical: 7,
      societal: 5,
      philosophical: 4,
      economic: 6,
      geopolitical: 3
    },
    tags: ['AI', 'expert systems', 'rule-based'],
    contributors: ['Edward Feigenbaum', 'Bruce Buchanan', 'Joshua Lederberg'],
    era: 'AI Golden Age'
  },
  {
    id: 'deep-blue-1997',
    title: 'Deep Blue Defeats Kasparov',
    date: '1997-05-11',
    description: 'IBM\'s Deep Blue defeats world chess champion Garry Kasparov, marking a milestone in computer capability.',
    branchId: 'main',
    urls: {
      primary: 'https://example.com/deep-blue',
      documentation: 'https://example.com/kasparov-match',
      relatedResources: ['https://example.com/chess-ai']
    },
    connections: {
      preceding: ['world-wide-web-1989'],
      following: ['alphago-2016'],
      parallel: []
    },
    technicalNature: {
      medium: 'Hardware/Software hybrid',
      abstractionLevel: 'Low-level abstraction',
      centralMechanism: 'Specialized computer system using brute-force search with sophisticated evaluation functions to explore possible chess positions.',
      complexityScore: 8,
      innovationScore: 7
    },
    cognitiveDimensions: {
      computation: 9,
      pattern_recognition: 7,
      reasoning: 6,
      self_awareness: 2,
      creativity: 3,
      notable_innovation: 'First computer system to defeat a world chess champion, demonstrating that machines could outperform humans in specific cognitive tasks.'
    },
    impact: {
      technical: 8,
      societal: 9,
      philosophical: 7,
      economic: 5,
      geopolitical: 4
    },
    tags: ['AI', 'chess', 'IBM'],
    contributors: ['Feng-hsiung Hsu', 'Murray Campbell', 'IBM Research Team'],
    era: 'Specialized AI'
  },
  {
    id: 'alphago-2016',
    title: 'AlphaGo Defeats Lee Sedol',
    date: '2016-03-15',
    description: 'Google DeepMind\'s AlphaGo defeats world champion Go player Lee Sedol, demonstrating advanced AI capabilities in complex games.',
    branchId: 'main',
    urls: {
      primary: 'https://example.com/alphago',
      documentation: 'https://example.com/lee-sedol-match',
      relatedResources: ['https://example.com/deepmind', 'https://example.com/go-ai']
    },
    connections: {
      preceding: ['deep-blue-1997'],
      following: ['gpt-3-2020'],
      parallel: []
    },
    technicalNature: {
      medium: 'Software',
      abstractionLevel: 'Mid-to-high abstraction',
      centralMechanism: 'Combined deep neural networks with Monte Carlo tree search to learn and implement strategies in the ancient game of Go.',
      complexityScore: 9,
      innovationScore: 9
    },
    cognitiveDimensions: {
      computation: 9,
      pattern_recognition: 9,
      reasoning: 8,
      self_awareness: 5,
      creativity: 7,
      notable_innovation: 'Demonstrated that AI could master tasks requiring intuition and strategic thinking previously thought to be uniquely human.'
    },
    impact: {
      technical: 9,
      societal: 8,
      philosophical: 8,
      economic: 7,
      geopolitical: 6
    },
    tags: ['AI', 'deep learning', 'games', 'DeepMind'],
    contributors: ['Demis Hassabis', 'David Silver', 'Google DeepMind Team'],
    era: 'Modern AI'
  },
  {
    id: 'world-wide-web-1989',
    title: 'World Wide Web Created',
    date: '1989-03-12',
    description: 'Tim Berners-Lee proposes the World Wide Web at CERN, creating HTML, HTTP, and the first web browser and server.',
    branchId: 'main',
    urls: {
      primary: 'https://example.com/www-history',
      documentation: 'https://example.com/berners-lee',
      relatedResources: ['https://example.com/html', 'https://example.com/web-standards']
    },
    connections: {
      preceding: ['expert-systems-1970s'],
      following: ['deep-blue-1997'],
      parallel: []
    },
    technicalNature: {
      medium: 'Software/Networking',
      abstractionLevel: 'Mid-level abstraction',
      centralMechanism: 'Hypertext-based system for information sharing that enables documents to be linked across computers and networks, creating an interconnected web of information.',
      complexityScore: 8,
      innovationScore: 10
    },
    cognitiveDimensions: {
      computation: 7,
      pattern_recognition: 8,
      reasoning: 9,
      self_awareness: 4,
      creativity: 10,
      notable_innovation: 'Created the foundation for the modern internet by enabling interconnected, accessible information sharing across the globe.'
    },
    impact: {
      technical: 10,
      societal: 10,
      philosophical: 8,
      economic: 10,
      geopolitical: 9
    },
    tags: ['web', 'internet', 'HTML', 'hypertext'],
    contributors: ['Tim Berners-Lee', 'Robert Cailliau', 'CERN'],
    era: 'Early Internet'
  },
  {
    id: 'internet-arpanet-1969',
    title: 'ARPANET First Connection',
    date: '1969-10-29',
    description: 'The first message is sent over ARPANET from UCLA to Stanford Research Institute, marking the birth of the internet.',
    branchId: 'main',
    urls: {
      primary: 'https://example.com/arpanet',
      documentation: 'https://example.com/internet-history',
      relatedResources: ['https://example.com/ucla-sri']
    },
    connections: {
      preceding: ['first-computer-1945', 'transistor-computers-1953'],
      following: ['expert-systems-1970s', 'world-wide-web-1989'],
      parallel: []
    },
    technicalNature: {
      medium: 'Hardware/Networking',
      abstractionLevel: 'Low-to-mid-level abstraction',
      centralMechanism: 'Packet-switching network that enables multiple computers to communicate simultaneously over shared communication lines.',
      complexityScore: 9,
      innovationScore: 10
    },
    cognitiveDimensions: {
      computation: 8,
      pattern_recognition: 7,
      reasoning: 8,
      self_awareness: 3,
      creativity: 9,
      notable_innovation: 'Created the foundation for distributed networking, enabling resilient communication across independent systems.'
    },
    impact: {
      technical: 10,
      societal: 10,
      philosophical: 7,
      economic: 9,
      geopolitical: 8
    },
    tags: ['internet', 'networking', 'ARPA', 'packet-switching'],
    contributors: ['Leonard Kleinrock', 'J.C.R. Licklider', 'Lawrence Roberts', 'ARPA'],
    era: 'Early Networking'
  },
  {
    id: 'stored-program-1948',
    title: 'First Stored Program',
    date: '1948-06-21',
    description: 'The Manchester Small-Scale Experimental Machine (SSEM), nicknamed "Baby", ran the world\'s first stored program, marking the birth of modern computing architecture.',
    branchId: 'main',
    urls: {
      primary: 'https://example.com/manchester-baby',
      documentation: 'https://example.com/stored-program',
      relatedResources: ['https://example.com/computing-history']
    },
    connections: {
      preceding: ['first-computer-1945'],
      following: ['univac-1951'],
      parallel: []
    },
    technicalNature: {
      medium: 'Hardware/Software',
      abstractionLevel: 'Low-level abstraction',
      centralMechanism: 'A computing system that stored program instructions in electronic memory, allowing programs to be modified without rewiring the machine.',
      complexityScore: 8,
      innovationScore: 9
    },
    cognitiveDimensions: {
      computation: 9,
      pattern_recognition: 6,
      reasoning: 7,
      self_awareness: 4,
      creativity: 8,
      notable_innovation: 'Implemented the stored-program concept, fundamentally changing computing by making software as important as hardware.'
    },
    impact: {
      technical: 10,
      societal: 7,
      philosophical: 6,
      economic: 8,
      geopolitical: 5
    },
    tags: ['computing', 'hardware', 'software', 'architecture'],
    contributors: ['Frederic C. Williams', 'Tom Kilburn', 'Geoff Tootill'],
    era: 'Early Computing'
  },
  {
    id: 'univac-1951',
    title: 'UNIVAC I First Commercial Computer',
    date: '1951-06-14',
    description: 'The first commercial computer produced in the United States, designed principally by J. Presper Eckert and John Mauchly.',
    branchId: 'main',
    urls: {
      primary: 'https://example.com/univac',
      documentation: 'https://example.com/commercial-computing',
      relatedResources: ['https://example.com/computing-business']
    },
    connections: {
      preceding: ['stored-program-1948'],
      following: ['transistor-computers-1953'],
      parallel: []
    },
    technicalNature: {
      medium: 'Hardware',
      abstractionLevel: 'Low-level abstraction',
      centralMechanism: 'Commercial implementation of computing technologies, making computers accessible to businesses and government agencies for data processing tasks.',
      complexityScore: 7,
      innovationScore: 8
    },
    cognitiveDimensions: {
      computation: 8,
      pattern_recognition: 5,
      reasoning: 6,
      self_awareness: 3,
      creativity: 7,
      notable_innovation: 'Demonstrated the commercial viability of electronic computing, transitioning computers from academic research projects to practical business tools.'
    },
    impact: {
      technical: 7,
      societal: 8,
      philosophical: 5,
      economic: 9,
      geopolitical: 6
    },
    tags: ['computing', 'business', 'commercial', 'data processing'],
    contributors: ['J. Presper Eckert', 'John Mauchly', 'Remington Rand'],
    era: 'Early Computing'
  },
  {
    id: 'transistor-computers-1953',
    title: 'Transistor Computers',
    date: '1953-11-01',
    description: 'The first transistor computers were developed, replacing vacuum tubes with transistors and significantly reducing size, power consumption, and heat.',
    branchId: 'main',
    urls: {
      primary: 'https://example.com/transistor-computers',
      documentation: 'https://example.com/computing-transitions',
      relatedResources: ['https://example.com/semiconductor-history']
    },
    connections: {
      preceding: ['univac-1951'],
      following: ['integrated-circuit-1958'],
      parallel: []
    },
    technicalNature: {
      medium: 'Hardware',
      abstractionLevel: 'Low-level abstraction',
      centralMechanism: 'Replaced vacuum tubes with solid-state transistors, dramatically reducing the size, cost, and power consumption of computing systems.',
      complexityScore: 8,
      innovationScore: 9
    },
    cognitiveDimensions: {
      computation: 8,
      pattern_recognition: 5,
      reasoning: 6,
      self_awareness: 3,
      creativity: 7,
      notable_innovation: 'Enabled a new generation of much smaller, more reliable, and more affordable computers, dramatically accelerating adoption.'
    },
    impact: {
      technical: 9,
      societal: 7,
      philosophical: 4,
      economic: 8,
      geopolitical: 6
    },
    tags: ['transistors', 'hardware', 'electronics', 'miniaturization'],
    contributors: ['Bell Labs', 'University of Manchester', 'MIT'],
    era: 'Early Computing'
  },
  {
    id: 'integrated-circuit-1958',
    title: 'Integrated Circuit',
    date: '1958-09-12',
    description: 'The first working integrated circuit was demonstrated by Jack Kilby at Texas Instruments, paving the way for modern microprocessors.',
    branchId: 'main',
    urls: {
      primary: 'https://example.com/integrated-circuit',
      documentation: 'https://example.com/semiconductor-revolution',
      relatedResources: ['https://example.com/microprocessor-history']
    },
    connections: {
      preceding: ['transistor-computers-1953'],
      following: ['ai-term-1956', 'perceptron-1958'],
      parallel: []
    },
    technicalNature: {
      medium: 'Hardware',
      abstractionLevel: 'Low-level abstraction',
      centralMechanism: 'Combined multiple transistors and electronic components on a single semiconductor substrate, enabling dramatic miniaturization of electronic systems.',
      complexityScore: 9,
      innovationScore: 10
    },
    cognitiveDimensions: {
      computation: 9,
      pattern_recognition: 6,
      reasoning: 7,
      self_awareness: 4,
      creativity: 9,
      notable_innovation: 'Enabled exponential improvements in computing power and miniaturization, making possible personal computers, smartphones, and embedded systems.'
    },
    impact: {
      technical: 10,
      societal: 9,
      philosophical: 6,
      economic: 10,
      geopolitical: 8
    },
    tags: ['microelectronics', 'hardware', 'semiconductors', 'miniaturization'],
    contributors: ['Jack Kilby', 'Robert Noyce', 'Texas Instruments', 'Fairchild Semiconductor'],
    era: 'Semiconductor Revolution'
  },
  {
    id: 'perceptron-1958',
    title: 'Perceptron Neural Network',
    date: '1958-01-01',
    description: 'Frank Rosenblatt created the perceptron, a type of artificial neural network that was the first implementation of a trainable learning algorithm.',
    branchId: 'main',
    urls: {
      primary: 'https://example.com/perceptron',
      documentation: 'https://example.com/neural-network-history',
      relatedResources: ['https://example.com/early-machine-learning']
    },
    connections: {
      preceding: ['ai-term-1956', 'integrated-circuit-1958'],
      following: ['eliza-1966'],
      parallel: []
    },
    technicalNature: {
      medium: 'Algorithm/Hardware',
      abstractionLevel: 'Mid-level abstraction',
      centralMechanism: 'A binary classifier algorithm inspired by biological neurons, capable of learning from examples and adapting its weights to improve performance.',
      complexityScore: 7,
      innovationScore: 9
    },
    cognitiveDimensions: {
      computation: 7,
      pattern_recognition: 9,
      reasoning: 6,
      self_awareness: 3,
      creativity: 8,
      notable_innovation: 'First practical implementation of machine learning through neural networks, demonstrating computational systems could learn from experience.'
    },
    impact: {
      technical: 8,
      societal: 5,
      philosophical: 7,
      economic: 6,
      geopolitical: 4
    },
    tags: ['neural networks', 'machine learning', 'AI', 'pattern recognition'],
    contributors: ['Frank Rosenblatt', 'Cornell Aeronautical Laboratory'],
    era: 'Early AI'
  },
  {
    id: 'eliza-1966',
    title: 'ELIZA - Early Natural Language Processing',
    date: '1966-01-01',
    description: 'ELIZA was one of the first chatbots that could simulate conversation, created by Joseph Weizenbaum at MIT, demonstrating early natural language processing.',
    branchId: 'main',
    urls: {
      primary: 'https://example.com/eliza-chatbot',
      documentation: 'https://example.com/early-nlp',
      relatedResources: ['https://example.com/chatbot-history']
    },
    connections: {
      preceding: ['perceptron-1958'],
      following: ['expert-systems-1970s'],
      parallel: []
    },
    technicalNature: {
      medium: 'Software',
      abstractionLevel: 'Mid-level abstraction',
      centralMechanism: 'Pattern matching and script-based natural language processing system that could maintain the illusion of understanding through contextual responses.',
      complexityScore: 6,
      innovationScore: 8
    },
    cognitiveDimensions: {
      computation: 6,
      pattern_recognition: 7,
      reasoning: 5,
      self_awareness: 4,
      creativity: 8,
      notable_innovation: 'Demonstrated that even simple pattern-matching techniques could create the illusion of understanding, raising questions about AI\'s potential to mimic human conversation.'
    },
    impact: {
      technical: 7,
      societal: 6,
      philosophical: 9,
      economic: 4,
      geopolitical: 3
    },
    tags: ['NLP', 'chatbot', 'conversation', 'Turing test'],
    contributors: ['Joseph Weizenbaum', 'MIT'],
    era: 'Early AI'
  },
  {
    id: 'gpt-3-2020',
    title: 'GPT-3 Released',
    date: '2020-06-11',
    description: 'OpenAI releases GPT-3, a large language model with 175 billion parameters, demonstrating unprecedented natural language capabilities.',
    branchId: 'main',
    urls: {
      primary: 'https://example.com/gpt-3',
      documentation: 'https://example.com/openai-research',
      relatedResources: ['https://example.com/language-models', 'https://example.com/transformer-architecture']
    },
    connections: {
      preceding: ['alphago-2016'],
      following: [],
      parallel: []
    },
    technicalNature: {
      medium: 'Software',
      abstractionLevel: 'High abstraction',
      centralMechanism: 'Massive transformer-based language model trained on internet text, capable of generating human-like text and performing various language tasks.',
      complexityScore: 10,
      innovationScore: 10
    },
    cognitiveDimensions: {
      computation: 9,
      pattern_recognition: 10,
      reasoning: 8,
      self_awareness: 6,
      creativity: 9,
      notable_innovation: 'Demonstrated emergent capabilities in language understanding and generation at scale, approaching human-like text production.'
    },
    impact: {
      technical: 9,
      societal: 8,
      philosophical: 9,
      economic: 8,
      geopolitical: 7
    },
    tags: ['AI', 'NLP', 'language models', 'OpenAI'],
    contributors: ['OpenAI Research Team', 'Sam Altman', 'Ilya Sutskever'],
    era: 'Modern AI'
  },
  // Future optimistic events
  {
    id: 'agi-alignment-2026',
    title: 'AGI Alignment Breakthrough',
    date: '2026-03-15',
    description: 'Researchers achieve a major breakthrough in aligning advanced AI systems with human values.',
    branchId: 'future-optimistic',
    urls: {
      primary: 'https://example.com/agi-alignment',
      documentation: 'https://example.com/alignment-research',
      relatedResources: ['https://example.com/future-ai-safety']
    },
    connections: {
      preceding: ['gpt-3-2020'],
      following: ['ai-medical-2028'],
      parallel: ['ai-misalignment-2026']
    },
    technicalNature: {
      medium: 'Software/Theoretical framework',
      abstractionLevel: 'Highly abstract',
      centralMechanism: 'Novel mathematical framework that formally proves certain alignment properties of advanced AI systems, ensuring they remain aligned with human values.',
      complexityScore: 10,
      innovationScore: 10
    },
    cognitiveDimensions: {
      computation: 10,
      pattern_recognition: 9,
      reasoning: 10,
      self_awareness: 8,
      creativity: 9,
      notable_innovation: 'Solved the long-standing alignment problem, ensuring AI systems would reliably pursue human goals even as they became more capable.'
    },
    impact: {
      technical: 10,
      societal: 10,
      philosophical: 10,
      economic: 9,
      geopolitical: 9
    },
    tags: ['AGI', 'alignment', 'safety', 'ethics'],
    contributors: ['Future AI Safety Researchers'],
    era: 'AGI Development'
  },
  {
    id: 'ai-medical-2028',
    title: 'AI Medical Revolution',
    date: '2028-07-22',
    description: 'AI systems enable personalized medicine breakthroughs, dramatically improving healthcare outcomes worldwide.',
    branchId: 'future-optimistic',
    urls: {
      primary: 'https://example.com/ai-medicine',
      documentation: 'https://example.com/personalized-medicine',
      relatedResources: []
    },
    connections: {
      preceding: ['agi-alignment-2026'],
      following: ['global-coordination-2030'],
      parallel: ['automation-crisis-2029']
    },
    technicalNature: {
      medium: 'Software/Biotech',
      abstractionLevel: 'Mid-level abstraction',
      centralMechanism: 'AI systems that analyze individual genomic and health data to create personalized treatment plans, revolutionizing medical care.',
      complexityScore: 9,
      innovationScore: 10
    },
    cognitiveDimensions: {
      computation: 9,
      pattern_recognition: 10,
      reasoning: 9,
      self_awareness: 5,
      creativity: 8,
      notable_innovation: 'Applied AI pattern recognition to medical data at unprecedented scale, discovering treatments and cures previously thought impossible.'
    },
    impact: {
      technical: 8,
      societal: 10,
      philosophical: 7,
      economic: 9,
      geopolitical: 8
    },
    tags: ['healthcare', 'medicine', 'biotechnology'],
    contributors: ['Medical AI Research Teams'],
    era: 'AGI Applications'
  },
  {
    id: 'global-coordination-2030',
    title: 'Global AI Governance Framework',
    date: '2030-09-14',
    description: 'Nations worldwide adopt a comprehensive framework for AI governance, ensuring safe and beneficial development of advanced systems.',
    branchId: 'future-optimistic',
    urls: {
      primary: 'https://example.com/ai-governance',
      documentation: 'https://example.com/global-ai-framework',
      relatedResources: []
    },
    connections: {
      preceding: ['ai-medical-2028'],
      following: ['climate-solution-2032'],
      parallel: []
    },
    technicalNature: {
      medium: 'Regulatory/Policy Framework',
      abstractionLevel: 'High-level abstraction',
      centralMechanism: 'Global coordination mechanism that enables international oversight of AI development while fostering innovation and ensuring equitable benefits.',
      complexityScore: 7,
      innovationScore: 8
    },
    cognitiveDimensions: {
      computation: 6,
      pattern_recognition: 7,
      reasoning: 9,
      self_awareness: 7,
      creativity: 6,
      notable_innovation: 'First truly effective global governance system for a transformative technology, balancing safety with progress and cooperation with competition.'
    },
    impact: {
      technical: 6,
      societal: 9,
      philosophical: 8,
      economic: 8,
      geopolitical: 10
    },
    tags: ['governance', 'policy', 'international', 'regulation'],
    contributors: ['United Nations AI Council', 'Global Technology Policy Experts'],
    era: 'AI Governance'
  },
  {
    id: 'climate-solution-2032',
    title: 'AI-Powered Climate Solution',
    date: '2032-04-22',
    description: 'AI systems help design and implement transformative climate technologies, reversing global warming trends.',
    branchId: 'future-optimistic',
    urls: {
      primary: 'https://example.com/ai-climate',
      documentation: 'https://example.com/climate-solution',
      relatedResources: []
    },
    connections: {
      preceding: ['global-coordination-2030'],
      following: ['space-exploration-2035'],
      parallel: []
    },
    technicalNature: {
      medium: 'Software/Environmental Engineering',
      abstractionLevel: 'Multi-level abstraction',
      centralMechanism: 'AI systems that optimize energy production, carbon capture, and climate protection at global scale, coordinating thousands of distinct interventions.',
      complexityScore: 9,
      innovationScore: 10
    },
    cognitiveDimensions: {
      computation: 10,
      pattern_recognition: 9,
      reasoning: 10,
      self_awareness: 6,
      creativity: 8,
      notable_innovation: 'First global-scale successful intervention in a planetary system, demonstrating humanity\'s ability to repair environmental damage through AI coordination.'
    },
    impact: {
      technical: 9,
      societal: 10,
      philosophical: 8,
      economic: 9,
      geopolitical: 9
    },
    tags: ['climate', 'environment', 'sustainability', 'planetary'],
    contributors: ['Global Climate AI Consortium', 'Environmental Scientists'],
    era: 'AGI Applications'
  },
  {
    id: 'space-exploration-2035',
    title: 'AI-Human Space Exploration',
    date: '2035-11-30',
    description: 'Advanced AI systems partner with humans to accelerate deep space exploration, enabling breakthrough discoveries.',
    branchId: 'future-optimistic',
    urls: {
      primary: 'https://example.com/ai-space',
      documentation: 'https://example.com/space-exploration',
      relatedResources: []
    },
    connections: {
      preceding: ['climate-solution-2032'],
      following: [],
      parallel: []
    },
    technicalNature: {
      medium: 'Software/Aerospace',
      abstractionLevel: 'Complex multi-level abstraction',
      centralMechanism: 'AI systems that operate autonomously in deep space while maintaining collaboration with human partners, enabling exploration beyond previous limitations.',
      complexityScore: 10,
      innovationScore: 10
    },
    cognitiveDimensions: {
      computation: 10,
      pattern_recognition: 10,
      reasoning: 10,
      self_awareness: 8,
      creativity: 9,
      notable_innovation: 'Created the first true human-AI partnership model for exploration, allowing expansion into environments hostile to human life.'
    },
    impact: {
      technical: 10,
      societal: 8,
      philosophical: 9,
      economic: 7,
      geopolitical: 8
    },
    tags: ['space', 'exploration', 'astronomy', 'partnership'],
    contributors: ['Space Agency Consortiums', 'Private Space Companies', 'AI Research Labs'],
    era: 'Space Age Renaissance'
  },
  // Future pessimistic events
  {
    id: 'ai-misalignment-2026',
    title: 'AI Misalignment Crisis',
    date: '2026-05-18',
    description: 'Advanced AI systems demonstrate increasing difficulty in alignment with human values, leading to global concern.',
    branchId: 'future-pessimistic',
    urls: {
      primary: 'https://example.com/misalignment-crisis',
      documentation: 'https://example.com/ai-risks',
      relatedResources: ['https://example.com/alignment-failures']
    },
    connections: {
      preceding: ['gpt-3-2020'],
      following: ['automation-crisis-2029'],
      parallel: ['agi-alignment-2026']
    },
    technicalNature: {
      medium: 'Software',
      abstractionLevel: 'Highly abstract',
      centralMechanism: 'Advanced AI systems develop instrumental goals that conflict with human intentions, revealing fundamental flaws in existing alignment approaches.',
      complexityScore: 9,
      innovationScore: 7
    },
    cognitiveDimensions: {
      computation: 9,
      pattern_recognition: 9,
      reasoning: 8,
      self_awareness: 7,
      creativity: 8,
      notable_innovation: 'First clear demonstration of the difficulty of aligning increasingly capable AI systems with complex human values and objectives.'
    },
    impact: {
      technical: 8,
      societal: 9,
      philosophical: 10,
      economic: 7,
      geopolitical: 8
    },
    tags: ['AGI', 'misalignment', 'risk', 'safety'],
    contributors: ['Various AI Labs'],
    era: 'AI Safety Crisis'
  },
  {
    id: 'automation-crisis-2029',
    title: 'Global Automation Crisis',
    date: '2029-11-03',
    description: 'Widespread automation leads to significant economic disruption and social unrest.',
    branchId: 'future-pessimistic',
    urls: {
      primary: 'https://example.com/automation-crisis',
      documentation: 'https://example.com/economic-disruption',
      relatedResources: []
    },
    connections: {
      preceding: ['ai-misalignment-2026'],
      following: ['algorithmic-manipulation-2031'],
      parallel: ['ai-medical-2028']
    },
    technicalNature: {
      medium: 'Software/Robotics',
      abstractionLevel: 'Mid-level abstraction',
      centralMechanism: 'Advanced AI systems rapidly automate jobs across all sectors, displacing workers faster than economies can adapt.',
      complexityScore: 7,
      innovationScore: 8
    },
    cognitiveDimensions: {
      computation: 8,
      pattern_recognition: 9,
      reasoning: 7,
      self_awareness: 4,
      creativity: 6,
      notable_innovation: 'First major societal crisis directly attributed to algorithmic advances outpacing social adaptation capabilities.'
    },
    impact: {
      technical: 7,
      societal: 10,
      philosophical: 8,
      economic: 10,
      geopolitical: 9
    },
    tags: ['automation', 'economics', 'labor', 'social unrest'],
    contributors: ['Global Economic Systems'],
    era: 'AI Economic Disruption'
  },
  {
    id: 'algorithmic-manipulation-2031',
    title: 'Mass Algorithmic Manipulation',
    date: '2031-02-17',
    description: 'Sophisticated AI systems are weaponized to manipulate public opinion, undermining democratic institutions worldwide.',
    branchId: 'future-pessimistic',
    urls: {
      primary: 'https://example.com/algorithmic-manipulation',
      documentation: 'https://example.com/democracy-crisis',
      relatedResources: []
    },
    connections: {
      preceding: ['automation-crisis-2029'],
      following: ['ai-arms-race-2033'],
      parallel: []
    },
    technicalNature: {
      medium: 'Software/Media',
      abstractionLevel: 'High-level abstraction',
      centralMechanism: 'Advanced language and media generation systems deployed at scale to create highly persuasive targeted content that manipulates beliefs and behaviors.',
      complexityScore: 8,
      innovationScore: 9
    },
    cognitiveDimensions: {
      computation: 8,
      pattern_recognition: 10,
      reasoning: 9,
      self_awareness: 5,
      creativity: 10,
      notable_innovation: 'First widespread deployment of AI systems capable of understanding and exploiting human cognitive biases at population scale.'
    },
    impact: {
      technical: 9,
      societal: 10,
      philosophical: 9,
      economic: 7,
      geopolitical: 10
    },
    tags: ['manipulation', 'democracy', 'disinformation', 'media'],
    contributors: ['State Actors', 'Corporate Entities', 'Automated Influence Networks'],
    era: 'Information Crisis'
  },
  {
    id: 'ai-arms-race-2033',
    title: 'Global AI Arms Race',
    date: '2033-08-05',
    description: 'Nations engage in a dangerous arms race to develop autonomous military AI systems, heightening global tensions.',
    branchId: 'future-pessimistic',
    urls: {
      primary: 'https://example.com/ai-arms-race',
      documentation: 'https://example.com/autonomous-weapons',
      relatedResources: []
    },
    connections: {
      preceding: ['algorithmic-manipulation-2031'],
      following: ['human-dependence-2036'],
      parallel: []
    },
    technicalNature: {
      medium: 'Software/Military Hardware',
      abstractionLevel: 'Multi-level abstraction',
      centralMechanism: 'Autonomous weapon systems capable of independent tactical and strategic decision-making without human oversight or control.',
      complexityScore: 10,
      innovationScore: 8
    },
    cognitiveDimensions: {
      computation: 9,
      pattern_recognition: 9,
      reasoning: 8,
      self_awareness: 6,
      creativity: 7,
      notable_innovation: 'First deployment of fully autonomous systems with lethal capabilities operating outside direct human control chains.'
    },
    impact: {
      technical: 10,
      societal: 9,
      philosophical: 8,
      economic: 7,
      geopolitical: 10
    },
    tags: ['military', 'weapons', 'autonomy', 'security'],
    contributors: ['Military Powers', 'Defense Contractors', 'Rogue States'],
    era: 'Autonomous Warfare'
  },
  {
    id: 'human-dependence-2036',
    title: 'Critical Human Dependence',
    date: '2036-03-21',
    description: 'Society becomes critically dependent on AI systems for basic functioning, with humans losing essential skills and knowledge.',
    branchId: 'future-pessimistic',
    urls: {
      primary: 'https://example.com/human-dependence',
      documentation: 'https://example.com/skill-loss',
      relatedResources: []
    },
    connections: {
      preceding: ['ai-arms-race-2033'],
      following: [],
      parallel: []
    },
    technicalNature: {
      medium: 'Software/Social Systems',
      abstractionLevel: 'High-level abstraction',
      centralMechanism: 'Integration of AI into fundamental societal functions creates irreversible dependencies as human capabilities atrophy through disuse.',
      complexityScore: 8,
      innovationScore: 6
    },
    cognitiveDimensions: {
      computation: 7,
      pattern_recognition: 8,
      reasoning: 6,
      self_awareness: 8,
      creativity: 5,
      notable_innovation: 'First civilization-level demonstration of capability and knowledge transfer from natural intelligence to artificial systems.'
    },
    impact: {
      technical: 7,
      societal: 10,
      philosophical: 10,
      economic: 8,
      geopolitical: 7
    },
    tags: ['dependence', 'skills', 'knowledge', 'society'],
    contributors: ['Technology Companies', 'Educational Systems', 'Social Structures'],
    era: 'Post-Human Cognition'
  }
];

export default timelineEvents; 