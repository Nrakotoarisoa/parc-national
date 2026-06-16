import { Outlet } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AuthDialog } from "@/features/auth/components/AuthDialog";
import { AuthSession } from "@/features/auth/components/AuthSession";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AuthSession />
      <Header />
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <AuthDialog />
    </div>
  );
}
