import './App.css';
import Timeline from './components/timeline/Timeline';
import { useRef, useState, useEffect } from 'react';

// Define filter mode type for type safety
type FilterMode = 'Technical' | 'Societal' | 'Philosophical';

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Add state for active filter mode
  const [activeFilter, setActiveFilter] = useState<FilterMode>('Technical');
  
  // Refs for inertial scrolling
  const lastMouseX = useRef(0);
  const velocity = useRef(0);
  const lastTimestamp = useRef(0);
  const animationFrame = useRef<number | null>(null);
  
  // Handle filter change
  const handleFilterChange = (mode: FilterMode) => {
    setActiveFilter(mode);
    // Future implementation can change filtering behavior here
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
      <div className="title-bar">
        <div className="title-container">
          <h1 className="main-title">Wayfaring on a Starless Night</h1>
          <button className="title-button">~</button>
        </div>
        <div className="filter-options">
          <button 
            className={`filter-option ${activeFilter === 'Technical' ? 'active' : ''}`}
            onClick={() => handleFilterChange('Technical')}
          >
            Technical
          </button>
          <button 
            className={`filter-option ${activeFilter === 'Societal' ? 'active' : ''}`}
            onClick={() => handleFilterChange('Societal')}
          >
            Societal
          </button>
          <button 
            className={`filter-option ${activeFilter === 'Philosophical' ? 'active' : ''}`}
            onClick={() => handleFilterChange('Philosophical')}
          >
            Philosophical
          </button>
        </div>
      </div>
      
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
    </div>
  );
}

export default App;
