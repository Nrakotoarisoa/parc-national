import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { reviewSchema, type ReviewFormValues } from "@/features/reviews/schemas/review.schemas";

type ReviewFormProps = {
  onSubmit: (values: ReviewFormValues) => Promise<void> | void;
  isLoading?: boolean;
};

export function ReviewForm({ isLoading = false, onSubmit }: ReviewFormProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      note: 5,
      commentaire: "",
    },
  });
  const selectedRating = Number(watch("note") ?? 5);

  const submit = async (values: ReviewFormValues) => {
    await onSubmit(values);
    reset();
  };

  return (
    <form className="premium-surface grid gap-5 rounded-2xl p-5" onSubmit={handleSubmit(submit)}>
      <div>
        <p className="text-xl font-extrabold tracking-[-0.02em]">Partager votre expérience</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Aidez les prochains visiteurs à choisir une activité adaptée à leur envie d'exploration.
        </p>
      </div>
      <div>
        <span className="text-sm font-bold">Note</span>
        <input id="note" type="hidden" {...register("note", { valueAsNumber: true })} />
        <div className="mt-2 flex items-center gap-2" role="radiogroup" aria-label="Note de l'avis">
          {Array.from({ length: 5 }).map((_, index) => {
            const rating = index + 1;
            const isActive = rating <= selectedRating;

            return (
              <button
                key={rating}
                type="button"
                role="radio"
                aria-checked={selectedRating === rating}
                aria-label={`${rating} étoile${rating > 1 ? "s" : ""}`}
                className="rounded-full p-1 text-accent transition hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setValue("note", rating, { shouldDirty: true, shouldValidate: true })}
              >
                <Star className={cn("h-7 w-7", isActive ? "fill-current" : "fill-transparent text-muted-foreground")} />
              </button>
            );
          })}
          <span className="ml-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{selectedRating}/5</span>
        </div>
        {errors.note ? <p className="mt-1 text-xs text-destructive">{errors.note.message}</p> : null}
      </div>
      <div>
        <label className="text-sm font-bold" htmlFor="commentaire">
          Commentaire
        </label>
        <Textarea
          className="mt-2 min-h-36 resize-none rounded-2xl bg-background"
          id="commentaire"
          placeholder="Décrivez le lieu, l'accueil, le niveau d'effort et ce qui vous a marqué."
          {...register("commentaire")}
        />
        {errors.commentaire ? <p className="mt-1 text-xs text-destructive">{errors.commentaire.message}</p> : null}
      </div>
      <Button disabled={isLoading} type="submit" variant="premium">
        <Send className="h-4 w-4" />
        Publier l'avis
      </Button>
    </form>
  );
}
