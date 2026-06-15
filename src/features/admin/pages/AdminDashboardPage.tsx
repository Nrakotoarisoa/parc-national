import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useGetAdminStatsQuery } from "@/features/admin/api/adminApi";
import { cn } from "@/lib/utils";

type TrendPoint = { label: string; reservations: number; revenus: number };
type ZoneRow = { nom: string; statut: "Active" | "Maintenance"; capacite: string; taux: number; responsable: string };
type ActivityRow = { nom: string; zone: string; prix: string; reservations: number; satisfaction: string };
type ReservationRow = { client: string; activite: string; date: string; montant: string; statut: "Payée" | "En attente" | "Annulée" };

const trendData: TrendPoint[] = [
  { label: "Jan", reservations: 84, revenus: 12 },
  { label: "Fév", reservations: 112, revenus: 16 },
  { label: "Mar", reservations: 96, revenus: 14 },
  { label: "Avr", reservations: 148, revenus: 22 },
  { label: "Mai", reservations: 176, revenus: 27 },
  { label: "Juin", reservations: 214, revenus: 33 },
];

const zones: ZoneRow[] = [
  { nom: "Forêt primaire", statut: "Active", capacite: "82%", taux: 82, responsable: "Nadia S." },
  { nom: "Circuit cascades", statut: "Active", capacite: "64%", taux: 64, responsable: "Marc D." },
  { nom: "Belvédère Nord", statut: "Maintenance", capacite: "28%", taux: 28, responsable: "Aline K." },
];

const activities: ActivityRow[] = [
  { nom: "Randonnée guidée", zone: "Forêt primaire", prix: "32 €", reservations: 128, satisfaction: "4.9" },
  { nom: "Kayak découverte", zone: "Rivière Est", prix: "46 €", reservations: 86, satisfaction: "4.7" },
  { nom: "Safari photo", zone: "Belvédère Nord", prix: "58 €", reservations: 54, satisfaction: "4.8" },
];

const reservations: ReservationRow[] = [
  { client: "Camille Martin", activite: "Randonnée guidée", date: "18 juin", montant: "64 €", statut: "Payée" },
  { client: "Hugo Bernard", activite: "Kayak découverte", date: "19 juin", montant: "92 €", statut: "En attente" },
  { client: "Sarah Diallo", activite: "Safari photo", date: "21 juin", montant: "58 €", statut: "Payée" },
  { client: "Léo Petit", activite: "Observation oiseaux", date: "22 juin", montant: "24 €", statut: "Annulée" },
];

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 rounded-3xl" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  );
}

function MiniBarChart({ data }: { data: TrendPoint[] }) {
  const maxReservations = Math.max(...data.map((item) => item.reservations));

  return (
    <div className="flex h-72 items-end gap-3 rounded-2xl bg-gradient-to-b from-muted/50 to-transparent p-4">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
          <div className="flex h-52 w-full items-end rounded-full bg-background/70 p-1 shadow-inner">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.reservations / maxReservations) * 100}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full rounded-full bg-gradient-to-t from-primary via-earth-canopy to-earth-sun"
              title={`${item.reservations} réservations`}
            />
          </div>
          <span className="text-xs font-semibold text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: ZoneRow["statut"] | ReservationRow["statut"] }) {
  const styles = {
    Active: "bg-emerald-500/10 text-emerald-700",
    Maintenance: "bg-amber-500/10 text-amber-700",
    Payée: "bg-emerald-500/10 text-emerald-700",
    "En attente": "bg-amber-500/10 text-amber-700",
    Annulée: "bg-rose-500/10 text-rose-700",
  } as const;
  return <Badge className={cn("border-0", styles[status])}>{status}</Badge>;
}

