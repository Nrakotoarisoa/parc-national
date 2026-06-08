import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      note: 5,
      commentaire: "",
    },
  });

  const submit = async (values: ReviewFormValues) => {
    await onSubmit(values);
    reset();
  };

  return (
    <form className="premium-surface grid gap-5 rounded-xl p-5 shadow-premium" onSubmit={handleSubmit(submit)}>
      <div>
        <p className="text-lg font-semibold">Partager votre expérience</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Aidez les prochains visiteurs à choisir une activité adaptée à leur envie d'exploration.
        </p>
      </div>
      <div>
        <label className="text-sm font-semibold" htmlFor="note">
          Note
        </label>
        <div className="mt-2 flex items-center gap-3">
          <Input className="max-w-24" id="note" min={1} max={5} type="number" {...register("note")} />
          <div className="flex text-accent" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-current" />
            ))}
          </div>
        </div>
        {errors.note ? <p className="mt-1 text-xs text-destructive">{errors.note.message}</p> : null}
      </div>
      <div>
        <label className="text-sm font-semibold" htmlFor="commentaire">
          Commentaire
        </label>
        <Textarea
          className="mt-2 min-h-36 resize-none"
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
