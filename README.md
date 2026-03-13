# TaskFlow - Auth + Protected Layout

Application React + TypeScript avec authentification simple via `json-server`.

## Lancer le projet

1. Installer les dependances:

```bash
npm install
```

2. Lancer le backend mock:

```bash
npx json-server --watch db.json --port 4000
```

3. Lancer le frontend Vite:

```bash
npm run dev
```

## Verification Backend (users)

`db.json` contient maintenant la collection `users` avec 3 comptes.

Tests attendus:

1. `http://localhost:4000/users` retourne les 3 users en JSON.
2. `http://localhost:4000/users?email=admin@taskflow.com` filtre bien par email.

Note: les mots de passe sont en clair uniquement pour la demo. En production, jamais.

## Comptes de test

1. `admin@taskflow.com` / `admin123`
2. `ali@taskflow.com` / `ali123`
3. `sara@taskflow.com` / `sara123`

## Questions + Reponses

### Q2. Pourquoi `useAuth()` lance une erreur si le context est `null` ? Quel bug ca previent ?

Cette erreur protege contre l'utilisation de `useAuth()` hors du `AuthProvider`.
Sans ce guard, le code lirait un context `null`, ce qui produirait des erreurs plus tard (ex: `cannot read properties of null`) et rendrait le debug plus difficile.

### Q3. Sans Context, comment partager le user entre `Header`, `Sidebar` et `Login` ? Combien de props ?

Il faudrait faire du prop drilling: stocker `user` et les callbacks (`login`, `logout`) dans un parent commun puis les passer de composant en composant.
On passerait au minimum `user`, `setUser` ou `onLogin`, `onLogout`, et potentiellement `loading`/`error` selon les besoins. Donc rapidement plusieurs props a travers plusieurs niveaux.

### Q4. Pourquoi `e.preventDefault()` est indispensable dans `handleSubmit` ?

Parce qu'un `<form>` soumet par defaut la page (reload navigateur).
`e.preventDefault()` bloque ce comportement pour garder l'application SPA, conserver le state React et executer la logique async de login proprement.

### Q5. Que fait la destructuration `{ password: _, ...user }` ? Pourquoi exclure le password ?

Elle extrait la cle `password` dans une variable `_` (ignoree) puis met toutes les autres proprietes dans `user`.
On exclut le mot de passe pour ne pas le stocker dans l'etat global, ne pas l'exposer inutilement dans les composants, et limiter les risques de fuite.

### Q6. Pourquoi `Dashboard` est separe de `App` ?

Pour separer les responsabilites:

1. `App` decide seulement: utilisateur connecte ou non.
2. `Dashboard` gere la logique metier du board (fetch, sidebar, rendu principal).

Ce decoupage rend le code plus lisible, plus testable et plus simple a maintenir.

### Q7. Test flux complet: login -> dashboard -> deconnexion -> login

Flux attendu:

1. Login avec `admin@taskflow.com / admin123`.
2. Affichage du dashboard.
3. Clic sur `Deconnexion`.
4. Retour automatique vers la page Login.

### Q8. `onLogout` est un callback: dessiner le flux

Flux:

1. `Header` recoit `onLogout` en prop.
2. Clic bouton `Deconnexion` dans `Header`.
3. `onLogout()` est execute dans le parent (`Dashboard`).
4. `dispatch({ type: 'LOGOUT' })` met `authState.user` a `null`.
5. `App` re-render.
6. Condition `if (!authState.user)` vraie -> rendu `<Login />`.

### Q9. Pourquoi le flash disparait avec `useLayoutEffect` ?

`useLayoutEffect` s'execute apres le commit DOM mais avant le paint navigateur.
La position est donc calculee avant l'affichage, ce qui evite de voir l'etat initial `(0,0)`.

### Q10. Pourquoi ne pas utiliser `useLayoutEffect` partout ?

Parce qu'il bloque le paint tant qu'il n'a pas fini, donc peut degrader les performances et la fluidite si abuse.
On l'utilise uniquement quand une mesure/synchronisation visuelle doit absolument se faire avant affichage (layout, positionnement, scroll).

