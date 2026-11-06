import { Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <>
      <section className="min-h-screen flex flex-col">
        <Outlet />
      </section>
      <Toaster position="top-right" richColors />
    </>
  );
}
