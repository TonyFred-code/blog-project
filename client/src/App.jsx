import { useState } from "react";
import { Button } from "./components/ui/button";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <section id="center">
        <div>
          <h1>Get started</h1>
          <p>Welcome to my blog</p>
        </div>
        <div className="flex gap-3 items-center">
          <span>Counts: {count}</span>
          <Button onClick={() => setCount(count + 1)}>Increments</Button>
        </div>
      </section>
    </>
  );
}
