import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import TopLoader from "@/components/TopLoader";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/Footer";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <TopLoader />
      <section className="min-h-screen flex flex-col">
        <Outlet />
        <Footer />
      </section>
      <Toaster position="top-right" richColors />
    </>
  );
}
