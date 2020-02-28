# API - Trouve Ton Train

Cette API permet de calculer la distance entre deux gares (vol d'oiseau) et de calculer une estimation du prix du voyage (en fonction de la devise choisie par l'utilisateur).

## Route
- ``` 
  /devises/
  ```
  Permet de récupérer la liste des devises.

- ```
  /prix/:devise/:distance/
  ```
  Permet de calculer le prix dans une devise donnée pour une distance donnée.
- ```
  /distance/:latitude1/:longitude1/:latitude2/:longitude2
  ```
  Permet de calculer la distance entre deux points avec leurs latitudes et longitudes.

## Construit avec
- [NodeJs](https://nodejs.org/en/) - Node.js® est un environnement d’exécution JavaScript
- [ExpressJs](https://expressjs.com/fr/) - Un framework Javascript permettant de créer des API
