import { useShittyRouter } from "./providers/ShittyRouterProvider";

function App() {
  const { component } = useShittyRouter();

  return <div className="app">{component}</div>;
}

export default App;
