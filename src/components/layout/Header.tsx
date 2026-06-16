import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import {
  CalendarCheck,
  Compass,
  Leaf,
  Map,
  Menu,
  MessageCircle,
  Route,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME, routes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/hooks/redux";

const links = [
  { to: routes.zones, label: "Zones", icon: Map },
  { to: routes.activities, label: "Activités", icon: Route },
  { to: routes.reviews, label: "Avis", icon: MessageCircle },
];

export function Header() {
  const user = useAppSelector((state) => state.auth.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/95 backdrop-blur-xl dark:border-white/10">
      <div className="container flex h-16 items-center justify-between gap-3 lg:h-[4.25rem]">
        <Link to={routes.home} className="flex items-center gap-2 font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-[-0.03em]">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border bg-background p-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition duration-200 ease-spring hover:bg-muted hover:text-foreground",
                  isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                )
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button className="border border-border bg-background" variant="ghost" size="icon" aria-label="Rechercher">
            <Search className="h-4 w-4" />
          </Button>
          {user ? (
            <>
              <Button asChild variant="outline" className="hidden sm:inline-flex">
                <Link to={routes.reservations}>
                  <CalendarCheck className="h-4 w-4" />
                  Réservations
                </Link>
              </Button>
              {user.role === "admin" ? (
                <Button asChild variant="secondary" className="hidden sm:inline-flex">
                  <Link to={routes.admin}>
                    <ShieldCheck className="h-4 w-4" />
                    Admin
                  </Link>
                </Button>
              ) : null}
            </>
          ) : (
            <Button asChild className="hidden sm:inline-flex">
              <Link to={routes.login}>
                <UserRound className="h-4 w-4" />
                Connexion
              </Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full md:hidden"
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setIsMobileMenuOpen((value) => !value)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {isMobileMenuOpen ? (
        <nav className="container grid gap-2 border-t bg-card py-3 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground",
                  isActive && "bg-primary/10 text-primary",
                )
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to={user ? routes.reservations : routes.login}
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {user ? <CalendarCheck className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}
            {user ? "Mes réservations" : "Connexion"}
          </NavLink>
        </nav>
      ) : null}
      <nav className="safe-bottom-nav fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t bg-card/96 px-2 pt-2 backdrop-blur-xl md:hidden">
        {[
          { to: routes.home, label: "Explorer", icon: Compass },
          ...links,
        ].map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[0.72rem] font-semibold text-muted-foreground",
                isActive && "bg-primary/10 text-primary",
              )
            }
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
