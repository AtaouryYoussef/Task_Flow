1. Backend:
npx json-server --watch db.json --port 4000

2. Frontend:
npm run dev

Questions + Reponses tp 3 : 

Q1. Pourquoi <Navigate /> et pas navigate() ?
<Navigate /> s’utilise directement dans le rendu quand on veut rediriger selon une condition.
navigate() s’utilise plutôt dans un événement ou dans un useEffect.

Q2. Quelle est la différence entre navigate(from) et navigate(from, { replace: true }) ?
Sans replace, la page actuelle reste dans l’historique.
Avec replace: true, la page est remplacée, donc on ne peut pas revenir en arrière vers /login.

Q3. Après un POST, pourquoi utiliser setProjects(prev => [...prev, data]) au lieu de refaire un GET ?
Parce que c’est plus rapide. On ajoute directement le projet dans la liste sans refaire une requête au serveur.

Q4. Que se passe-t-il dans ces cas de routes ?

/dashboard sans login → redirection vers /login

/projects/1 sans login → redirection vers /login

/nimportequoi → redirection vers /dashboard

/ → redirection vers /dashboard

Après login → on ne revient pas à /login avec le bouton retour.

Q5. Quelle est la différence entre <Link> et <NavLink> ? Pourquoi utiliser NavLink ?
Link sert juste à naviguer.
NavLink permet aussi de savoir si le lien est actif, donc on peut le styliser (menu actif par exemple).

Q6. ProjectForm est utilisé pour POST et PUT. Qu’est-ce qui change ?
Le formulaire est le même.
La différence est dans l’utilisation :

Create (POST) → champs vides.

Edit (PUT) → champs déjà remplis avec les données du projet.

Q7. Si json-server est arrêté et on fait un POST, que se passe-t-il ?
Axios retourne une erreur réseau. Elle est capturée dans catch et un message d’erreur s’affiche.

Q8. Avec fetch, un 404 ne lance pas d’erreur. Et avec Axios ?
Axios lance automatiquement une erreur pour les statuts comme 404 ou 500.
Donc on passe directement dans catch.