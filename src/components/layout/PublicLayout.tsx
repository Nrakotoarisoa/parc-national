import { Outlet } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
