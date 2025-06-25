import { ShellApp } from "./microfrontends/shell/ShellApp";

/**
 * Main Application Entry Point
 * Delegates to the Shell microfrontend which orchestrates all other microfrontends
 */
function App() {
  return <ShellApp />;
}

export default App;
