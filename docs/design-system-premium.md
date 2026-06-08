# Design system premium - Parc National

## 1. Palette de couleurs

- `primary`: vert forêt profond, utilisé pour actions principales, liens actifs et confiance.
- `accent`: soleil/ambre, utilisé pour notes, CTA premium et moments d'émotion.
- `earth.forest`, `earth.moss`, `earth.canopy`: profondeur naturelle, exploration, navigation.
- `earth.sand`: surfaces calmes et arrière-plans éditoriaux.
- `earth.clay`: chaleur, aventure, storytelling.
- `earth.river`: fraîcheur, découverte, contraste secondaire.
- `earth.night`: mode sombre, premium, immersion nocturne.

La palette évite une interface monochrome: vert pour confiance, ambre pour conversion, sable pour respiration.

## 2. Typographie

- `font-display`: titres premium et storytelling, esprit éditorial National Geographic.
- `font-sans`: interfaces, formulaires, navigation, contenus denses.
- H1/H2: `display-title`, titres courts et émotionnels.
- Labels: gras, compacts, très lisibles.
- Texte descriptif: lignes de 6 à 7 de leading pour lecture mobile.

## 3. Spacing system

- Base Tailwind 4px.
- Espacements clés: `4`, `5`, `6`, `8`, `10`, `14`, `18`.
- Sections: `.section-shell` avec `py-10`, `sm:py-14`, `lg:py-18`.
- Cards: padding `p-5` mobile, `p-6` desktop.

## 4. Radius system

- `sm`: 6px, inputs compacts.
- `md`: 8px, boutons et badges.
- `lg`: 10px, surfaces fonctionnelles.
- `xl`: 12px, cards premium et containers immersifs.

## 5. Shadows

- `shadow-soft`: surfaces éditoriales légères.
- `shadow-lift`: éléments interactifs et CTA.
- `shadow-premium`: cards importantes et formulaire sticky.
- `shadow-glow`: scènes hero ou overlays riches.

## 6. Gradients naturels

- `gradient-canopy`: forêt vers rivière, pour marque et avatars.
- `gradient-sunrise`: ambre vers argile et forêt, pour CTA émotionnel.
- `gradient-mist`: arrière-plan doux des sections découverte.

## 7. Cards immersives

Les cards doivent combiner:
- image ou signal visuel fort,
- statut lisible,
- interaction hover `interactive-lift`,
- profondeur contrôlée,
- texte court et scannable.

## 8. Sections découverte

Pattern recommandé:
- eyebrow court,
- titre éditorial,
- description orientée bénéfice,
- grille de cards,
- preuve sociale ou signal de confiance proche du CTA.

## 9. Avis utilisateurs

Les avis utilisent:
- avatar initiale en gradient,
- badge `Avis vérifié`,
- rating visible,
- date discrète,
- citation lisible,
- animation scroll légère.

## 10. Notes

Le composant `Rating` standardise:
- étoiles ambre,
- valeur numérique si utile,
- fallback visuel pour notes faibles,
- aria-label accessible.

## 11. Badges

- `default`: statut fort.
- `trust`: sécurité, vérification, disponibilité fiable.
- `premium`: expérience vécue, sélection, recommandations.
- `outline`: filtres ou informations secondaires.

## 12. Navbar sticky moderne

- Fond translucide avec blur.
- Logo gradient compact.
- Navigation desktop en capsule.
- Onglet actif très visible.
- CTA réservation ou connexion toujours accessible.

## 13. Mobile navigation UX

- Menu déroulant pour accès complet.
- Bottom nav fixe pour exploration rapide.
- Zone de sécurité `safe-area-inset-bottom`.
- Contenu principal avec padding bas pour éviter les chevauchements.

## 14. Transitions spring

- Timing global `ease-spring`.
- Transitions courtes: 220ms à 300ms.
- Scroll animation des reviews via Framer Motion: spring, damping 18.

## 15. Hover fluides

- Cards: translation verticale légère + ombre.
- CTA: lift léger + shadow premium.
- Nav: capsule active sans changement de layout.

## 16. Micro-interactions

- Shimmer sur skeleton loaders.
- Stars ambre dans formulaire avis.
- Avatar gradient sur avis.
- Badges contextuels autour des formulaires.

## 17. Animations scroll

- `ReviewCard` apparaît au scroll avec `whileInView`.
- Animation limitée à l'opacité et translation pour préserver performance.
- Les listes longues doivent rester virtualisables si nécessaire.

## 18. Skeleton loaders

- `Skeleton` utilise shimmer horizontal.
- `LoadingGrid` garde des ratios stables pour éviter les layout shifts.
- Les skeletons doivent imiter la structure finale.

## 19. Empty states

- `EmptyState` donne un message utile et émotionnel.
- Icone ronde, texte court, action optionnelle.
- Usage: aucun avis, aucune réservation, aucun résultat filtré.

## 20. Dark mode

Le mode sombre est défini par les variables `.dark`:
- fond `earth.night`,
- surfaces profondes,
- texte sable clair,
- accent ambre conservé,
- bordures adoucies.

Il reste à ajouter un toggle UI si le produit exige un contrôle utilisateur.

## Analyse de cohérence visuelle

- La palette combine confiance, aventure et premium sans tomber dans une seule famille de verts.
- Les composants partagent radius, ombres, transitions et surfaces.
- Les avis sont maintenant alignés avec l'objectif social proof.
- La navigation mobile répond aux usages de découverte rapide.

## Améliorations UX premium proposées

- Ajouter un filtre "type de voyageur": famille, couple, aventure, calme.
- Ajouter des avis avec photos pour renforcer la preuve sociale.
- Ajouter un module "Pourquoi réserver avec nous" près du formulaire réservation.
- Ajouter un tunnel réservation en 3 étapes: dates, participants, confirmation.
- Ajouter un score de difficulté et une durée sur les activités.
- Ajouter un mode carte pour explorer les zones.
- Ajouter un thème sombre automatique basé sur `prefers-color-scheme`.
