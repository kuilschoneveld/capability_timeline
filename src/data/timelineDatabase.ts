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

// Define branch point date
const BRANCH_POINT_DATE = new Date('2025-01-01');

// Function to convert BCE dates to the proper format
const formatBCEDate = (dateStr: string) => {
    if (dateStr.startsWith('0') && parseInt(dateStr) < 1000) {
        // This is likely a BCE date in the format 0XXX-XX-XX
        return `-${dateStr.substring(1)}`;
    }
    return dateStr;
};

// Function to convert Events.txt entries to our TimelineEvent format
const convertEventToTimelineEvent = (event: any): TimelineEvent => {
    // Format BCE dates correctly (dates like 0240-06-21 should be -0240-06-21)
    const formattedDate = formatBCEDate(event.date);

    return {
        id: event.id,
        title: event.title,
        date: formattedDate,
        description: event.description,
        branchId: 'main', // Set all events to main branch as requested
        urls: {
            primary: event.urls?.primary || '',
            documentation: event.urls?.documentation || '',
            relatedResources: event.urls?.relatedResources || []
        },
        connections: {
            preceding: event.connections?.preceding || [],
            following: event.connections?.following || [],
            parallel: event.connections?.parallel || []
        },
        technicalNature: {
            medium: event.technicalNature?.medium || '',
            abstractionLevel: event.technicalNature?.abstractionLevel || '',
            centralMechanism: event.technicalNature?.centralMechanism || '',
            complexityScore: event.technicalNature?.complexityScore || 0,
            innovationScore: event.technicalNature?.innovationScore || 0
        },
        cognitiveDimensions: {
            computation: event.cognitiveDimensions?.computation || 0,
            pattern_recognition: event.cognitiveDimensions?.pattern_recognition || 0,
            reasoning: event.cognitiveDimensions?.reasoning || 0,
            self_awareness: event.cognitiveDimensions?.self_awareness || 0,
            creativity: event.cognitiveDimensions?.creativity || 0,
            notable_innovation: event.cognitiveDimensions?.notable_innovation || ''
        },
        impact: {
            technical: event.impact?.technical || 0,
            societal: event.impact?.societal || 0,
            philosophical: event.impact?.philosophical || 0,
            economic: event.impact?.economic || 0,
            geopolitical: event.impact?.geopolitical || 0
        },
        tags: event.tags || [],
        contributors: event.contributors || [],
        era: event.era || 'Undefined'
    };
};

