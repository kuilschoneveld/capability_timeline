import './App.css';
import Timeline from './components/timeline/Timeline';
import NetworkedTimelinePage from './pages/NetworkedTimelinePage';
import BasicTestPage from './pages/BasicTestPage';
import { useRef, useState, useEffect } from 'react';

// Define view mode type for timeline views
type ViewMode = 'standard' | 'networked' | 'test';

// Ship/Star icon for the toggle button
const ShipStarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.5 9H21L16 13.5L18 20L12 16L6 20L8 13.5L3 9H9.5L12 2Z" 
          fill="currentColor" 
          stroke="currentColor" 
          strokeWidth="1" />
  </svg>
);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Add state for active view mode
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  
  // Add filter states (non-functional for now)
  const [filterTechnical, setFilterTechnical] = useState(true);
  const [filterSocietal, setFilterSocietal] = useState(true);
  const [filterPhilosophical, setFilterPhilosophical] = useState(true);
  
  // Refs for inertial scrolling
  const lastMouseX = useRef(0);
  const velocity = useRef(0);
  const lastTimestamp = useRef(0);
  const animationFrame = useRef<number | null>(null);
  
  // Toggle between view modes
  const toggleViewMode = () => {
    setViewMode(current => {
      if (current === 'standard') return 'networked';
      if (current === 'networked') return 'test';
      return 'standard';
    });
  };
  
  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't initiate drag if clicking on interactive elements
    if ((e.target as Element).closest('.timeline-item, button, .show-future-branches-button')) {
      return;
    }
    
    // Cancel any ongoing inertial scrolling
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    
    setIsDragging(true);
    setStartX(e.clientX);
    lastMouseX.current = e.clientX;
    lastTimestamp.current = performance.now();
    velocity.current = 0;
    
    if (mainRef.current) {
      setScrollLeft(mainRef.current.scrollLeft);
      document.body.style.cursor = 'grabbing';
    }
    
    e.preventDefault();
  };
  
  // Handle drag
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const x = e.clientX;
    const now = performance.now();
    const dt = now - lastTimestamp.current;
    const walk = (x - startX) * 2; // Movement multiplier
    
    if (mainRef.current) {
      mainRef.current.scrollLeft = scrollLeft - walk;
    }
    
    // Calculate velocity in pixels per millisecond
    if (dt > 0) {
      // Applying a stronger velocity value for more pronounced effect
      velocity.current = (lastMouseX.current - x) / dt * 20; // Scale for stronger effect
    }
    
    lastMouseX.current = x;
    lastTimestamp.current = now;
  };
  
  // Start inertial scrolling with a simpler and more reliable approach
  const startInertialScroll = () => {
    // Clear any existing animation
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    
    // Get initial velocity (applying a minimum threshold)
    let initialVelocity = velocity.current;
    
    // Simple console debug
    console.log('Starting inertial scroll with velocity:', initialVelocity);
    
    // Only start scrolling if there's meaningful velocity
    if (Math.abs(initialVelocity) < 0.1) {
      console.log('Velocity too low, not starting inertial scroll');
      return;
    }
    
    const scroll = () => {
      // Reduce velocity by 5% each frame
      initialVelocity *= 0.95;
      
      // Apply scrolling if we have a reference and velocity is significant
      if (mainRef.current && Math.abs(initialVelocity) > 0.1) {
        mainRef.current.scrollLeft += initialVelocity;
        animationFrame.current = requestAnimationFrame(scroll);
      } else {
        // Stop animation when velocity gets too small
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
          animationFrame.current = null;
        }
        console.log('Inertial scrolling ended');
      }
    };
    
    // Start the animation
    animationFrame.current = requestAnimationFrame(scroll);
  };
  
  // Handle drag end
  const handleMouseUp = () => {
    if (!isDragging) return;
    
    console.log('Mouse up, final velocity:', velocity.current);
    
    setIsDragging(false);
    document.body.style.cursor = '';
    
    // Important: we need to start inertial scrolling AFTER setting isDragging to false
    // to avoid state update conflicts
    setTimeout(startInertialScroll, 0);
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    if (isDragging) {
      console.log('Mouse leave, final velocity:', velocity.current);
      
      setIsDragging(false);
      document.body.style.cursor = '';
      
      // Use setTimeout to ensure state updates complete first
      setTimeout(startInertialScroll, 0);
    }
  };
  
  // Add global event listeners to handle mouse events outside the app
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const x = e.clientX;
      const now = performance.now();
      const dt = now - lastTimestamp.current;
      const walk = (x - startX) * 2;
      
      if (mainRef.current) {
        mainRef.current.scrollLeft = scrollLeft - walk;
      }
      
      // Calculate velocity in pixels per millisecond with scaling
      if (dt > 0) {
        velocity.current = (lastMouseX.current - x) / dt * 20;
      }
      
      lastMouseX.current = x;
      lastTimestamp.current = now;
    };
    
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        console.log('Global mouse up, final velocity:', velocity.current);
        
        setIsDragging(false);
        document.body.style.cursor = '';
        
        // Use setTimeout to ensure state updates complete first
        setTimeout(startInertialScroll, 0);
      }
    };
    
    // Add global listeners
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    // Clean up
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isDragging, startX, scrollLeft]);
  
  return (
    <div className="App">
      {/* Common header for all views */}
      <header className="common-header">
        <div className="title-container">
          <h1 className="main-title">Wayfaring on a Starless Night</h1>
          
          {/* Circular toggle button with ship/star icon */}
          <button 
            className="toggle-view-btn"
            onClick={toggleViewMode}
            title={`Switch to ${
              viewMode === 'standard' ? 'Network' : 
              viewMode === 'networked' ? 'Test' : 'Standard'
            } view`}
          >
            <ShipStarIcon />
          </button>
        </div>
        
        {/* Filter toggles: Technical/Societal/Philosophical */}
        <div className="dimension-toggles">
          <button 
            className={`dimension-toggle-btn ${filterTechnical ? 'active' : ''}`}
            onClick={() => setFilterTechnical(!filterTechnical)}
          >
            Technical
          </button>
          <button 
            className={`dimension-toggle-btn ${filterSocietal ? 'active' : ''}`}
            onClick={() => setFilterSocietal(!filterSocietal)}
          >
            Societal
          </button>
          <button 
            className={`dimension-toggle-btn ${filterPhilosophical ? 'active' : ''}`}
            onClick={() => setFilterPhilosophical(!filterPhilosophical)}
          >
            Philosophical
          </button>
        </div>
      </header>

      {/* Render the appropriate view based on viewMode */}
      <div className="view-container">
        {viewMode === 'standard' && (
          <>
            <main 
              ref={mainRef}
              className={`App-main ${isDragging ? 'dragging' : ''}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              <Timeline />
            </main>
            
            <div className="timeline-scrollbar">
              <div className="year-indicator">Year</div>
            </div>
          </>
        )}

        {viewMode === 'networked' && (
          <NetworkedTimelinePage />
        )}
        
        {viewMode === 'test' && (
          <BasicTestPage />
        )}
      </div>
    </div>
  );
}

export default App;
