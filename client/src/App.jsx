import { Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import TopLoader from "@/components/TopLoader";

export default function App() {
  return (
    <>
      <TopLoader />
      <section className="min-h-screen flex flex-col">
        <Outlet />
      </section>
      <Toaster position="top-right" richColors />
    </>
  );
}
