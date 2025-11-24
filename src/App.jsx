import { createContext, useState } from 'react';
import './App.css'
import ChildA from './components/ChildA';

// Step 1: Create context
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState({ name: "Light" });

  return (
    <>
      {/* Step 2: Wrap children inside Provider */}
      {/* Step 3: Pass value */}
      <ThemeContext.Provider value={{ theme, setTheme }} >
        <div id='container' style={{ backgroundColor: theme == 'light' ? "beige" : "black" }}>
          <ChildA />

        </div>

      </ThemeContext.Provider >
    </>
  );
}

export default App;

// Step 4: Export context
export { ThemeContext };
