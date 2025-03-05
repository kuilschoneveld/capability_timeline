import './App.css';
import Timeline from './components/timeline/Timeline';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Algorithmic Capability Timeline</h1>
        <p>Exploring the historical progression and future branching of algorithmic capability</p>
      </header>
      
      <main className="App-main">
        <Timeline />
      </main>
      
      <footer className="App-footer">
        <p>
          This is a modular, React-based interactive timeline tool. 
          <br />
          <small>© {new Date().getFullYear()} - Capability Timeline Project</small>
        </p>
      </footer>
    </div>
  );
}

export default App;
