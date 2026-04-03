# TaskFlow - TP Securite, Redux Toolkit et Performance

## Lancement du projet

### Backend

```bash
npx json-server --watch db.json --port 4000
```

### Frontend

```bash
npm run dev
```

Le frontend tourne sur `http://localhost:5173` et l'API sur `http://localhost:4000`.

## Partie 1 - Securite XSS dans TaskFlow

### Q1. Le script s'execute-t-il avec `{dangerousName}` dans le JSX ?

Non. Le script ne s'execute pas.

React echappe automatiquement les strings inserees dans le JSX. Le HTML malveillant est rendu comme du texte brut et non comme du HTML interprete par le navigateur. C'est l'une des protections XSS par defaut de React.

### Q2. Que se passe-t-il avec `dangerouslySetInnerHTML` ?

Avec `dangerouslySetInnerHTML`, React n'echappe plus la string. Le navigateur recoit du vrai HTML et peut executer les handlers inline comme `onerror`.

Conclusion : `dangerouslySetInnerHTML` contourne la protection XSS automatique de React. Il ne faut jamais l'utiliser avec des donnees utilisateur ou API non nettoyees.

## Partie 2 - Authentification JWT simulee

Le login genere maintenant un faux token apres authentification reussie et Redux conserve ce token en memoire. Axios l'ajoute automatiquement dans le header `Authorization`.

### Q3. Voyez-vous le header `Authorization: Bearer ...` sur `GET /projects` ?

Oui. Apres connexion, les requetes envoyees par Axios portent `Authorization: Bearer <token>` tant que le token est present dans le store.

Apres logout, le header est supprime.

### Q4. Pourquoi stocker le token en memoire et pas dans `localStorage` ?

`localStorage` est lisible par tout script JavaScript execute dans la page. En cas de XSS, le token peut donc etre vole facilement.

Le state React / Redux en memoire est preferable ici parce qu'il :

- n'est pas persistant apres refresh
- n'est pas expose comme stockage navigateur persistant
- reduit le risque de vol simple par script injecte

Ce n'est pas parfait, mais c'est plus prudent que `localStorage` dans ce TP.

## Partie 3 - Migration vers Redux Toolkit

`AuthContext` et `authReducer` ont ete remplaces par Redux Toolkit.

### Q5. Comparez `authSlice.ts` avec l'ancien `authReducer.ts`. Qu'est-ce qui a change ?

Les changements principaux sont :

- plus de `switch/case`
- les action creators sont generes automatiquement par `createSlice`
- le reducer et les actions sont regroupes dans un seul fichier
- l'ecriture semble mutable (`state.user = ...`), mais Redux Toolkit utilise Immer pour produire un nouvel etat immuable en coulisse

Le resultat est plus compact, plus lisible et moins verbeux.

## Partie 4 - Performance avec `React.memo` et `useCallback`

`MainContent` et `Sidebar` ont ete memoises, et `Dashboard` transmet des callbacks stables.

### Q6. Combien de composants se re-rendent quand on toggle la sidebar ? Lesquels ne devraient pas ?

Sans optimisation, on voit generalement se re-rendre :

- `Dashboard`
- `HeaderMUI`
- `Sidebar`
- `MainContent`

Celui qui ne devrait pas se re-rendre pour un simple toggle sidebar est surtout `MainContent`, parce que `columns` ne change pas.

### Q7. Pourquoi `MainContent` ne se re-rend plus ? Que compare `React.memo` ?

`React.memo` fait une comparaison superficielle des props.

Si la prop `columns` garde la meme reference entre deux renders, React saute le rendu de `MainContent`. Le toggle sidebar change `sidebarOpen`, pas `columns`, donc `MainContent` peut etre reutilise.

### Q8. Quelle difference entre `useMemo` et `useCallback` ?

- `useMemo` memorise une valeur calculee
- `useCallback` memorise une fonction

On utilise `useMemo` pour eviter un recalcul couteux.
On utilise `useCallback` pour conserver une reference de fonction stable, surtout quand cette fonction est passee a un composant memoise.

## Partie 5 - Custom Hook `useProjects`

La logique CRUD de `Dashboard` a ete extraite dans `src/hooks/useProjects.ts`.

Avantages :

- `Dashboard.tsx` est plus simple
- la logique reseau est centralisee
- le code CRUD devient plus reutilisable
- la separation logique / presentation est meilleure

## Partie 6 - React Profiler

### Q10. Quels composants se re-rendent et combien de temps prend le render ?

Comportement attendu apres optimisations :

- Toggle sidebar : `Dashboard`, `HeaderMUI`, `Sidebar` se re-rendent; `MainContent` ne devrait plus se re-rendre
- Ajouter un projet : `Dashboard`, `Sidebar`, `MainContent` et le formulaire se re-rendent
- Naviguer vers `ProjectDetail` : `Dashboard` se demonte, `ProjectDetail` et `Header` se montent
- Se deconnecter : mise a jour de l'etat auth puis redirection vers `Login`

Les temps exacts de render doivent etre mesures dans React DevTools Profiler sur la machine locale. Je ne peux pas produire des chiffres precis depuis le terminal. Le critere important ici est la reduction des rerenders inutiles, notamment `MainContent` lors du toggle sidebar.

## Recap des changements dans TaskFlow

- `src/api/axios.ts` : ajout de `setAuthToken` pour `Authorization: Bearer ...`
- `src/features/auth/authSlice.ts` : nouveau slice Redux auth
- `src/store.ts` : nouveau store Redux
- `src/features/auth/Login.tsx` : migration `useSelector` / `useDispatch` + faux JWT
- `src/features/auth/LoginMUI.tsx` : migration Redux egalement
- `src/features/auth/LoginBS.tsx` : migration Redux egalement
- `src/hooks/useProjects.ts` : nouveau hook CRUD
- `src/components/MainContent.tsx` : `React.memo`
- `src/components/Sidebar.tsx` : `React.memo`
- `src/pages/Dashboard.tsx` : simplifie grace a `useProjects` et callbacks stables
- `src/main.tsx` : `Provider store={store}` remplace `AuthProvider`
- `src/features/auth/AuthContext.tsx` : supprime
- `src/features/auth/authReducer.ts` : supprime