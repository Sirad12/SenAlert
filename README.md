# SenAlert — frontend Angular

Prototype du frontend : carte des signalements, formulaire de signalement, suivi par identifiant et espace administrateur.
Les données sont fictives et gardées en mémoire (voir `src/app/signalement.service.ts`, seul fichier à remplacer pour appeler l'API).

## Lancer
```bash
npm install
ng serve          # http://localhost:4200
```
Compte administrateur de démonstration : `admin` / `demo123`.

## Qualité (étapes du pipeline Jenkins)
```bash
ng test --watch=false     # tests unitaires
ng build                  # build de production dans dist/senalert
```
