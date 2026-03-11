# Jeu d'Échecs

Une application web moderne de jeu d'échecs construite avec Next.js 13, React et Tailwind CSS.

## À propos du projet

Ce projet est une application de jeu d'échecs interactive qui permet aux joueurs de s'affronter contre un ordinateur avec différents niveaux de difficulté. L'interface est moderne, responsive et utilise les dernières technologies web pour offrir une expérience de jeu fluide.

## Fonctionnalités

- **Jeu d'échecs complet** avec toutes les règles standard
- **Interface moderne** avec design sombre élégant
- **Plusieurs niveaux de difficulté** pour adapter le défi
- **Choix de couleur** (jouer avec les blancs ou les noirs)
- **Mouvements validés** automatiquement
- **Interface responsive** pour mobile et desktop
- **Animations fluides** et interactions intuitives

## Stack Technique

- **Framework**: Next.js 13 avec App Router
- **Langage**: TypeScript
- **Styling**: Tailwind CSS
- **Logique du jeu**: chess.js
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- Node.js (version 18 ou supérieure)
- pnpm (recommandé) ou npm/yarn

## Installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repository>
   cd gameChess
   ```

2. **Installer les dépendances**
   ```bash
   pnpm install
   ```
   *Si vous n'utilisez pas pnpm :*
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env.local
   ```
   *Note : Pour le développement local, les variables par défaut dans `.env.example` sont suffisantes.*

## Lancement du projet

### Mode Développement

```bash
pnpm dev
```

L'application sera accessible à l'adresse : **http://localhost:3000**

### Mode Production

```bash
pnpm build
pnpm start
```

## Comment utiliser l'application

### 1. Démarrer une partie

- Accédez à la page d'accueil
- Configurez vos préférences :
  - **Couleur** : Choisissez de jouer avec les Blancs ou les Noirs
  - **Difficulté** : Sélectionnez le niveau de l'IA
- Cliquez sur "Commencer la partie"

### 2. Jouer

- **Déplacer les pièces** : Cliquez sur une pièce pour la sélectionner, puis cliquez sur la case de destination valide
- **Tour actuel** : Le côté dont c'est le tour est indiqué dans la barre latérale
- **Mouvements valides** : Les cases de destination valides sont mises en évidence
- **Historique** : Les mouvements récents sont affichés dans la barre latérale

### 3. Fonctions disponibles

- **Nouvelle partie** : Réinitialise le jeu avec les mêmes paramètres
- **Retour au menu** : Change les paramètres de partie
- **Validation automatique** : Les mouvements invalides sont automatiquement rejetés

### 4. Fin de partie

La partie se termine lorsqu'un des joueurs est en :
- **Échec et mat** (Checkmate)
- **Pat** (Stalemate)
- **Abandon** (si vous retournez au menu)

## Structure du projet

```
gameChess/
├── app/                    # Pages Next.js 13
│   ├── Game/              # Page du jeu
│   └── (home)/            # Page d'accueil
├── components/            # Composants React
│   ├── Game/             # Composants du jeu
│   │   ├── chessArea.tsx # Zone de jeu principale
│   │   ├── GameSidebar.tsx # Barre latérale
│   │   └── chessBoard/   # Composants de l'échiquier
│   ├── NavBar.tsx        # Barre de navigation
│   └── ui/               # Composants UI réutilisables
├── lib/                   # Utilitaires et logique
├── styles/               # Styles globaux
└── public/               # Fichiers statiques
```

## Personnalisation

### Changer les couleurs

Les couleurs du thème sont définies dans `tailwind.config.js`. Vous pouvez modifier :
- La couleur de fond principale
- Les couleurs des pièces
- Les couleurs de surbrillance

### Ajouter des fonctionnalités

Pour ajouter de nouvelles fonctionnalités :
1. Créez de nouveaux composants dans `components/Game/`
2. Ajoutez la logique dans `lib/`
3. Mettez à jour les pages dans `app/`

## Scripts disponibles

```bash
pnpm dev          # Lance le serveur de développement
pnpm build        # Construit l'application pour la production
pnpm start        # Lance le serveur de production
pnpm lint         # Exécute ESLint
pnpm preview      # Construit et lance en mode preview
```

## Dépannage

### Problèmes courants

1. **Port déjà utilisé**
   ```bash
   # Changez de port ou tuez le processus
   pnpm dev -- -p 3001
   ```

2. **Dépendances manquantes**
   ```bash
   # Réinstallez toutes les dépendances
   rm -rf node_modules
   pnpm install
   ```

3. **Erreurs TypeScript**
   ```bash
   # Vérifiez les types
   pnpm lint
   ```

## Notes de développement

- Le projet utilise l'App Router de Next.js 13
- Les composants sont écrits en TypeScript pour la sécurité des types
- Le jeu utilise la librairie `chess.js` pour la logique des échecs
- L'interface est optimisée pour les écrans tactiles et desktop

## Contribuer

Les contributions sont les bienvenues ! Voici comment contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commitez vos changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Pushez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créez une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE.md](LICENSE.md) pour plus de détails.

## Remerciements

- **chess.js** pour la logique du jeu d'échecs
- **Next.js** pour le framework web
- **Tailwind CSS** pour le styling
- **Radix UI** pour les composants accessibles