// Populate the database with existing mock data
const timelineEvents: TimelineEvent[] = [

    {
        id: 'greek_myths_automata',
        title: 'Greek Myths of Animated Statues (Talos)',
        date: '0800-01-01',
        description: 'Greek legends describe Talos as a giant bronze automaton guarding Crete.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/Talos',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: [],
            following: ['eratosthenes_240bce'],
            parallel: []
        },
        technicalNature: {
            medium: 'Conceptual/Folklore',
            abstractionLevel: 'mythical/theory',
            centralMechanism: 'Mythical bronze giant powered by divine or magical means, representing an early conception of artificially created guardians.',
            complexityScore: 1,
            innovationScore: 3
        },
        cognitiveDimensions: {
            computation: 1,
            pattern_recognition: 1,
            reasoning: 1,
            self_awareness: 1,
            creativity: 4,
            notable_innovation: 'Earliest myths hinting at mechanical beings protecting or serving humans.'
        },
        impact: {
            technical: 1,
            societal: 4,
            philosophical: 5,
            economic: 1,
            geopolitical: 1
        },
        tags: ['myth', 'automaton', 'ancient'],
        contributors: ['Unknown storytellers'],
        era: 'Agricultural'
    },
    {
        id: 'eratosthenes_240bce',
        title: 'Eratosthenes Measures Earth\'s Circumference',
        date: '0240-06-21',
        description: 'Eratosthenes estimates Earth\'s circumference with remarkable accuracy using shadows.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/Eratosthenes',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['greek_myths_automata'],
            following: ['al_khwarizmi_820'],
            parallel: []
        },
        technicalNature: {
            medium: 'Observational mathematics',
            abstractionLevel: 'computational',
            centralMechanism: 'He used geometric proportions based on shadow angles in different cities to infer the planet\'s total circumference.',
            complexityScore: 2,
            innovationScore: 9
        },
        cognitiveDimensions: {
            computation: 3,
            pattern_recognition: 5,
            reasoning: 7,
            self_awareness: 1,
            creativity: 6,
            notable_innovation: 'Showed how data-driven algorithmic thinking can solve large-scale scientific problems.'
        },
        impact: {
            technical: 7,
            societal: 5,
            philosophical: 8,
            economic: 2,
            geopolitical: 2
        },
        tags: ['astronomy', 'geometry', 'ancient'],
        contributors: ['Eratosthenes'],
        era: 'Agricultural'
    },
    {
        id: 'al_khwarizmi_820',
        title: 'Al-Khwarizmi Defines Algebra and Algorithms',
        date: '0820-01-01',
        description: 'Al-Khwarizmi publishes systematic methods for solving equations, coining the term \'algorithm\'.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/Muhammad_ibn_Musa_al-Khwarizmi',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['eratosthenes_240bce'],
            following: ['leibniz_stepped_reckoner_1672'],
            parallel: []
        },
        technicalNature: {
            medium: 'Mathematical treatise',
            abstractionLevel: 'computational',
            centralMechanism: 'Introduced algebraic operations and step-by-step procedures for arithmetic, paving the way for modern algorithmic thought.',
            complexityScore: 4,
            innovationScore: 10
        },
        cognitiveDimensions: {
            computation: 7,
            pattern_recognition: 3,
            reasoning: 6,
            self_awareness: 1,
            creativity: 5,
            notable_innovation: 'Laid foundational algorithmic principles and the word \'algorithm\' stems from his name.'
        },
        impact: {
            technical: 9,
            societal: 7,
            philosophical: 6,
            economic: 8,
            geopolitical: 3
        },
        tags: ['mathematics', 'algorithm', 'IslamicGoldenAge'],
        contributors: ['Al-Khwarizmi'],
        era: 'Agricultural'
    },
    {
        id: 'leibniz_stepped_reckoner_1672',
        title: 'Leibniz\'s Stepped Reckoner',
        date: '1672-01-01',
        description: 'Leibniz constructs a mechanical calculator capable of all four arithmetic operations.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/Stepped_Reckoner',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['al_khwarizmi_820'],
            following: ['jacquard_loom_1801'],
            parallel: []
        },
        technicalNature: {
            medium: 'Mechanical device',
            abstractionLevel: 'implementational',
            centralMechanism: 'A stepped-drum mechanism turning input dials into results for addition, subtraction, multiplication, and division.',
            complexityScore: 3,
            innovationScore: 8
        },
        cognitiveDimensions: {
            computation: 7,
            pattern_recognition: 2,
            reasoning: 1,
            self_awareness: 1,
            creativity: 2,
            notable_innovation: 'Extended mechanical calculation to full arithmetic, influencing later computing machines.'
        },
        impact: {
            technical: 8,
            societal: 4,
            philosophical: 5,
            economic: 6,
            geopolitical: 2
        },
        tags: ['mechanical_calculator', 'Leibniz', 'arithmetic'],
        contributors: ['Gottfried Wilhelm Leibniz'],
        era: 'Exploration/Exploitation'
    },
    {
        id: 'jacquard_loom_1801',
        title: 'Jacquard Loom Pioneers Punched-Card Programming',
        date: '1801-01-01',
        description: 'Joseph Marie Jacquard\'s loom uses punched cards to weave complex patterns automatically.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/Jacquard_loom',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['leibniz_stepped_reckoner_1672'],
            following: ['babbage_analytical_engine_1830s'],
            parallel: []
        },
        technicalNature: {
            medium: 'Mechanical loom',
            abstractionLevel: 'implementational',
            centralMechanism: 'Punch cards feed instructions to control thread lifts, effectively \'programming\' weaving patterns.',
            complexityScore: 5,
            innovationScore: 8
        },
        cognitiveDimensions: {
            computation: 4,
            pattern_recognition: 1,
            reasoning: 1,
            self_awareness: 1,
            creativity: 3,
            notable_innovation: 'Used external instructions (cards) to direct machine actions, inspiring future computer punch cards.'
        },
        impact: {
            technical: 7,
            societal: 5,
            philosophical: 3,
            economic: 8,
            geopolitical: 3
        },
        tags: ['textile', 'punched_cards', 'automation'],
        contributors: ['Joseph Marie Jacquard'],
        era: 'Industrial'
    },
    {
        id: 'babbage_analytical_engine_1830s',
        title: 'Babbage\'s Analytical Engine Concept',
        date: '1837-01-01',
        description: 'Charles Babbage and Ada Lovelace outline a general-purpose programmable computer.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/Analytical_Engine',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['jacquard_loom_1801'],
            following: ['boole_laws_of_thought_1854'],
            parallel: []
        },
        technicalNature: {
            medium: 'Mechanical hardware design',
            abstractionLevel: 'implementational',
            centralMechanism: 'Proposed a mill (CPU) and store (memory) with punch card programs, enabling loops and conditional branches.',
            complexityScore: 7,
            innovationScore: 10
        },
        cognitiveDimensions: {
            computation: 8,
            pattern_recognition: 1,
            reasoning: 2,
            self_awareness: 1,
            creativity: 3,
            notable_innovation: 'First blueprint for a fully programmable, Turing-complete mechanical computer.'
        },
        impact: {
            technical: 9,
            societal: 2,
            philosophical: 8,
            economic: 1,
            geopolitical: 1
        },
        tags: ['Babbage', 'Lovelace', 'mechanical_computer'],
        contributors: ['Charles Babbage', 'Ada Lovelace'],
        era: 'Industrial'
    },
    {
        id: 'boole_laws_of_thought_1854',
        title: 'George Boole\'s Laws of Thought',
        date: '1854-01-01',
        description: 'Boole unifies logic and algebra, introducing the basis of binary operations.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/The_Laws_of_Thought',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['babbage_analytical_engine_1830s'],
            following: ['mcculloch_pitts_1943'],
            parallel: []
        },
        technicalNature: {
            medium: 'Mathematical/theory',
            abstractionLevel: 'computational',
            centralMechanism: 'Proposes that logical statements can be expressed and manipulated algebraically using AND, OR, NOT.',
            complexityScore: 3,
            innovationScore: 9
        },
        cognitiveDimensions: {
            computation: 6,
            pattern_recognition: 2,
            reasoning: 9,
            self_awareness: 1,
            creativity: 2,
            notable_innovation: 'Foundational for digital circuit logic and symbolic AI.'
        },
        impact: {
            technical: 10,
            societal: 5,
            philosophical: 8,
            economic: 4,
            geopolitical: 3
        },
        tags: ['logic', 'mathematics', 'binary'],
        contributors: ['George Boole'],
        era: 'Industrial'
    },
    {
        id: 'mcculloch_pitts_1943',
        title: 'McCulloch and Pitts Model of Neural Networks',
        date: '1943-01-01',
        description: 'They formalize neurons as threshold logic units, founding early neural network theory.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/Warren_Sturgis_McCulloch#McCulloch–Pitts_model',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['boole_laws_of_thought_1854'],
            following: ['turing_test_1950', 'cybernetics_1943_parallel'],
            parallel: []
        },
        technicalNature: {
            medium: 'Theoretical model',
            abstractionLevel: 'computational',
            centralMechanism: 'Represented neurons with binary on/off states aggregated in networks to explain some aspects of cognition.',
            complexityScore: 4,
            innovationScore: 8
        },
        cognitiveDimensions: {
            computation: 7,
            pattern_recognition: 5,
            reasoning: 2,
            self_awareness: 1,
            creativity: 2,
            notable_innovation: 'Linked neural structures to logical computation, inspiring perceptrons and deep networks.'
        },
        impact: {
            technical: 9,
            societal: 3,
            philosophical: 7,
            economic: 2,
            geopolitical: 2
        },
        tags: ['neural_networks', 'theory', 'threshold_logic'],
        contributors: ['Warren McCulloch', 'Walter Pitts'],
        era: 'Digital'
    },
    {
        id: 'cybernetics_1943_parallel',
        title: 'Cybernetics Coined (Rosenblueth, Wiener, Bigelow)',
        date: '1943-01-01',
        description: 'Cybernetics emerges to study feedback and control in animals and machines, an interdisciplinary field.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/Cybernetics',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['boole_laws_of_thought_1854'],
            following: ['turing_test_1950'],
            parallel: ['mcculloch_pitts_1943']
        },
        technicalNature: {
            medium: 'Theoretical model',
            abstractionLevel: 'computational',
            centralMechanism: 'Investigates communication, feedback loops, and adaptive control in mechanical and biological systems.',
            complexityScore: 4,
            innovationScore: 7
        },
        cognitiveDimensions: {
            computation: 5,
            pattern_recognition: 3,
            reasoning: 2,
            self_awareness: 1,
            creativity: 1,
            notable_innovation: 'Founded an interdisciplinary approach influencing AI, control theory, and robotics.'
        },
        impact: {
            technical: 7,
            societal: 4,
            philosophical: 6,
            economic: 2,
            geopolitical: 2
        },
        tags: ['cybernetics', 'feedback', 'Wiener'],
        contributors: ['Norbert Wiener', 'Arturo Rosenblueth', 'Julian Bigelow'],
        era: 'Digital'
    },
    {
        id: 'turing_test_1950',
        title: 'Alan Turing Proposes the Imitation Game',
        date: '1950-10-01',
        description: 'Turing posits a conversational test for machine intelligence in \'Computing Machinery and Intelligence\'.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/Turing_test',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['mcculloch_pitts_1943', 'cybernetics_1943_parallel'],
            following: ['dartmouth_conference_1956'],
            parallel: []
        },
        technicalNature: {
            medium: 'Theoretical model',
            abstractionLevel: 'mathematical/theory',
            centralMechanism: 'Human judges text chat with a hidden interlocutor; if they cannot distinguish the machine from a human, it is deemed \'intelligent.\'',
            complexityScore: 3,
            innovationScore: 9
        },
        cognitiveDimensions: {
            computation: 5,
            pattern_recognition: 5,
            reasoning: 5,
            self_awareness: 1,
            creativity: 2,
            notable_innovation: 'First operational definition of AI based on indistinguishability in conversation.'
        },
        impact: {
            technical: 7,
            societal: 8,
            philosophical: 9,
            economic: 3,
            geopolitical: 2
        },
        tags: ['Turing', 'AI_definition', 'NLP'],
        contributors: ['Alan Turing'],
        era: 'Digital'
    },
    {
        id: 'dartmouth_conference_1956',
        title: 'Dartmouth Conference Founds AI as a Field',
        date: '1956-06-01',
        description: 'Researchers gather at Dartmouth College, coining the term \'Artificial Intelligence\' and launching the discipline.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/Dartmouth_workshop',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['turing_test_1950'],
            following: ['lisp_1958'],
            parallel: []
        },
        technicalNature: {
            medium: 'Workshop/Proposal',
            abstractionLevel: 'mathematical/theory',
            centralMechanism: 'Participants hypothesize that human-level intelligence can be precisely described so machines can simulate it.',
            complexityScore: 3,
            innovationScore: 10
        },
        cognitiveDimensions: {
            computation: 6,
            pattern_recognition: 4,
            reasoning: 7,
            self_awareness: 1,
            creativity: 3,
            notable_innovation: 'Unified many researchers under one goal: building intelligent machines.'
        },
        impact: {
            technical: 8,
            societal: 5,
            philosophical: 8,
            economic: 3,
            geopolitical: 4
        },
        tags: ['AI_origin', 'McCarthy', 'Minsky', 'Newell', 'Simon'],
        contributors: ['John McCarthy', 'Marvin Minsky', 'Allen Newell', 'Herbert Simon'],
        era: 'Digital'
    },
    {
        id: 'lisp_1958',
        title: 'John McCarthy Invents Lisp',
        date: '1958-01-01',
        description: 'Lisp becomes the primary AI programming language for decades, enabling symbolic computation.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/Lisp_(programming_language)',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['dartmouth_conference_1956'],
            following: ['eliza_1966'],
            parallel: []
        },
        technicalNature: {
            medium: 'Software',
            abstractionLevel: 'algorithmic',
            centralMechanism: 'Provides list-processing, recursion, garbage collection, symbolic expression handling—ideal for AI.',
            complexityScore: 5,
            innovationScore: 8
        },
        cognitiveDimensions: {
            computation: 7,
            pattern_recognition: 3,
            reasoning: 6,
            self_awareness: 1,
            creativity: 4,
            notable_innovation: 'Enables fast prototyping of AI algorithms with symbolic data structures.'
        },
        impact: {
            technical: 9,
            societal: 5,
            philosophical: 5,
            economic: 4,
            geopolitical: 3
        },
        tags: ['programming_language', 'AI', 'McCarthy'],
        contributors: ['John McCarthy'],
        era: 'Digital'
    },
    {
        id: 'eliza_1966',
        title: 'Weizenbaum\'s ELIZA Chatbot',
        date: '1966-01-01',
        description: 'ELIZA mimics a Rogerian therapist through simple pattern matching, revealing user tendency to anthropomorphize machines.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/ELIZA',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['lisp_1958'],
            following: ['shakey_robot_1969'],
            parallel: []
        },
        technicalNature: {
            medium: 'Software',
            abstractionLevel: 'algorithmic',
            centralMechanism: 'Script-based keyword matching and textual reformatting gives an illusion of understanding.',
            complexityScore: 3,
            innovationScore: 7
        },
        cognitiveDimensions: {
            computation: 4,
            pattern_recognition: 4,
            reasoning: 2,
            self_awareness: 1,
            creativity: 2,
            notable_innovation: 'Demonstrated how shallow text processing can appear conversationally intelligent.'
        },
        impact: {
            technical: 5,
            societal: 8,
            philosophical: 6,
            economic: 2,
            geopolitical: 1
        },
        tags: ['chatbot', 'NLP', 'Weizenbaum'],
        contributors: ['Joseph Weizenbaum'],
        era: 'Digital'
    },
    {
        id: 'shakey_robot_1969',
        title: 'SRI\'s Shakey Robot Integrates Perception and Planning',
        date: '1969-01-01',
        description: 'Shakey is the first general-purpose mobile robot to reason about its actions using AI.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/Shakey_the_robot',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['eliza_1966'],
            following: ['mycin_1974'],
            parallel: []
        },
        technicalNature: {
            medium: 'Hardware/Software hybrid',
            abstractionLevel: 'implementational',
            centralMechanism: 'Uses cameras, rangefinders, and a STRIPS planner to navigate and manipulate objects in a structured environment.',
            complexityScore: 7,
            innovationScore: 9
        },
        cognitiveDimensions: {
            computation: 6,
            pattern_recognition: 5,
            reasoning: 7,
            self_awareness: 1,
            creativity: 3,
            notable_innovation: 'Unified robotics, computer vision, and AI planning in one platform.'
        },
        impact: {
            technical: 9,
            societal: 4,
            philosophical: 5,
            economic: 3,
            geopolitical: 3
        },
        tags: ['robotics', 'planning', 'SRI'],
        contributors: ['Nils Nilsson', 'Charles Rosen'],
        era: 'Digital'
    },
    {
        id: 'mycin_1974',
        title: 'MYCIN Expert System for Medical Diagnosis',
        date: '1974-01-01',
        description: 'MYCIN uses rules to identify blood infections and recommend antibiotics, often outperforming junior doctors.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/Mycin',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['shakey_robot_1969'],
            following: ['xcon_1980'],
            parallel: []
        },
        technicalNature: {
            medium: 'Software',
            abstractionLevel: 'algorithmic',
            centralMechanism: 'IF-THEN rules plus certainty factors to handle uncertain clinical data and produce recommendations.',
            complexityScore: 6,
            innovationScore: 8
        },
        cognitiveDimensions: {
            computation: 5,
            pattern_recognition: 4,
            reasoning: 7,
            self_awareness: 1,
            creativity: 2,
            notable_innovation: 'Demonstrated viability of rule-based expert systems in a high-stakes domain.'
        },
        impact: {
            technical: 8,
            societal: 6,
            philosophical: 4,
            economic: 3,
            geopolitical: 2
        },
        tags: ['expert_system', 'medical', 'Stanford'],
        contributors: ['Edward Shortliffe'],
        era: 'Digital'
    },
    {
        id: 'xcon_1980',
        title: 'XCON (Expert Configurer) at DEC',
        date: '1980-01-01',
        description: 'XCON configures VAX systems automatically, saving DEC millions by rule-based reasoning.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/XCON',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['mycin_1974'],
            following: ['fifth_generation_1982'],
            parallel: []
        },
        technicalNature: {
            medium: 'Software',
            abstractionLevel: 'algorithmic',
            centralMechanism: 'Rule-based system capturing expert knowledge for hardware configuration tasks.',
            complexityScore: 7,
            innovationScore: 6
        },
        cognitiveDimensions: {
            computation: 5,
            pattern_recognition: 2,
            reasoning: 7,
            self_awareness: 1,
            creativity: 1,
            notable_innovation: 'First major commercial success of an expert system, spurring the \'expert systems boom.\''
        },
        impact: {
            technical: 7,
            societal: 5,
            philosophical: 3,
            economic: 8,
            geopolitical: 3
        },
        tags: ['expert_system', 'DEC', 'rule_based'],
        contributors: ['John McDermott'],
        era: 'Digital'
    },
    {
        id: 'fifth_generation_1982',
        title: 'Japan\'s Fifth Generation Computer Systems (FGCS) Project',
        date: '1982-01-01',
        description: 'Japan invests heavily in logic programming and parallel architectures for AI, aiming for leaps in computing.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/Fifth_generation_computer',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['xcon_1980'],
            following: ['lisp_winter_1987'],
            parallel: []
        },
        technicalNature: {
            medium: 'Hardware/Software integrated',
            abstractionLevel: 'implementational',
            centralMechanism: 'Massively parallel Prolog machines intended to accelerate AI inference, with strong government backing.',
            complexityScore: 9,
            innovationScore: 7
        },
        cognitiveDimensions: {
            computation: 8,
            pattern_recognition: 3,
            reasoning: 7,
            self_awareness: 1,
            creativity: 2,
            notable_innovation: 'National-scale AI initiative that spurred global research competition.'
        },
        impact: {
            technical: 6,
            societal: 5,
            philosophical: 2,
            economic: 5,
            geopolitical: 8
        },
        tags: ['Japan', 'parallel_computing', 'Prolog'],
        contributors: ['ICOT (Japan)'],
        era: 'Digital'
    },
    {
        id: 'lisp_winter_1987',
        title: 'Lisp Machine Market Collapse - AI Winter',
        date: '1987-01-01',
        description: 'Expensive specialized Lisp workstations fail commercially, contributing to decreased AI investment.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/History_of_Artificial_Intelligence#AI_Winters',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['fifth_generation_1982'],
            following: ['td_gammon_1992'],
            parallel: []
        },
        technicalNature: {
            medium: 'Hardware market',
            abstractionLevel: 'implementational',
            centralMechanism: 'Dedicated Lisp hardware overshadowed by cheaper, faster general-purpose PCs and RISC machines.',
            complexityScore: 4,
            innovationScore: 4
        },
        cognitiveDimensions: {
            computation: 4,
            pattern_recognition: 1,
            reasoning: 1,
            self_awareness: 1,
            creativity: 1,
            notable_innovation: 'Its collapse signaled the end of the 80s expert systems boom and triggered reduced AI funding.'
        },
        impact: {
            technical: 5,
            societal: 4,
            philosophical: 3,
            economic: 6,
            geopolitical: 2
        },
        tags: ['AI_winter', 'Lisp_machines'],
        contributors: ['Symbolics', 'LMI', 'Xerox'],
        era: 'Digital'
    },
    {
        id: 'td_gammon_1992',
        title: 'Tesauro\'s TD-Gammon Achieves Master-Level Backgammon',
        date: '1992-01-01',
        description: 'Neural network learns backgammon via reinforcement learning, surpassing many human experts.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/TD-Gammon',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['lisp_winter_1987'],
            following: ['deep_blue_1997'],
            parallel: []
        },
        technicalNature: {
            medium: 'Software',
            abstractionLevel: 'algorithmic',
            centralMechanism: 'Temporal-difference learning updates a neural net that estimates board positions\' expected outcomes.',
            complexityScore: 6,
            innovationScore: 9
        },
        cognitiveDimensions: {
            computation: 7,
            pattern_recognition: 6,
            reasoning: 5,
            self_awareness: 1,
            creativity: 3,
            notable_innovation: 'Pioneered RL in game strategy, proved networks could discover advanced tactics without explicit human input.'
        },
        impact: {
            technical: 8,
            societal: 4,
            philosophical: 4,
            economic: 3,
            geopolitical: 2
        },
        tags: ['reinforcement_learning', 'backgammon', 'neural_network'],
        contributors: ['Gerald Tesauro'],
        era: 'Digital'
    },
    
    {
        id: 'ibm_watson_jeopardy_2011',
        title: 'IBM Watson Triumphs on Jeopardy!',
        date: '2011-02-16',
        description: 'Watson\'s QA system beats human champions on Jeopardy!, showcasing advanced NLP and search.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/Watson_(computer)',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['deep_blue_1997'],
            following: ['alexnet_imagenet_2012'],
            parallel: []
        },
        technicalNature: {
            medium: 'Software on HPC',
            abstractionLevel: 'algorithmic',
            centralMechanism: 'Ensemble of NLP techniques and machine learning for evidence scoring.',
            complexityScore: 8,
            innovationScore: 7
        },
        cognitiveDimensions: {
            computation: 8,
            pattern_recognition: 7,
            reasoning: 5,
            self_awareness: 1,
            creativity: 3,
            notable_innovation: 'Demonstrated integrated data-driven approach to open-domain QA at scale.'
        },
        impact: {
            technical: 8,
            societal: 9,
            philosophical: 5,
            economic: 6,
            geopolitical: 2
        },
        tags: ['IBM', 'QA_system', 'NLP'],
        contributors: ['David Ferrucci', 'IBM Research Team'],
        era: 'Informational'
    },
    {
        id: 'alexnet_imagenet_2012',
        title: 'AlexNet Dominates ImageNet 2012',
        date: '2012-09-30',
        description: 'AlexNet\'s convolutional neural network slashes error rates in image classification, igniting the deep learning revolution.',
        branchId: 'main',
        urls: {
            primary: 'https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['ibm_watson_jeopardy_2011'],
            following: ['alphago_2016'],
            parallel: []
        },
        technicalNature: {
            medium: 'Software (deep neural net)',
            abstractionLevel: 'algorithmic',
            centralMechanism: 'Stacked convolutional layers trained with backprop on GPUs, discovering hierarchical image features from large data.',
            complexityScore: 8,
            innovationScore: 9
        },
        cognitiveDimensions: {
            computation: 8,
            pattern_recognition: 9,
            reasoning: 3,
            self_awareness: 1,
            creativity: 3,
            notable_innovation: 'Proved deep CNNs plus big data significantly outperform traditional methods.'
        },
        impact: {
            technical: 10,
            societal: 7,
            philosophical: 5,
            economic: 9,
            geopolitical: 4
        },
        tags: ['CNN', 'ImageNet', 'deep_learning'],
        contributors: ['Alex Krizhevsky', 'Ilya Sutskever', 'Geoffrey Hinton'],
        era: 'Informational'
    },
    {
        id: 'alphago_2016',
        title: 'AlphaGo Defeats Lee Sedol at Go',
        date: '2016-03-15',
        description: 'DeepMind\'s AlphaGo beats one of the world\'s best Go players, surprising experts with its creative moves.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/AlphaGo_versus_Lee_Sedol',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['alexnet_imagenet_2012'],
            following: ['alphafold2_2020'],
            parallel: []
        },
        technicalNature: {
            medium: 'Software',
            abstractionLevel: 'algorithmic',
            centralMechanism: 'Combines deep convolutional policy/value networks with Monte Carlo Tree Search to evaluate positions efficiently.',
            complexityScore: 9,
            innovationScore: 10
        },
        cognitiveDimensions: {
            computation: 8,
            pattern_recognition: 9,
            reasoning: 8,
            self_awareness: 1,
            creativity: 5,
            notable_innovation: 'First AI to defeat a top Go professional, heralding deep RL\'s potential in complex domains.'
        },
        impact: {
            technical: 10,
            societal: 9,
            philosophical: 6,
            economic: 7,
            geopolitical: 8
        },
        tags: ['DeepMind', 'Go', 'reinforcement_learning'],
        contributors: ['David Silver', 'Demis Hassabis', 'DeepMind Team'],
        era: 'Informational'
    },
    {
        id: 'alphafold2_2020',
        title: 'AlphaFold2 Solves Protein Folding Challenge',
        date: '2020-11-30',
        description: 'AlphaFold2 achieves unprecedented accuracy in predicting 3D protein structures, revolutionizing biology.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/AlphaFold',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['alphago_2016'],
            following: ['chatgpt_2022'],
            parallel: []
        },
        technicalNature: {
            medium: 'Software',
            abstractionLevel: 'algorithmic',
            centralMechanism: 'Transformer-based network that infers protein shape from amino acid sequences using evolutionary and geometric priors.',
            complexityScore: 9,
            innovationScore: 9
        },
        cognitiveDimensions: {
            computation: 8,
            pattern_recognition: 9,
            reasoning: 5,
            self_awareness: 1,
            creativity: 2,
            notable_innovation: 'Solves a 50-year-old grand challenge in molecular biology, guiding drug discovery and biotech breakthroughs.'
        },
        impact: {
            technical: 10,
            societal: 8,
            philosophical: 5,
            economic: 9,
            geopolitical: 6
        },
        tags: ['DeepMind', 'biology', 'protein_folding'],
        contributors: ['DeepMind Team'],
        era: 'Informational'
    },
    {
        id: 'chatgpt_2022',
        title: 'ChatGPT Goes Mainstream',
        date: '2022-11-30',
        description: 'OpenAI\'s GPT-based chatbot amasses 100M users in two months, fueling conversation about generative AI.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/ChatGPT',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['alphafold2_2020'],
            following: ['gpt4_2023'],
            parallel: []
        },
        technicalNature: {
            medium: 'Software (LLM)',
            abstractionLevel: 'algorithmic',
            centralMechanism: 'Transformer-based next-token predictor fine-tuned for dialogue with reinforcement learning from human feedback.',
            complexityScore: 9,
            innovationScore: 8
        },
        cognitiveDimensions: {
            computation: 9,
            pattern_recognition: 9,
            reasoning: 6,
            self_awareness: 1,
            creativity: 7,
            notable_innovation: 'Intuitive conversational AI bridging multiple domains, raising user expectations and ethics concerns.'
        },
        impact: {
            technical: 9,
            societal: 10,
            philosophical: 7,
            economic: 9,
            geopolitical: 6
        },
        tags: ['OpenAI', 'LLM', 'generativeAI', 'chatbot'],
        contributors: ['OpenAI'],
        era: 'Informational'
    },
    {
        id: 'gpt4_2023',
        title: 'GPT-4 Introduced as a Multi-Modal LLM',
        date: '2023-03-14',
        description: 'OpenAI\'s GPT-4 shows advanced reasoning and vision capabilities, scoring highly on standardized exams.',
        branchId: 'main',
        urls: {
            primary: 'https://en.wikipedia.org/wiki/GPT-4',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['chatgpt_2022'],
            following: [],
            parallel: []
        },
        technicalNature: {
            medium: 'Software (LLM)',
            abstractionLevel: 'algorithmic',
            centralMechanism: 'Expanded parameter Transformer model with multi-modal input and refined alignment training for stronger performance.',
            complexityScore: 9,
            innovationScore: 8
        },
        cognitiveDimensions: {
            computation: 9,
            pattern_recognition: 9,
            reasoning: 7,
            self_awareness: 2,
            creativity: 8,
            notable_innovation: 'Elevates large language models to broader reasoning tasks, bridging text and images.'
        },
        impact: {
            technical: 10,
            societal: 9,
            philosophical: 8,
            economic: 9,
            geopolitical: 7
        },
        tags: ['OpenAI', 'LLM', 'multimodal'],
        contributors: ['OpenAI'],
        era: 'Informational'
    },
    
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
    },
    
    
    
    {
        id: 'meta_seamlessm4t_2023',
        title: 'Meta Introduces SeamlessM4T for Multimodal Translation',
        date: '2023-08-22',
        description: 'Meta unveils a universal translator model that handles speech and text across dozens of languages.',
        branchId: 'main',
        urls: {
            primary: 'https://ai.meta.com/seamlessm4t',
            documentation: '',
            relatedResources: []
        },
        connections: {
            preceding: ['meta_llama2_2023'],
            following: ['frontier_ai_agents_2024'],
            parallel: []
        },
        technicalNature: {
            medium: 'Software/Translation',
            abstractionLevel: 'algorithmic',
            centralMechanism: 'Unified model handling multiple modalities and languages simultaneously.',
            complexityScore: 8,
            innovationScore: 7
        },
        cognitiveDimensions: {
            computation: 8,
            pattern_recognition: 9,
            reasoning: 6,
            self_awareness: 2,
            creativity: 5,
            notable_innovation: 'First unified model handling speech and text translation across many languages.'
        },
        impact: {
            technical: 8,
            societal: 7,
            philosophical: 4,
            economic: 6,
            geopolitical: 5
        },
        tags: ['Meta', 'translation', 'multimodal', 'language'],
        contributors: ['Meta AI Team'],
        era: 'Informational'
    }
];

