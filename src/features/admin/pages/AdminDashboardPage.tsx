import { FormEvent, ReactNode, useMemo, useState } from "react";
import { CheckCircle2, Eye, Pencil, Plus, Trash2, X, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetActivitiesQuery } from "@/features/activities/api/activitiesApi";
import { useGetReviewsQuery } from "@/features/reviews/api/reviewsApi";
import { useGetZonesQuery } from "@/features/zones/api/zonesApi";
import {
  AdminActivityPayload,
  AdminReservationPayload,
  AdminZonePayload,
  useCreateAdminActivityMutation,
  useCreateAdminZoneMutation,
  useDeleteAdminActivityMutation,
  useDeleteAdminReviewMutation,
  useDeleteAdminZoneMutation,
  useGetAdminReservationsQuery,
  useUpdateAdminActivityMutation,
  useUpdateAdminReservationMutation,
  useUpdateAdminZoneMutation,
} from "@/features/admin/api/adminApi";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import type { Activity, Reservation, ReservationStatus, Review, Zone } from "@/types/domain";

type Section = "zones" | "activites" | "reservations" | "avis";
type ToastMessage = { id: number; title: string; tone: "success" | "error" };
type PendingDelete = { kind: Section; id: number; label: string } | null;
const sections: Array<{ id: Section; label: string }> = [
  { id: "zones", label: "Zones" },
  { id: "activites", label: "Activités" },
  { id: "reservations", label: "Réservations" },
  { id: "avis", label: "Avis" },
];

function AdminTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500"><tr>{headers.map((header) => <th key={header} className="px-4 py-3 font-semibold">{header}</th>)}</tr></thead><tbody className="divide-y divide-stone-200">{children}</tbody></table></div></div>;
}

function IconAction({ label, tone = "neutral", onClick, children }: { label: string; tone?: "neutral" | "danger"; onClick: () => void; children: ReactNode }) {
  return <Button type="button" variant="ghost" size="icon" aria-label={label} title={label} onClick={onClick} className={cn("h-8 w-8 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-900", tone === "danger" && "text-red-500 hover:bg-red-50 hover:text-red-700")}>{children}</Button>;
}

