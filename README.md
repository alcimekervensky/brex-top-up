# BREX TOP UP

Boutique Free Fire en HTG, basée sur React, TypeScript, Tailwind CSS et Supabase. Dépôt : https://github.com/alcimekervensky/brex-top-up

## État MVP

Le site propose un catalogue, une création de commande Supabase (utilisateur connecté), un espace de suivi client, des pages de paiement, et un portail admin séparé (`/admin`) pour recevoir et traiter les commandes. **L’API fournisseur n’est pas encore connectée** : il faut fournir la documentation officielle d’un fournisseur autorisé. Aucune commande ne doit être marquée livrée sans confirmation réelle.

Coordonnées de paiement fournies par le propriétaire du site : bénéficiaire **Alcime Sheidlyne**, NatCash **43737529**, MonCash **31888253**. Vérifiez le nom et les numéros avant d’accepter des paiements en production.

## Installation locale

1. Utilisez Node.js 20+ puis `npm install`.
2. Créez un projet Supabase et exécutez les migrations dans `supabase/migrations/` dans l’ordre.
3. Copiez `.env.example` vers `.env.local`, configurez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.
4. Configurez Supabase Auth (Email, et Google si souhaité) avec les URL de redirection locale et production.
5. Lancez `npm run dev`. Vérifiez avec `npm run build`.

## Configurer le compte administrateur

Créez un utilisateur via l’inscription normale, récupérez son UUID dans Supabase Auth, puis attribuez le rôle admin depuis l’éditeur SQL sécurisé :

```sql
update public.profiles set role = 'admin' where id = '<UUID_DU_COMPTE>';
```

Ne laissez jamais les utilisateurs choisir leur propre rôle. Connectez-vous puis ouvrez `/admin`; les sous-pages `/admin/orders` et `/admin/supplier` sont dans le portail privé. RLS et les fonctions SQL contrôlent aussi les permissions côté serveur.

## Commandes et paiements

Le checkout utilise la fonction Supabase `create_order`; elle prend le prix depuis la base et exige une session. NatCash/MonCash créent une commande en attente. L’admin peut examiner la commande et mettre à jour son état de paiement/traitement. Le wallet n’est débité/crédité que par les opérations contrôlées côté base. Les demandes de dépôt exigent une vérification manuelle.

Les preuves de dépôt exigent un bucket privé `payment-proofs` et ses policies de stockage. Configurez-les dans Supabase avant d’activer l’envoi de captures. Une commande doit être rapprochée par sa référence lors du paiement; le MVP n’intègre pas encore de callback de paiement automatique.

## Fournisseur de Diamonds

Aucun fournisseur n’est connecté. Demandez au fournisseur autorisé sa documentation API officielle et son environnement de test. L’intégration doit vivre dans une Supabase Edge Function; mettez les clés dans Function Secrets, jamais dans React, `.env` public ou une variable `VITE_*`. Voir `docs/provider-integration.md`. Le statut `Completed` est bloqué tant que le fournisseur n’a pas confirmé la livraison.

## Déployer sur Vercel

Importez ce dépôt depuis GitHub dans Vercel; build `npm run build`, sortie `dist`. Ajoutez les variables publiques Supabase dans les réglages Vercel, configurez l’URL de production dans Supabase Auth, puis redéployez. Vérifiez RLS, stockage privé, coordonnées de paiement, fournisseur autorisé et textes juridiques avant le lancement commercial.

## Scripts

- `npm run dev` — développement
- `npm run build` — vérification TypeScript et build
- `npm run preview` — prévisualisation production