export function AdminDashboardPage() {
  const { data: stats, isError, isLoading, refetch } = useGetAdminStatsQuery();
  const [modal, setModal] = useState<"zone" | "activity" | "reservation" | null>(null);

  const cards = useMemo(
    () => [
      { label: "Utilisateurs", value: stats?.totalUsers ?? 0, icon: Users, trend: "+12,4%", tone: "from-primary/15" },
      { label: "Activités", value: stats?.totalActivities ?? 0, icon: Route, trend: "+8 nouvelles", tone: "from-earth-sun/20" },
      { label: "Réservations", value: stats?.totalReservations ?? 0, icon: CalendarCheck, trend: "+18,2%", tone: "from-earth-river/20" },
      { label: "Payées", value: stats?.paidReservations ?? 0, icon: BarChart3, trend: "Conversion nette", tone: "from-emerald-500/20" },
    ],
    [stats],
  );

  if (isLoading) return <AdminDashboardSkeleton />;
  if (isError || !stats) return <ErrorState onRetry={refetch} />;

  return (
    <section className="space-y-6 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border bg-gradient-canopy p-6 text-white shadow-glow lg:p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <Badge className="w-fit border-white/20 bg-white/15 text-white backdrop-blur"><Sparkles className="mr-1 h-3 w-3" />Dashboard premium</Badge>
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">Pilotage du parc en temps réel</h1>
              <p className="mt-3 text-sm text-white/78 md:text-base">Analytics, opérations et réservations réunis dans une interface claire, rapide et responsive.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setModal("reservation")}><Plus className="h-4 w-4" />Nouvelle réservation</Button>
            <Button variant="premium"><Download className="h-4 w-4" />Exporter</Button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, label, value, trend, tone }, index) => (
          <motion.div key={label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
            <Card className={cn("overflow-hidden border-0 bg-gradient-to-br to-card shadow-soft", tone)}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div><CardDescription>{label}</CardDescription><CardTitle className="mt-2 text-3xl">{value.toLocaleString("fr-FR")}</CardTitle></div>
                <span className="rounded-2xl bg-background/80 p-3 shadow-lift"><Icon className="h-5 w-5 text-primary" /></span>
              </CardHeader>
              <CardContent className="flex items-center gap-2 text-sm text-muted-foreground"><TrendingUp className="h-4 w-4 text-emerald-600" />{trend}</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><CardTitle>Analytics réservations</CardTitle><CardDescription>Volume mensuel et dynamique de revenus.</CardDescription></div>
            <Button variant="outline" size="sm"><Filter className="h-4 w-4" />6 mois</Button>
          </CardHeader>
          <CardContent><MiniBarChart data={trendData} /></CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle>Santé opérationnelle</CardTitle><CardDescription>Indicateurs critiques et feedback clair.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {[{ label: "Disponibilité zones", value: "94%", icon: CheckCircle2 }, { label: "Temps réponse support", value: "12 min", icon: Clock3 }, { label: "Alertes terrain", value: "3", icon: AlertTriangle }, { label: "Conformité sécurité", value: "OK", icon: ShieldCheck }].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border bg-background/70 p-4"><span className="flex items-center gap-3 text-sm font-medium"><Icon className="h-5 w-5 text-primary" />{label}</span><strong>{value}</strong></div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <AdvancedTable id="zones" title="Gestion zones" action="Ajouter une zone" onAction={() => setModal("zone")} columns={["Zone", "Statut", "Capacité", "Responsable"]} rows={zones.map((z) => [z.nom, <StatusBadge status={z.statut} />, <div className="min-w-28"><span>{z.capacite}</span><div className="mt-2 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${z.taux}%` }} /></div></div>, z.responsable])} />
        <AdvancedTable id="activites" title="Gestion activités" action="Créer" onAction={() => setModal("activity")} columns={["Activité", "Zone", "Prix", "Avis"]} rows={activities.map((a) => [a.nom, a.zone, a.prix, `★ ${a.satisfaction}`])} />
        <AdvancedTable id="reservations" title="Réservations" action="Planifier" onAction={() => setModal("reservation")} columns={["Client", "Activité", "Date", "Statut"]} rows={reservations.map((r) => [r.client, r.activite, r.date, <StatusBadge status={r.statut} />])} />
      </div>

      {modal && <AdminModal type={modal} onClose={() => setModal(null)} />}
    </section>
  );
}

function AdvancedTable({ id, title, action, onAction, columns, rows }: { id: string; title: string; action: string; onAction: () => void; columns: string[]; rows: ReactNode[][] }) {
  return (
    <Card id={id} className="scroll-mt-24 overflow-hidden shadow-soft">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-3"><div><CardTitle>{title}</CardTitle><CardDescription>Table avancée, actions rapides.</CardDescription></div><Button size="sm" onClick={onAction}><Plus className="h-4 w-4" />{action}</Button></div>
        <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Rechercher..." /></div>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[520px] text-left text-sm"><thead className="bg-muted/60 text-xs uppercase text-muted-foreground"><tr>{columns.map((c) => <th key={c} className="px-5 py-3 font-bold">{c}</th>)}<th className="px-5 py-3" /></tr></thead><tbody>{rows.map((row, i) => <tr key={i} className="border-t transition-colors hover:bg-muted/40">{row.map((cell, j) => <td key={j} className="px-5 py-4 align-middle">{cell}</td>)}<td className="px-5 py-4"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></td></tr>)}</tbody></table>
      </CardContent>
    </Card>
  );
}

function AdminModal({ type, onClose }: { type: "zone" | "activity" | "reservation"; onClose: () => void }) {
  const labels = { zone: ["Nouvelle zone", "Nom de la zone", "Responsable"], activity: ["Nouvelle activité", "Nom de l'activité", "Prix"], reservation: ["Nouvelle réservation", "Client", "Date"] } as const;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-earth-night/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-lg rounded-3xl border bg-card p-6 shadow-premium">
        <div className="flex items-start justify-between"><div><h2 className="text-2xl font-bold">{labels[type][0]}</h2><p className="mt-1 text-sm text-muted-foreground">Modal moderne avec feedback immédiat et champs typés.</p></div><Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button></div>
        <div className="mt-6 grid gap-4"><Input placeholder={labels[type][1]} /><Input placeholder={labels[type][2]} /><textarea className="min-h-28 rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Notes internes" /></div>
        <div className="mt-6 flex justify-end gap-3"><Button variant="outline" onClick={onClose}>Annuler</Button><Button onClick={onClose}><ArrowUpRight className="h-4 w-4" />Enregistrer</Button></div>
      </motion.div>
    </div>
  );
}
