import { useEffect } from 'react';
import './App.css';
import { BackgroundManager } from './BackgroundManager';

function App() {

  useEffect(() => {
    const bkManager = new BackgroundManager();    
    bkManager.mounted()
    return () => {
      bkManager.beforeDestroy();
    }
  }, [])

  return (
    <div>
      <main>
      </main>
    </div>
  );
}

export default App;
