import { jsPDF } from "jspdf";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Activity, Reservation, User } from "@/types/domain";

export type ReservationReceiptDetails = {
  user: User;
  reservation: Reservation;
  activity: Activity;
  participants?: number;
  taxesAmount?: number;
};

export function downloadReservationReceiptPdf(details: ReservationReceiptDetails) {
  const participants = details.participants ?? 1;
  const taxesAmount = details.taxesAmount ?? 0;
  const subtotal = details.activity.prix * participants;
  const total = subtotal + taxesAmount;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = margin;

  doc.setFontSize(20).setFont("helvetica", "bold").text("Parc National", margin, y);
  y += 26;
  doc.setFontSize(14).setFont("helvetica", "normal").text("Reçu de réservation", margin, y);

  y += 32;
  doc.setFontSize(12).setFont("helvetica", "bold").text("Client", margin, y);
  y += 18;
  doc.setFontSize(11).setFont("helvetica", "normal").text(`Nom : ${details.user.nom}`, margin, y);
  y += 16;
  doc.text(`Email : ${details.user.email}`, margin, y);

  y += 28;
  doc.setFontSize(12).setFont("helvetica", "bold").text("Réservation", margin, y);
  y += 18;
  doc.setFontSize(11).setFont("helvetica", "normal");
  doc.text(`Activité : ${details.activity.type}`, margin, y);
  y += 16;
  doc.text(`Date : ${formatDate(details.reservation.date_debut)} → ${formatDate(details.reservation.date_fin)}`, margin, y);
  y += 16;
  doc.text(`Nombre de participants : ${participants}`, margin, y);
  y += 16;
  doc.text(`Prix unitaire : ${formatPrice(details.activity.prix)}`, margin, y);

  y += 28;
  doc.setFontSize(12).setFont("helvetica", "bold").text("Détails financiers", margin, y);
  y += 18;
  doc.setFontSize(11).setFont("helvetica", "normal");
  doc.text(`Sous-total : ${formatPrice(subtotal)}`, margin, y);
  y += 16;
  doc.text(`Taxes : ${formatPrice(taxesAmount)}`, margin, y);
  y += 16;
  doc.setFontSize(12).setFont("helvetica", "bold").text(`Total dû : ${formatPrice(total)}`, margin, y);

  y += 36;
  doc.setFontSize(11).setFont("helvetica", "normal");
  doc.text("Merci pour votre réservation.", margin, y);
  y += 16;
  doc.text("Nous vous souhaitons une excellente expérience.", margin, y);

  const fileName = `recu-reservation-${details.reservation.id_reservation}.pdf`;
  doc.save(fileName);
}
