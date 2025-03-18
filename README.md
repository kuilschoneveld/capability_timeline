# Algorithmic Capability Timeline

A modular, React-based interactive timeline tool for illustrating the historical progression and future branching of algorithmic capability.

## Overview

This project provides a visual timeline of key milestones in AI and algorithmic capability, with support for:

- Historical milestones in a linear timeline
- Speculative future scenarios as branching timelines
- Thematic filtering to highlight specific dimensions (technical, societal, philosophical, economic, geopolitical)
- Multiple navigation methods (scroll, drag, zoom)

## Current State & Vision

The Capability Timeline currently exists as a fully functional research prototype with several key features:

- **Historical Timeline**: A comprehensive chronology of significant algorithmic advancements from ancient times to the present day, with detailed information about each milestone's technical nature, cognitive dimensions, and impact.

- **Future Branches**: Two speculative future paths (optimistic and pessimistic) that explore potential trajectories of algorithmic capability development, allowing for comparison and reflection.

- **Advanced Search & Filtering**: Users can filter events by thematic dimensions, impact scores, and time periods to focus on specific aspects of algorithmic development.

- **Comparative Analysis**: The timeline allows for side-by-side comparison of different eras and branches, facilitating deeper understanding of patterns and trends in capability development.

This has been an exploration of capabilities in more than one sense, and the app has transformed into a living research prototype I plan to enrich further. The project serves as both a technical exploration of interactive visualization capabilities and a conceptual exploration of how we understand and communicate the development of algorithmic systems through time.

The timeline is designed with extensibility in mind, providing space for expanding into more customized speculative futures, additional historical detail, and deeper analysis of the relationships between different capability developments.

## Features

- **Modular Architecture**: Clean, component-based structure for easy expansion
- **Timeline Visualization**: Chronological display of milestones with expandable details
- **Filtering Capabilities**: Filter by thematic dimensions and importance
- **Future Branching**: Support for alternative future timelines
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
src/
├── components/
│   └── timeline/
│       ├── Timeline.tsx         # Main timeline container
│       ├── TimelineBranch.tsx   # Branch component
│       ├── TimelineItem.tsx     # Individual milestone
│       └── TimelineControls.tsx # Filtering and navigation controls
├── data/
│   └── timelineDatabase.ts      # Timeline event data
├── hooks/
│   └── useTimeline.ts           # Custom hook for timeline state management
├── services/
│   └── timelineService.ts       # Service for data operations
├── types/
│   └── index.ts                 # TypeScript type definitions
└── App.tsx                      # Main application component
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/capability_timeline.git
   cd capability_timeline
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser to `http://localhost:5173` to view the application

### Building for Production

To build the application for production:

```
npm run build
```

### Deploying to GitHub Pages

1. Update the `homepage` field in `package.json` with your GitHub Pages URL:
   ```json
   "homepage": "https://yourusername.github.io/capability_timeline"
   ```

2. Deploy to GitHub Pages:
   ```
   npm run deploy
   ```

## Future Directions

- **Expanded Event Database**: Adding more granular historical events and additional future scenarios
- **Interactive Visualization Enhancements**: Advanced navigation with zoom and pan capabilities
- **Collaborative Features**: Allowing users to create and share their own speculative future branches
- **Integration with Research**: Connecting timeline events with academic references and papers
- **Comparative Analysis Tools**: Enhanced features for comparing different eras and development paths
- **CMS Integration**: Easier content management for timeline events and branches

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React and TypeScript communities
- Contributors and maintainers
