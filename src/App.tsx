import './App.css';
import Timeline from './components/timeline/Timeline';
import NetworkedTimelinePage from './pages/NetworkedTimelinePage';
import BasicTestPage from './pages/BasicTestPage';
import { useRef, useState, useEffect } from 'react';
import timelineEvents from './data/timelineDatabase';

// Define view mode type for timeline views
type ViewMode = 'standard' | 'networked' | 'test';

// Define timeline title type
type TimelineTitle = 'historical' | 'optimistic' | 'pessimistic' | 'future';

// Define era categories for mapping
type EraCategoryType = 'Agricultural' | 'Exploration' | 'Industrial' | 'Digital' | 'Informational';

// Function to map timeline event dates to era categories
const getEraCategory = (event: typeof timelineEvents[0]): EraCategoryType => {
  // Get the year from the event date
  const year = new Date(event.date).getFullYear();
  
  // Map based on year ranges
  if (year < 1400) {
    return 'Agricultural'; // Up to middle ages
  } else if (year >= 1400 && year < 1800) {
    return 'Exploration'; // Middle ages to end of 1700s
  } else if (year >= 1800 && year < 1945) {
    return 'Industrial'; // Industrial revolution to end of WW2
  } else if (year >= 1945 && year < 2000) {
    return 'Digital'; // v Neuman/Turing computation to internet
  } else {
    return 'Informational'; // Consumer internet, early 2000s onward
  }
};

// Ship/Star icon for the toggle button
const ShipStarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.5 9H21L16 13.5L18 20L12 16L6 20L8 13.5L3 9H9.5L12 2Z" 
          fill="currentColor" 
          stroke="currentColor" 
          strokeWidth="1" />
  </svg>
);

// Close X icon for the options menu
const CloseIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Search icon
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
          stroke="#0A93FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Get the current event based on era categories for display in the options box
