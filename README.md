# Algorithmic Capability Timeline

A modular, React-based interactive timeline tool for illustrating the historical progression and future branching of algorithmic capability.

## Overview

This project provides a visual timeline of key milestones in AI and algorithmic capability, with support for:

- Historical milestones in a linear timeline
- Speculative future scenarios as branching timelines
- Thematic filtering to highlight specific dimensions (technical, societal, philosophical)
- Multiple navigation methods (scroll, drag, zoom)

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
│   └── mockData.ts              # Sample timeline data
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

## Future Enhancements

- Advanced navigation with zoom and pan capabilities
- CMS integration for easier content management
- Enhanced visualization options
- User accounts and saved views
- Collaborative editing features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React and TypeScript communities
- Contributors and maintainers
