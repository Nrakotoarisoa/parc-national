# Architecture frontend - Parc National

## 1. Architecture des dossiers

Le projet suit une architecture feature-based:

```txt
src/
  app/                 # providers, router, store global
  components/          # composants transverses: ui, layout, feedback, forms
  features/            # modules métier isolés
    auth/
    zones/
    activities/
    reservations/
    reviews/
    admin/
    discovery/
    profile/
  hooks/               # hooks transverses
  lib/                 # helpers, client API, constantes
  pages/               # pages globales hors feature
  styles/              # CSS global Tailwind
  types/               # contrats API et domaine partagés
```

Chaque feature peut contenir `api`, `components`, `hooks`, `pages`, `schemas`, `slices` et `types`.

## 2. Layouts

- `PublicLayout`: navigation Tripadvisor-like, contenu front office, footer de confiance.
- `AdminLayout`: navigation latérale, surface dense, orientée gestion.
- `ProtectedRoute`: protège les pages client et admin par token et rôle.
- `PageTransition`: animation globale légère avec Framer Motion.

## 3. Pages

- Accueil immersive avec hero visuel, signaux de confiance et accès exploration.
- Zones: liste responsive et détail avec storytelling visuel.
- Activités: catalogue filtrable à terme, détail et réservation.
- Réservations client: suivi, statut, annulation.
- Avis: liste engageante et formulaire de publication.
- Auth: connexion et inscription.
- Profil: informations utilisateur.
- Admin: statistiques globales et base extensible pour CRUD zones/activités.

## 4. Composants réutilisables

- UI: `Button`, `Card`, `Input`, `Textarea`, `Badge`, `Skeleton`.
- Feedback: `LoadingGrid`, `ErrorState`.
- Layout: `Header`, `Footer`, `PublicLayout`, `AdminLayout`.
- Métier: `ZoneCard`, `ActivityCard`, `ReservationForm`, `ReviewForm`.

## 5. Hooks custom

- `useAppDispatch`, `useAppSelector`: typage Redux.
- `useDebounce`: recherche et filtres performants.
- `useMediaQuery`: adaptations responsive contrôlées par React.
- `usePageTitle`: titres de pages cohérents.

## 6. Slices RTK

- `authSlice`: token, utilisateur courant, logout, persistance token.
- `discoverySlice`: recherche, zone sélectionnée, plage de prix.
- Les données serveur restent dans RTK Query pour éviter la duplication du cache.

## 7. Routes

```txt
/                         Accueil
/zones                    Liste des zones
/zones/:id                Détail zone
/activites                Liste des activités
/activites/:id            Détail activité + réservation
/avis                     Avis + publication
/connexion                Connexion
/inscription              Inscription
/profil                   Profil client protégé
/mes-reservations         Réservations client protégées
/admin                    Dashboard admin protégé
```

## 8. Stratégies de loading

- Skeleton grids pour listes touristiques.
- États par page via `isLoading`, `isError`, `refetch`.
- Prévoir ensuite lazy loading des routes et prefetch RTK Query sur hover pour zones/activités.
- Images en `loading="lazy"` sur les cartes, image hero prioritaire.

## 9. Patterns d'erreur

- Erreurs API normalisées dans `baseApi` avec `{ status, data.message }`.
- `ErrorState` centralisé avec bouton `Réessayer`.
- Validation métier côté formulaire avec Zod: dates, notes, email, mot de passe.
- Les erreurs serveur de formulaire peuvent être ajoutées dans un composant `FormError`.

## 10. Animations globales

- Transitions page: opacity + translation courte.
- Hover cards: élévation légère, zoom image limité.
- Pas d'animations lourdes sur les listes longues.
- Respect futur de `prefers-reduced-motion` pour réduire les transitions.

## 11. Stratégies responsive

- Mobile-first Tailwind.
- Grids progressives: 1 colonne mobile, 2 tablette, 3 desktop.
- Admin en sidebar desktop, navigation condensée mobile.
- Hero plein écran avec contenu lisible et section suivante visible.
- Tailles fixes/stables pour boutons, cartes et skeletons afin d'éviter les shifts.

## 12. Conventions de code

- TypeScript strict, alias `@/*`.
- Noms de fichiers: `PascalCase.tsx` pour composants/pages, `camelCase.ts` pour hooks/helpers.
- Types domaine dans `src/types/domain.ts`.
- Schémas Zod proches des features.
- Endpoints injectés par feature via `baseApi.injectEndpoints`.
- Composants orientés composition, pas de logique API dans les composants UI.

## 13. Optimisations frontend

- Cache serveur RTK Query par tag.
- Invalidation ciblée après mutations.
- Axios timeout global et injection Authorization.
- Images lazy, aspect ratios stables.
- Séparation feature-based pour code splitting futur.
- Prévoir `React.lazy` sur les pages quand le volume augmente.

## 14. Patterns d'API

- Une seule base RTK Query: `baseApi`.
- Transport Axios pour intercepteurs et timeouts.
- Tags: `Auth`, `Zone`, `Activity`, `Reservation`, `Review`, `AdminStats`.
- Mutations invalidantes: création avis, réservation, annulation, création admin.
- Payloads alignés sur le cahier des charges: `mot_de_passe`, `id_activite`, `date_debut`, `date_fin`, `note`.

## Améliorations professionnelles proposées

- Ajouter un vrai système de filtres: recherche, prix, disponibilité, zone.
- Ajouter des toasts pour succès/erreur de réservation et d'avis.
- Ajouter la gestion refresh token si l'API le permet.
- Ajouter des tests Vitest/Testing Library sur formulaires Zod et guards de routes.
- Ajouter un module admin CRUD complet avec tables, formulaires et pagination.
- Ajouter un design token d'images locales pour éviter la dépendance aux URLs externes en production.