const getCurrentEventEra = (searchTerm: string): { eraName: string, originalEra: string } => {
  if (searchTerm) {
    // If there's a search term active, find the first matching event's era
    const matchingEvents = timelineEvents.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    if (matchingEvents.length > 0) {
      const event = matchingEvents[0];
      return { 
        eraName: getEraCategory(event),
        originalEra: event.era
      };
    }
  }
  
  // Default to showing the most recent historical event's era
  const historicalEvents = timelineEvents.filter(e => new Date(e.date).getFullYear() <= new Date().getFullYear())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (historicalEvents.length > 0) {
    return { 
      eraName: getEraCategory(historicalEvents[0]),
      originalEra: historicalEvents[0].era
    };
  }
  
  // Fallback
  return { eraName: 'Informational', originalEra: 'Modern AI' };
};

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
  
  // Add state for options box visibility
  const [showOptionsBox, setShowOptionsBox] = useState(true);
  
  // Add state to track if the options box is collapsed
  const [optionsCollapsed, setOptionsCollapsed] = useState(false);
  
  // Add state to track if the options box was manually closed/collapsed
  const [optionsManuallyCollapsed, setOptionsManuallyCollapsed] = useState(false);
  
  // Add search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof timelineEvents>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  
  // Add state for current timeline title
  const [timelineTitle, setTimelineTitle] = useState<TimelineTitle>('historical');
  
  // Refs for inertial scrolling
  const lastMouseX = useRef(0);
  const velocity = useRef(0);
  const lastTimestamp = useRef(0);
  const animationFrame = useRef<number | null>(null);
  
  // Track last scroll position state
  const wasInFuture = useRef(false);
  
  // Close dropdown when clicking outside
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Toggle between view modes
  const toggleViewMode = () => {
    setViewMode(current => {
      if (current === 'standard') return 'networked';
      if (current === 'networked') return 'test';
      return 'standard';
    });
  };
  
  // Helper to get the title text based on current timeline title state
  const getTimelineTitleText = () => {
    switch(timelineTitle) {
      case 'historical':
        return 'Historical Timeline - increasing algorithmic capability';
      case 'optimistic':
        return 'Future Branches - opportunities and challenges';
      case 'pessimistic':
        return 'Future Branches - opportunities and challenges';
      case 'future':
        return 'Future Branches - opportunities and challenges';
      default:
        return '';
    }
  };
  
  // Handle manually collapsing the options menu
  const handleCollapseOptions = () => {
    setOptionsManuallyCollapsed(true);
    setOptionsCollapsed(true);
  };
  
  // Handle expanding the options menu
  const handleExpandOptions = () => {
    setOptionsManuallyCollapsed(false);
    setOptionsCollapsed(false);
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedResultIndex(-1);
    
    if (value.trim() === '') {
      setSearchResults([]);
    } else {
      const searchTermLower = value.toLowerCase();
      const filtered = timelineEvents.filter(event => 
        event.title.toLowerCase().includes(searchTermLower) ||
        (event.description && event.description.toLowerCase().includes(searchTermLower))
      ).slice(0, 5); // Limit to 5 results
      
      setSearchResults(filtered);
    }
  };
  
  // Handle clicking on a search result
  const handleResultClick = (eventId: string) => {
    // Clear the search
    setSearchTerm('');
    setSearchResults([]);
    setSelectedResultIndex(-1);
    
    // Find the element with this event ID in the timeline
    const eventElement = mainRef.current?.querySelector(`[data-event-id="${eventId}"]`);
    
    if (eventElement && mainRef.current) {
      // Wait a brief moment to ensure DOM updates are processed
      setTimeout(() => {
        // Get the position of the event element
        const rect = eventElement.getBoundingClientRect();
        const eventCenterX = rect.left + rect.width / 2;
        const viewportCenterX = window.innerWidth / 2;
        
        // Calculate scroll amount to center the event
        const scrollAdjustment = eventCenterX - viewportCenterX;
        
        // Scroll to the event smoothly - check mainRef is still available
        if (mainRef.current) {
          mainRef.current.scrollBy({
            left: scrollAdjustment,
            behavior: 'smooth'
          });
        }
        
        // Highlight the event
        eventElement.classList.add('highlight-event');
        
        // Expand the event card by triggering a click on it
        // Wait for the scrolling to complete before expanding
        setTimeout(() => {
          const timelineItem = eventElement as HTMLElement;
          if (!timelineItem.classList.contains('expanded')) {
            timelineItem.click();
          }
          
          // Remove highlight after animation completes
          setTimeout(() => {
            eventElement.classList.remove('highlight-event');
          }, 1500);
        }, 700); // Slightly longer than the time for the scroll to complete
      }, 50); // Small delay to ensure DOM is ready
    }
  };
  
  // Handle keyboard navigation in search
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResultIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        const selectedIndex = selectedResultIndex === -1 ? 0 : selectedResultIndex;
        if (searchResults[selectedIndex]) {
          handleResultClick(searchResults[selectedIndex].id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setSearchTerm('');
        setSearchResults([]);
        setSelectedResultIndex(-1);
        break;
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchResults.length > 0 &&
        searchInputRef.current &&
        resultsRef.current &&
        !searchInputRef.current.contains(e.target as Node) &&
        !resultsRef.current.contains(e.target as Node)
      ) {
        setSearchResults([]);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchResults]);
  
  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't initiate drag if clicking on interactive elements or the options box
    if ((e.target as Element).closest('.timeline-item, button, .show-future-branches-button, .options-expand-btn, .options-close-btn, .timeline-options-box')) {
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
  
  // Add scroll event listener to hide/show options box and update timeline title
  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        // Calculate midpoint of window
        const windowMidpoint = window.innerWidth / 2;
        
        // Find the branch point element (the "hide future" button or present moment marker)
        const branchPointElement = mainRef.current.querySelector('.timeline-present-marker');
        
        // Only collapse options when the branch point has passed the middle of the screen
        let shouldExpandOptions = true;
        
        if (branchPointElement) {
          const branchPointRect = branchPointElement.getBoundingClientRect();
          const branchPointCenter = branchPointRect.left + (branchPointRect.width / 2);
          
          // Expand options box when branch point is to the right of or at the middle of the screen
          // Collapse it when the branch point has passed the middle (is to the left)
          shouldExpandOptions = branchPointCenter >= windowMidpoint;
          
          // Track if we were in the future view
          const isInFuture = !shouldExpandOptions;
          
          // If we manually collapsed the options and we're coming back from the future to historical,
          // we'll keep it collapsed and not auto-expand it
          if (optionsManuallyCollapsed) {
            // Keep it collapsed, don't change the state
            setOptionsCollapsed(true);
          } else {
            // If not manually collapsed, follow the automatic behavior
            setOptionsCollapsed(!shouldExpandOptions);
          }
          
          // Always show the options box (in either collapsed or expanded state)
          setShowOptionsBox(true);
          
          // Update our tracking of where we are
          wasInFuture.current = isInFuture;
        } else {
          // If branch point element not found, fall back to previous behavior
          shouldExpandOptions = mainRef.current.scrollLeft < windowMidpoint;
          
          // If manually collapsed, keep it collapsed regardless of position
          if (optionsManuallyCollapsed) {
            setOptionsCollapsed(true);
          } else {
            // Otherwise follow automatic behavior
            setOptionsCollapsed(!shouldExpandOptions);
          }
          
          // Always show the options box
          setShowOptionsBox(true);
        }
        
        // Update timeline title based on whether we're looking at history or future
        if (!shouldExpandOptions) {
          setTimelineTitle('future');
        } else {
          setTimelineTitle('historical');
        }
        
        // We'll still use this attribute for CSS styling purposes
        mainRef.current.setAttribute('data-show-options', shouldExpandOptions ? 'true' : 'false');
        
        const timelineContainer = mainRef.current.querySelector('.timeline-container');
        if (timelineContainer) {
          timelineContainer.setAttribute('data-show-options', shouldExpandOptions ? 'true' : 'false');
        }
      }
    };
    
    // Add scroll event listener
    if (mainRef.current) {
      mainRef.current.addEventListener('scroll', handleScroll);
      
      // Initial check
      handleScroll();
    }
    
    // Clean up
    return () => {
      if (mainRef.current) {
        mainRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [optionsManuallyCollapsed, timelineTitle]);
  
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
        
        {/* Timeline title - new addition */}
        {viewMode === 'standard' && (
          <div className="timeline-header-title">
            {getTimelineTitleText()}
          </div>
        )}
        
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
              data-show-options={showOptionsBox}
            >
              {/* Options box with expand/collapse functionality */}
              {showOptionsBox && (
                <div className={`timeline-options-box ${optionsCollapsed ? 'collapsed' : ''}`}>
                  {/* Details button for collapsed state */}
                  <button 
                    className="options-expand-btn"
                    onClick={handleExpandOptions}
                    aria-label="Expand options"
                  >
                    Details
                  </button>
                  
                  {/* Close button for expanded state */}
                  <button 
                    className="options-close-btn" 
                    onClick={handleCollapseOptions}
                    aria-label="Collapse options"
                  >
                    <CloseIcon />
                  </button>
                  
                  {/* Content only visible in expanded state */}
                  <div className="options-content">
                    <h3>Further Options</h3>
                    
                    {/* Search area */}
                    <div className="options-search">
                      <div className="search-input-container">
                        <SearchIcon />
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search events..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          onKeyDown={handleSearchKeyDown}
                          className="search-input"
                        />
                      </div>
                      
                      {/* Search results dropdown */}
                      {searchResults.length > 0 && (
                        <div ref={resultsRef} className="search-results">
                          {searchResults.map((result, index) => {
                            const matchesTitle = result.title.toLowerCase().includes(searchTerm.toLowerCase());
                            const matchesDescription = result.description && result.description.toLowerCase().includes(searchTerm.toLowerCase());
                            
                            // Get description snippet around the matched term if match is in description
                            let descriptionSnippet = '';
                            if (matchesDescription && result.description) {
                              const matchIndex = result.description.toLowerCase().indexOf(searchTerm.toLowerCase());
                              const snippetStart = Math.max(0, matchIndex - 30);
                              const snippetEnd = Math.min(result.description.length, matchIndex + searchTerm.length + 30);
                              descriptionSnippet = (snippetStart > 0 ? '...' : '') +
                                result.description.slice(snippetStart, snippetEnd) +
                                (snippetEnd < result.description.length ? '...' : '');
                            }
                            
                            return (
                              <div 
                                key={result.id} 
                                className={`search-result-item ${index === selectedResultIndex ? 'selected' : ''}`}
                                onClick={() => handleResultClick(result.id)}
                              >
                                <div className="result-title-row">
                                  <span className="result-title">{result.title}</span>
                                  <span className="result-date">
                                    {new Date(result.date).getFullYear()}
                                  </span>
                                </div>
                                {matchesDescription && descriptionSnippet && (
                                  <div className="result-description">
                                    {descriptionSnippet}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    
                    {/* Display era info instead of the previous text */}
                    <div className="era-display">
                      <div className="era-label">Era:</div>
                      {(() => {
                        const { eraName, originalEra } = getCurrentEventEra(searchTerm);
                        return (
                          <>
                            <div className="era-value" data-era={eraName}>{eraName}</div>
                            <div className="era-original">({originalEra})</div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
              
              <Timeline 
                showOptionsBox={showOptionsBox} 
                onTimelineTitleChange={setTimelineTitle}
              />
            </main>
            
            <div className="timeline-scrollbar">
              {/* Year indicator moved to Timeline.tsx for dynamic updates */}
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
