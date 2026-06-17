import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Rating } from "@/components/common/Rating";
import { formatDate } from "@/lib/utils";
import { useGetUserQuery } from "@/features/auth/api/authApi";
import type { Review } from "@/types/domain";

type ReviewCardProps = {
  review: Review;
  index?: number;
};

export function ReviewCard({ index = 0, review }: ReviewCardProps) {
  const { data: user } = useGetUserQuery(review.id_utilisateur, {
    skip: Boolean(review.utilisateur?.nom),
  });

  console.log(user);

  const authorName = user?.nom ?? "Visiteur";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 120, damping: 18, delay: Math.min(index * 0.04, 0.18) }}
    >
      <Card className="premium-surface interactive-lift overflow-hidden rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-canopy text-sm font-bold text-white">
                {authorName.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{authorName}</p>
                <p className="text-xs text-muted-foreground">{formatDate(review.date_creation)}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <Rating value={review.note} />
            <Quote className="h-5 w-5 text-primary/35" aria-hidden="true" />
          </div>

          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-[0.95rem]">{review.commentaire}</p>
        </CardContent>
      </Card>
    </motion.article>
  );
}