function Sheet({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 bg-stone-950/30" role="dialog" aria-modal="true"><div className="ml-auto h-full w-full max-w-xl overflow-y-auto border-l border-stone-200 bg-white p-6 shadow-2xl"><div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-bold text-stone-900">{title}</h2><Button variant="ghost" size="icon" aria-label="Fermer" onClick={onClose}><X className="h-5 w-5" /></Button></div>{children}</div></div>;
}


function ConfirmDeleteDialog({ pendingDelete, onCancel, onConfirm }: { pendingDelete: PendingDelete; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Dialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="rounded-2xl border-stone-200 bg-white text-stone-900 shadow-2xl">
        <div className="space-y-3 pr-8">
          <p className="text-sm font-semibold text-red-600">Action destructive</p>
          <h2 className="text-xl font-bold">Confirmer la suppression</h2>
          <p className="text-sm leading-6 text-stone-600">
            Voulez-vous supprimer {pendingDelete?.label ?? "cet élément"} ? Cette action est immédiate et ne peut pas être annulée depuis l'interface.
          </p>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>Supprimer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ToastStack({ messages }: { messages: ToastMessage[] }) {
  if (messages.length === 0) return null;

  return <div className="fixed right-4 top-4 z-[60] grid w-[min(92vw,360px)] gap-2" role="status" aria-live="polite">{messages.map((message) => {
    const Icon = message.tone === "success" ? CheckCircle2 : XCircle;
    return <div key={message.id} className={cn("flex items-start gap-3 rounded-2xl border bg-white p-4 text-sm shadow-2xl", message.tone === "success" ? "border-emerald-200 text-emerald-800" : "border-red-200 text-red-800")}><Icon className="mt-0.5 h-4 w-4 shrink-0" /><p className="font-medium">{message.title}</p></div>;
  })}</div>;
}

export function AdminDashboardPage() {
  const [section, setSection] = useState<Section>(() => (window.location.hash.replace("#", "") as Section) || "zones");
  const [editing, setEditing] = useState<Zone | Activity | Reservation | Review | "new" | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);
  const zones = useGetZonesQuery();
  const activities = useGetActivitiesQuery();
  const reservations = useGetAdminReservationsQuery();
  const reviews = useGetReviewsQuery();
  const [createZone] = useCreateAdminZoneMutation();
  const [updateZone] = useUpdateAdminZoneMutation();
  const [deleteZone] = useDeleteAdminZoneMutation();
  const [createActivity] = useCreateAdminActivityMutation();
  const [updateActivity] = useUpdateAdminActivityMutation();
  const [deleteActivity] = useDeleteAdminActivityMutation();
  const [updateReservation] = useUpdateAdminReservationMutation();
  const [deleteReview] = useDeleteAdminReviewMutation();

  const loading = zones.isLoading || activities.isLoading || reservations.isLoading || reviews.isLoading;
  const zoneById = useMemo(() => new Map((zones.data ?? []).map((zone) => [zone.id_zone, zone.nom])), [zones.data]);

  const switchSection = (id: Section) => { setSection(id); window.history.replaceState(null, "", `#${id}`); setEditing(null); };
  const notify = (title: string, tone: ToastMessage["tone"]) => {
    const id = Date.now();
    setToasts((current) => [...current, { id, title, tone }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3600);
  };

  async function remove() {
    if (!pendingDelete) return;

    try {
      if (pendingDelete.kind === "zones") await deleteZone(pendingDelete.id).unwrap();
      if (pendingDelete.kind === "activites") await deleteActivity(pendingDelete.id).unwrap();
      if (pendingDelete.kind === "avis") await deleteReview(pendingDelete.id).unwrap();
      setPendingDelete(null);
      if (pendingDelete.kind === "zones") notify("Zone supprimée avec succès.", "success");
      if (pendingDelete.kind === "activites") notify("Activité supprimée avec succès.", "success");
      if (pendingDelete.kind === "avis") notify("Avis supprimé avec succès.", "success");
    } catch {
      if (pendingDelete?.kind === "zones") notify("Impossible de supprimer la zone.", "error");
      else if (pendingDelete?.kind === "activites") notify("Impossible de supprimer l’activité.", "error");
      else if (pendingDelete?.kind === "avis") notify("Impossible de supprimer l’avis.", "error");
      else notify("Une erreur est survenue.", "error");
    }
  }

  return <section className="space-y-6 pb-10">
    <ToastStack messages={toasts} />
    <ConfirmDeleteDialog pendingDelete={pendingDelete} onCancel={() => setPendingDelete(null)} onConfirm={remove} />
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-emerald-700">Administration</p><h1 className="text-3xl font-bold tracking-tight text-stone-900">Gestion opérationnelle du parc</h1><p className="mt-2 max-w-2xl text-sm text-stone-600">Consultez les données essentielles et intervenez rapidement sur les zones, activités, réservations et avis visiteurs.</p></div>{section === "zones" || section === "activites" ? <Button onClick={() => setEditing("new")} className="bg-emerald-600 hover:bg-emerald-700"><Plus className="h-4 w-4" />Ajouter</Button> : null}</div>
    <div className="flex gap-2 overflow-x-auto border-b border-stone-200 pb-2">{sections.map((item) => <Button key={item.id} variant="ghost" onClick={() => switchSection(item.id)} className={cn("rounded-xl text-stone-600 hover:bg-stone-100", section === item.id && "bg-emerald-50 text-emerald-700 hover:bg-emerald-50")}>{item.label}</Button>)}</div>
    {loading ? <Skeleton className="h-72 rounded-2xl" /> : null}
    {zones.isError || activities.isError || reservations.isError || reviews.isError ? <ErrorState onRetry={() => { zones.refetch(); activities.refetch(); reservations.refetch(); reviews.refetch(); }} /> : null}
    {!loading && section === "zones" ? <AdminTable headers={["Nom", "Disponibilité", "Avis", "Actions"]}>{(zones.data ?? []).map((zone) => <tr key={zone.id_zone}><td className="px-4 py-3 font-medium text-stone-900">{zone.nom}</td><td className="px-4 py-3"><Badge className={zone.disponibilite === "dispo" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}>{zone.disponibilite === "dispo" ? "Disponible" : "Indisponible"}</Badge></td><td className="px-4 py-3 text-stone-600">{zone.rating ?? "—"} · {zone.review_count ?? 0}</td><td className="px-4 py-3"><div className="flex gap-1"><IconAction label={`Voir ${zone.nom}`} onClick={() => setEditing(zone)}><Eye className="h-4 w-4" /></IconAction><IconAction label={`Modifier ${zone.nom}`} onClick={() => setEditing(zone)}><Pencil className="h-4 w-4" /></IconAction><IconAction label={`Supprimer ${zone.nom}`} tone="danger" onClick={() => setPendingDelete({ kind: "zones", id: zone.id_zone, label: zone.nom })}><Trash2 className="h-4 w-4" /></IconAction></div></td></tr>)}</AdminTable> : null}
    {!loading && section === "activites" ? <AdminTable headers={["Type", "Zone", "Prix", "Actions"]}>{(activities.data ?? []).map((activity) => <tr key={activity.id_activite}><td className="px-4 py-3 font-medium text-stone-900">{activity.type}</td><td className="px-4 py-3 text-stone-600">{activity.zone?.nom ?? zoneById.get(activity.id_zone) ?? `Zone ${activity.id_zone}`}</td><td className="px-4 py-3 text-stone-600">{formatPrice(activity.prix)}</td><td className="px-4 py-3"><div className="flex gap-1"><IconAction label={`Voir ${activity.type}`} onClick={() => setEditing(activity)}><Eye className="h-4 w-4" /></IconAction><IconAction label={`Modifier ${activity.type}`} onClick={() => setEditing(activity)}><Pencil className="h-4 w-4" /></IconAction><IconAction label={`Supprimer ${activity.type}`} tone="danger" onClick={() => setPendingDelete({ kind: "activites", id: activity.id_activite, label: activity.type })}><Trash2 className="h-4 w-4" /></IconAction></div></td></tr>)}</AdminTable> : null}
    {!loading && section === "reservations" ? <AdminTable headers={["Activité", "Dates", "Statut", "Actions"]}>{(reservations.data ?? []).map((reservation) => <tr key={reservation.id_reservation}><td className="px-4 py-3 font-medium text-stone-900">{reservation.activite?.type ?? `Activité ${reservation.id_activite}`}</td><td className="px-4 py=3 text-stone-600">{formatDate(reservation.date_debut)} → {formatDate(reservation.date_fin)}</td><td className="px-4 py=3"><Badge variant="outline" className="bg-white text-stone-700">{reservation.statut}</Badge></td><td className="px-4 py=3"><IconAction label={`Modifier réservation ${reservation.id_reservation}`} onClick={() => setEditing(reservation)}><Pencil className="h_4 w_4" /></IconAction></td></tr>)}</AdminTable> : null}
    {!loading && section === "avis" ? <AdminTable headers={["Visiteur", "Note", "Commentaire", "Date", "Actions"]}>{(reviews.data ?? []).map((review) => <tr key={review.id_avis}><td className="px_4 py_3 font-medium text-stone_900">{review.utilisateur?.nom ?? `Visiteur ${review.id_utilisateur}`}</td><td className="px_4 py_3 text-stone_600">{review.note}/5</td><td className="max-w-md truncate px_4 py_3 text-stone_600">{review.commentaire}</td><td className="px_4 py_3 text-stone_600">{formatDate(review.date_publication)}</td><td className="px_4 py_3"><IconAction label={`Supprimer avis ${review.id_avis}`} tone="danger" onClick={() => setPendingDelete({ kind: "avis", id: review.id_avis, label: `l’avis ${review.id_avis}` })}><Trash2 className="h_4 w_4" /></IconAction></td></tr>)}</AdminTable> : null}
    {editing ? <AdminEditor section={section} item={editing} zones={zones.data ?? []} onClose={() => setEditing(null)} onSave={async (payload) => {
      try {
        if (section === "zones") {
          if (editing === "new") await createZone(payload as AdminZonePayload).unwrap();
          else await updateZone({ id: (editing as Zone).id_zone, data: payload as AdminZonePayload }).unwrap();
          notify(editing === "new" ? "Zone créée avec succès." : "Zone modifiée avec succès.", "success");
        }
        if (section === "activites") {
          if (editing === "new") await createActivity(payload as AdminActivityPayload).unwrap();
          else await updateActivity({ id: (editing as Activity).id_activite, data: payload as AdminActivityPayload }).unwrap();
          notify(editing === "new" ? "Activité créée avec succès." : "Activité modifiée avec succès.", "success");
        }
        if (section === "reservations") {
          await updateReservation({ id: (editing as Reservation).id_reservation, data: payload as AdminReservationPayload }).unwrap();
          notify("Réservation mise à jour.", "success");
        }
        setEditing(null);
      } catch {
        if (section === "zones") notify(editing === "new" ? "Impossible de créer la zone." : "Impossible de modifier la zone.", "error");
        else if (section === "activites") notify(editing === "new" ? "Impossible de créer l’activité." : "Impossible de modifier l’activité.", "error");
        else if (section === "reservations") notify("Impossible de mettre à jour la réservation.", "error");
        else notify("Une erreur est survenue.", "error");
      }
    }} /> : null}
  </section>;
}

function AdminEditor({ section, item, zones, onClose, onSave }: { section: Section; item: Zone | Activity | Reservation | Review | "new"; zones: Zone[]; onClose: () => void; onSave: (payload: AdminZonePayload | AdminActivityPayload | AdminReservationPayload) => Promise<void> }) {
  const isNew = item === "new";
  const [zoneForm, setZoneForm] = useState<AdminZonePayload>(() => isNew ? { nom: "", description_zone: "", disponibilite: "dispo", image_url: "" } : { ...(item as Zone), image_url: (item as Zone).image_url ?? "" });
  const [activityForm, setActivityForm] = useState<AdminActivityPayload>(() => isNew ? { id_zone: zones[0]?.id_zone ?? 0, type: "", description_act: "", prix: 0 } : item as Activity);
  const [reservationForm, setReservationForm] = useState<AdminReservationPayload>(() => isNew ? {} : item as Reservation);
  async function submit(event: FormEvent) { event.preventDefault(); await onSave(section === "zones" ? zoneForm : section === "activites" ? activityForm : reservationForm); }
  if (section === "zones") 
    return 
      <Sheet title={isNew ? "Nouvelle zone" : "Modifier la zone"} onClose={onClose}>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-stone-700" htmlFor="zone-name">
              Nom de la zone
            </label>
            <Input id="zone-name" placeholder="Nom de la zone" value={zoneForm.nom} onChange={(e) => setZoneForm({ ...zoneForm, nom: e.target.value })} required />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-stone-700" htmlFor="zone-description">
              Description
            </label>
            <Textarea id="zone-description" placeholder="Description biodiversité, accès, points d'intérêt" value={zoneForm.description_zone} onChange={(e) => setZoneForm({ ...zoneForm, description_zone: e.target.value })} required />
          </div>
          <div className="space-y-3"><label className="block text-sm font-medium text-stone-700" htmlFor="zone-image">Lien de l'image</label><Input id="zone-image" type="url" placeholder="https://cdn.site.com/foret.jpg ou /images/foret.jpg" value={zoneForm.image_url ?? ""} onChange={(e) => setZoneForm({ ...zoneForm, image_url: e.target.value })} required /><p className="text-xs text-stone-500">Ajoutez une URL ou un chemin vers l'image de la zone.</p></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={zoneForm.disponibilite === "dispo"} onChange={(e) => setZoneForm({ ...zoneForm, disponibilite: e.target.checked ? "dispo" : "non_dispo" })} className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500" />Disponible aux visiteurs</label><Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Enregistrer</Button></form></Sheet>;
  if (section === "activites") return <Sheet title={isNew ? "Nouvelle activité" : "Modifier l'activité"} onClose={onClose}><form onSubmit={submit} className="space-y-4"><Input aria-label="Type" placeholder="Randonnée, observation, bivouac..." value={activityForm.type} onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })} required /><select aria-label="Zone" className="h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm" value={activityForm.id_zone} onChange={(e) => setActivityForm({ ...activityForm, id_zone: Number(e.target.value) })}>{zones.map((zone) => <option key={zone.id_zone} value={zone.id_zone}>{zone.nom}</option>)}</select><Input aria-label="Prix" type="number" min="0" value={activityForm.prix} onChange={(e) => setActivityForm({ ...activityForm, prix: Number(e.target.value) })} required /><Textarea aria-label="Description" placeholder="Description de l'expérience écotouristique" value={activityForm.description_act} onChange={(e) => setActivityForm({ ...activityForm, description_act: e.target.value })} required /><Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Enregistrer</Button></form></Sheet>;
  return <Sheet title="Modifier la réservation" onClose={onClose}><form onSubmit={submit} className="space-y-4"><Input aria-label="Date de début" type="date" value={reservationForm.date_debut ?? ""} onChange={(e) => setReservationForm({ ...reservationForm, date_debut: e.target.value })} /><Input aria-label="Date de fin" type="date" value={reservationForm.date_fin ?? ""} onChange={(e) => setReservationForm({ ...reservationForm, date_fin: e.target.value })} /><select aria-label="Statut" className="h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm" value={reservationForm.statut} onChange={(e) => setReservationForm({ ...reservationForm, statut: e.target.value as ReservationStatus })}><option value="non_paye">Non payé</option><option value="paye">Payé</option><option value="annule">Annulé</option></select><Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Enregistrer</Button></form></Sheet>;
}
