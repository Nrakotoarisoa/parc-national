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
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME, routes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { logout } from "@/features/auth/slices/authSlice";
import { openAuthDialog } from "@/features/auth/slices/authDialogSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

const links = [
  { to: routes.zones, label: "Zones", icon: Map },
  { to: routes.activities, label: "Activités", icon: Route },
  { to: routes.reviews, label: "Avis", icon: MessageCircle },
];

export function Header() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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
          {user ? (
            <div className="relative">
              <Button
                className="border border-border bg-background pl-2 pr-3"
                variant="ghost"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
                onClick={() => setIsUserMenuOpen((value) => !value)}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
                  {user.nom.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden max-w-28 truncate sm:inline">{user.nom}</span>
              </Button>
              {isUserMenuOpen ? (
                <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border bg-card p-2 shadow-soft" role="menu">
                  <div className="border-b px-3 py-3">
                    <p className="truncate font-bold">{user.nom}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Link className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-muted" to={routes.profile} onClick={() => setIsUserMenuOpen(false)}>
                    <UserRound className="h-4 w-4" /> Profil
                  </Link>
                  <Link className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-muted" to={routes.reservations} onClick={() => setIsUserMenuOpen(false)}>
                    <CalendarCheck className="h-4 w-4" /> Réservations
                  </Link>
                  {user.role === "admin" ? (
                    <Link className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-muted" to={routes.admin} onClick={() => setIsUserMenuOpen(false)}>
                      <ShieldCheck className="h-4 w-4" /> Admin
                    </Link>
                  ) : null}
                  <button
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-destructive hover:bg-muted"
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      dispatch(logout());
                      setIsUserMenuOpen(false);
                    }}
                  >
                    Déconnexion
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Button className="hidden sm:inline-flex" onClick={() => dispatch(openAuthDialog({ mode: "login" }))}>
              <UserRound className="h-4 w-4" />
              Connexion
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
          {user ? (
            <NavLink
              to={routes.reservations}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <CalendarCheck className="h-4 w-4" /> Mes réservations
            </NavLink>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                dispatch(openAuthDialog({ mode: "login" }));
              }}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <UserRound className="h-4 w-4" /> Connexion
            </button>
          )}
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
