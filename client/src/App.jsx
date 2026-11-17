import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import TopLoader from "@/components/TopLoader";
import ScrollToTop from "@/components/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <TopLoader />
      <section className="min-h-screen flex flex-col">
        <Outlet />
      </section>
      <Toaster position="top-right" richColors />
    </>
  );
}
