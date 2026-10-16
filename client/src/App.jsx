import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <>
      <section id="center" className="min-h-screen flex flex-col">
        <Outlet />
      </section>
    </>
  );
}
