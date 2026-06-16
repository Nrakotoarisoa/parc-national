import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import {
  Award,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Leaf,
  MapPin,
  Mountain,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageTransition } from "@/components/layout/PageTransition";
import { useGetActivitiesQuery } from "@/features/activities/api/activitiesApi";
import { useGetReviewsQuery } from "@/features/reviews/api/reviewsApi";
import { useGetZonesQuery } from "@/features/zones/api/zonesApi";
import { routes } from "@/lib/constants";

const heroImage =
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2200&q=82";

const trustSignals = [
  { icon: ShieldCheck, label: "Compte sécurisé", detail: "Authentification requise avant réservation" },
  { icon: Star, label: "Avis visiteurs", detail: "Notes issues des avis publiés" },
  { icon: CheckCircle2, label: "Réservation connectée", detail: "Flux relié aux APIs existantes" },
];

type Stat = { value: string; label: string; suffix: string };

const discoveryCards = [
  {
    icon: Mountain,
    title: "Randonnées panoramiques",
    description: "Belvédères au lever du soleil, crêtes sauvages et pauses naturalistes.",
    meta: "À partir de 2h",
    to: routes.activities,
  },
  {
    icon: Camera,
    title: "Safaris photo éthiques",
    description: "Spots confidentiels, lumière dorée et observation respectueuse de la faune.",
    meta: "Petit groupe",
    to: routes.activities,
  },
  {
    icon: Leaf,
    title: "Zones protégées",
    description: "Choisissez votre ambiance : forêt primaire, cascades, prairies ou rivières.",
    meta: "Carte interactive",
    to: routes.zones,
  },
];

const quickSearches = ["Lever du soleil", "Cascade", "Famille", "Observation faune"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
} satisfies Variants;

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 18 },
  },
} satisfies Variants;

function AnimatedNumber({ value, delay }: { value: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? value : 0);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    const controls = animate(0, value, {
      delay,
      duration: 1.05,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });

    return () => controls.stop();
  }, [delay, isInView, prefersReducedMotion, value]);

  return <span ref={ref}>{displayValue}</span>;
}

function AnimatedStat({ value, suffix, label, index }: Stat & { index: number }) {
  return (
    <motion.div
      className="rounded-2xl border border-white/15 bg-white/[0.11] p-4 backdrop-blur-md sm:p-5"
      variants={itemVariants}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="flex items-end gap-1 font-display text-3xl font-semibold text-white sm:text-4xl">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 + index * 0.08, type: "spring", stiffness: 110, damping: 18 }}
        >
          {suffix === "/5" ? value : <AnimatedNumber delay={0.45 + index * 0.08} value={Number(value)} />}
        </motion.span>
        <span className="pb-1 text-xl text-accent">{suffix}</span>
      </div>
      <p className="mt-1 text-sm font-medium text-white/76">{label}</p>
    </motion.div>
  );
}

function SearchPanel() {
  return (
    <motion.form
      className="premium-surface w-full rounded-[1.75rem] border-white/25 bg-white/[0.94] p-3 text-foreground sm:p-4 lg:max-w-xl"
      variants={itemVariants}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      aria-label="Rechercher une expérience dans le parc"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr_auto]">
        <label className="group relative block">
          <span className="mb-2 flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Destination
          </span>
          <Input
            className="h-14 rounded-2xl border-transparent bg-muted/70 pl-11 text-base shadow-inner transition group-hover:bg-muted focus-visible:ring-primary"
            placeholder="Forêt, cascade, belvédère..."
            aria-label="Destination souhaitée"
          />
          <Search className="pointer-events-none absolute bottom-4 left-4 h-5 w-5 text-primary" aria-hidden="true" />
        </label>
        <label className="group block">
          <span className="mb-2 flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Quand
          </span>
          <Input
            className="h-14 rounded-2xl border-transparent bg-muted/70 text-base shadow-inner transition group-hover:bg-muted focus-visible:ring-primary"
            type="date"
            aria-label="Date de visite"
          />
        </label>
        <Button className="h-14 rounded-2xl px-6 text-base" size="lg" type="submit" variant="premium">
          Explorer
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible">
        {quickSearches.map((search) => (
          <button
            key={search}
            className="shrink-0 rounded-full border border-primary/10 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary transition duration-300 ease-spring hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            type="button"
          >
            {search}
          </button>
        ))}
      </div>
    </motion.form>
  );
}

function DiscoveryCard({ icon: Icon, title, description, meta, to }: (typeof discoveryCards)[number]) {
  return (
    <motion.article variants={itemVariants} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
      <Link
        to={to}
        className="group block h-full rounded-[1.5rem] border border-white/12 bg-white/[0.11] p-4 text-white backdrop-blur-md transition duration-300 ease-spring hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:p-5"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-accent transition duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <Badge className="border-white/15 bg-white/12 text-white" variant="outline">
            {meta}
          </Badge>
        </div>
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-white/72">{description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-accent">
          Découvrir <ChevronRight className="h-4 w-4 transition" aria-hidden="true" />
        </span>
      </Link>
    </motion.article>
  );
}

