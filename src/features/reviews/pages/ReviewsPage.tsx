import { MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingGrid } from "@/components/feedback/LoadingGrid";
import { SectionHeading } from "@/components/common/SectionHeading";
import { useToast } from "@/components/ui/toast";
import { ReviewCard } from "@/features/reviews/components/ReviewCard";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";
import { useCreateReviewMutation, useGetReviewsQuery } from "@/features/reviews/api/reviewsApi";

export function ReviewsPage() {
  const { data: reviews, isError, isLoading, refetch } = useGetReviewsQuery();
  const [createReview, createState] = useCreateReviewMutation();
  const { toast } = useToast();
  const averageRating = reviews?.length
    ? reviews.reduce((total, review) => total + review.note, 0) / reviews.length
    : 0;

  return (
    <section className="bg-gradient-mist">
      <div className="section-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
        <div>
          <SectionHeading
            eyebrow="Preuve sociale"
            title="Avis des visiteurs"
            description="Des retours authentiques pour choisir votre prochaine expérience avec confiance, du sentier contemplatif à l'aventure guidée."
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="premium-surface rounded-2xl p-4">
              <p className="text-2xl font-bold">{averageRating ? averageRating.toFixed(1) : "--"}</p>
              <p className="text-sm text-muted-foreground">Note moyenne</p>
            </div>
            <div className="premium-surface rounded-2xl p-4">
              <p className="text-2xl font-bold">{reviews?.length ?? 0}</p>
              <p className="text-sm text-muted-foreground">Avis publiés</p>
            </div>
            <div className="premium-surface rounded-2xl p-4">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
                <p className="font-bold">Vérifié</p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Communauté engagée</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            {isLoading ? <LoadingGrid /> : null}
            {isError ? <ErrorState onRetry={refetch} /> : null}
            {!isLoading && !isError && reviews?.length === 0 ? (
              <EmptyState
                icon={MessageCircle}
                title="Aucun avis pour le moment"
                message="Soyez le premier visiteur à partager une impression utile pour les futurs explorateurs."
              />
            ) : null}
            {reviews?.map((review, index) => <ReviewCard key={review.id_avis} index={index} review={review} />)}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="premium">
              <Sparkles className="h-3.5 w-3.5" />
              Expérience vécue
            </Badge>
            <Badge variant="trust">Publication modérée</Badge>
          </div>
          <ReviewForm
            isLoading={createState.isLoading}
            onSubmit={async (values) => {
              try {
                await createReview(values).unwrap();
                toast({
                  title: "Avis publié avec succès.",
                  description: "Merci pour votre retour d'expérience.",
                  variant: "success",
                });
              } catch {
                toast({
                  title: "Impossible de publier votre avis.",
                  description: "Veuillez réessayer.",
                  variant: "error",
                });
                throw new Error("Review submission failed");
              }
            }}
          />
        </aside>
      </div>
    </section>
  );
}