// Fix the eventsFromEventsFile reference issue by removing the merge functionality
// Remove our fix from earlier
// const mergedEvents = timelineEvents; // Skip the merge since eventsFromEventsFile doesn't exist

// Instead, directly process the existing events without trying to merge with undefined data
// Process events to ensure proper branch assignment
const processTimelineEvents = (events: TimelineEvent[]) => {
    let mainBranchCount = 0;
    let futureBranchCount = 0;
    let optimisticCount = 0;
    let pessimisticCount = 0;

    // Sort the events chronologically
    events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
    });

    // Process each event to count branches but preserve original branchId
    events.forEach(event => {
        const eventDate = new Date(event.date);

        // Count events by branch but don't modify branchId
        if (eventDate < BRANCH_POINT_DATE || event.branchId === 'main') {
            mainBranchCount++;
        } else if (event.branchId === 'future-optimistic') {
            optimisticCount++;
            futureBranchCount++;
        } else if (event.branchId === 'future-pessimistic') {
            pessimisticCount++;
            futureBranchCount++;
        }
    });

    console.log(`Timeline events: ${events.length} total`);
    console.log(`- ${mainBranchCount} main branch events`);
    console.log(`- ${futureBranchCount} future branch events:`);
    console.log(`  - ${optimisticCount} optimistic`);
    console.log(`  - ${pessimisticCount} pessimistic`);

    return events;
};

// Process and export the existing timeline events directly
export default processTimelineEvents(timelineEvents); 