export function HomePage() {
  const { data: zones } = useGetZonesQuery();
  const { data: activities } = useGetActivitiesQuery();
  const { data: reviews } = useGetReviewsQuery();
  const averageRating = reviews?.length ? reviews.reduce((total, review) => total + review.note, 0) / reviews.length : 0;
  const stats: Stat[] = [
    { value: String(zones?.length ?? 0), label: "zones disponibles", suffix: "" },
    { value: String(activities?.length ?? 0), label: "expériences", suffix: "" },
    { value: averageRating ? averageRating.toFixed(1) : "0", label: "note moyenne", suffix: "/5" },
  ];
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const rawY = useTransform(scrollY, [0, 700], [0, prefersReducedMotion ? 0 : 90]);
  const imageY = useSpring(rawY, { stiffness: 70, damping: 28, mass: 0.4 });

  return (
    <PageTransition>
      <section className="relative -mt-16 min-h-screen overflow-hidden bg-earth-night text-white lg:-mt-18" aria-labelledby="home-hero-title">
        <motion.img
          src={heroImage}
          alt="Vallée sauvage baignée par une lumière dorée dans le parc national"
          className="absolute inset-0 h-[112%] w-full object-cover will-change-transform"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          style={{ y: imageY }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,196,87,0.30),transparent_28%),linear-gradient(115deg,rgba(5,22,18,0.92)_0%,rgba(8,38,30,0.72)_42%,rgba(5,22,18,0.34)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-earth-night via-earth-night/70 to-transparent" />
        <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

        <div className="container relative grid min-h-screen content-center gap-10 pb-14 pt-28 sm:pb-18 lg:grid-cols-[minmax(0,1fr)_minmax(370px,0.72fr)] lg:items-end lg:gap-12 lg:pt-32">
          <motion.div className="max-w-4xl" initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div className="mb-5 flex flex-wrap items-center gap-3" variants={itemVariants}>
              <Badge className="border-white/20 bg-white/12 px-3 py-2 text-white backdrop-blur" variant="outline">
                <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" /> Sélection du parc
              </Badge>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-2 text-sm font-semibold text-white/90 backdrop-blur">
                <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" /> {averageRating ? averageRating.toFixed(1) : "--"} · {reviews?.length ?? 0} avis
              </span>
            </motion.div>

            <motion.h1
              className="max-w-4xl text-balance font-display text-5xl font-semibold leading-[0.94] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl xl:text-8xl"
              id="home-hero-title"
              variants={itemVariants}
            >
              Explorez le parc comme une expérience inoubliable.
            </motion.h1>
            <motion.p className="mt-6 max-w-2xl text-balance text-lg leading-8 text-white/80 sm:text-xl" variants={itemVariants}>
              Trouvez les plus beaux itinéraires, réservez des sorties guidées et vivez une immersion nature pensée
              comme les meilleures expériences de voyage.
            </motion.p>

            <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" variants={itemVariants}>
              <Button asChild className="h-14 rounded-2xl px-7 text-base" size="lg" variant="premium">
                <Link to={routes.activities}>
                  Réserver une expérience <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-14 rounded-2xl border-white/20 bg-white/12 px-7 text-base text-white backdrop-blur hover:bg-white/20"
                size="lg"
                variant="outline"
              >
                <Link to={routes.zones}>
                  <Play className="h-5 w-5" aria-hidden="true" /> Découvrir les zones
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.aside
            className="grid gap-4 lg:justify-items-end"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            aria-label="Recherche, confiance et statistiques du parc"
          >
            <SearchPanel />
            <div className="grid w-full grid-cols-1 gap-2 min-[430px]:grid-cols-3 lg:max-w-xl sm:gap-3">
              {stats.map((stat, index) => (
                <AnimatedStat key={stat.label} {...stat} index={index} />
              ))}
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="relative overflow-hidden bg-earth-night pb-16 text-white sm:pb-20" aria-labelledby="discovery-title">
        <div className="container relative">
          <motion.div
            className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-end"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <p className="eyebrow text-accent">Discovery</p>
              <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight sm:text-4xl" id="discovery-title">
                Des expériences prêtes à vivre, pensées pour mobile.
              </h2>
            </motion.div>
            <motion.div className="grid gap-3 sm:grid-cols-3" variants={containerVariants}>
              {trustSignals.map(({ icon: Icon, label, detail }) => (
                <motion.div
                  key={label}
                  className="rounded-2xl border border-white/12 bg-white/[0.10] p-4 backdrop-blur-md"
                  variants={itemVariants}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  <p className="mt-3 text-sm font-bold">{label}</p>
                  <p className="mt-1 text-xs leading-5 text-white/64">{detail}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-8 grid gap-4 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
          >
            {discoveryCards.map((card) => (
              <DiscoveryCard key={card.title} {...card} />
            ))}
          </motion.div>

          <motion.div
            className="mt-6 flex flex-col gap-4 rounded-[1.75rem] border border-white/12 bg-white/[0.10] p-5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-6"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          >
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <Award className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-xl font-semibold">Expérience recommandée par les visiteurs</p>
                <p className="mt-1 text-sm leading-6 text-white/70">
                  Itinéraires vérifiés, groupes limités, guides naturalistes et conseils météo avant départ.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-white/10 px-4 py-3">
              <UsersRound className="h-5 w-5 text-accent" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold">{zones?.length ?? 0} zones</p>
                <p className="text-xs text-white/60">à explorer dans le parc</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
