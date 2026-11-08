# BREX TOP UP

Plateforme de vente de produits Free Fire en HTG, construite avec React, TypeScript, Tailwind CSS et Supabase. Le dépôt fournit le storefront, les flux de compte/commande, une migration SQL sécurisée et une architecture d’intégration fournisseur sans API fictive.

> **État de lancement :** configurez Supabase, les coordonnées de paiement et un fournisseur autorisé avant d’accepter de vrais paiements. Les commandes et paiements ne sont pas simulés comme livrés; l’automatisation fournisseur est volontairement désactivée tant que les identifiants réels ne sont pas ajoutés.

## Démarrage local

1. Installez Node.js 20+.
2. Clonez le dépôt et exécutez `npm install`.
3. Créez un projet Supabase et appliquez `supabase/migrations/202611080001_initial_schema.sql` via la CLI ou l’éditeur SQL.
4. Copiez `.env.example` vers `.env.local` et renseignez l’URL Supabase et la clé anon publique.
5. Lancez `npm run dev`, puis `npm run build` pour vérifier la compilation.

## Configuration Supabase

- Activez Email/Password et, si souhaité, Google dans Authentication > Providers et ajoutez les URL de redirection locale et Vercel.
- Activez l’envoi de confirmation d’email et configurez le SMTP de production.
- Le SQL crée tables, politiques RLS, produits de base et fonctions transactionnelles. Le rôle `admin`/`reseller` ne peut pas être choisi par l’utilisateur; attribuez-le via une opération SQL privilégiée ou un outil serveur de confiance, jamais depuis le navigateur.
- Créez un bucket privé `payment-proofs`; utilisez les policies de la migration, et définissez une limite de taille/MIME dans Supabase Storage.
- Pour accorder l’administration initiale, identifiez le UUID dans `auth.users`, puis exécutez dans l’éditeur SQL comme propriétaire de projet : `update public.profiles set role = 'admin' where id = '<UUID>';` Protégez cet accès et ne l’exposez jamais au client.

## Paiements et portefeuille

Les paiements NatCash/MonCash sont des transferts manuels : l’utilisateur envoie la référence et une preuve privée, puis un administrateur vérifie le reçu. Le portefeuille ne peut être crédité que par la fonction de validation côté serveur et les fonctions SQL avec verrouillage/idempotence. Ne faites jamais confiance à un montant fourni par le navigateur. Les numéros bénéficiaires de démonstration sont volontairement omis; publiez uniquement des coordonnées vérifiées.

## Fournisseur de livraison

Aucune API Free Fire n’est inventée ni intégrée. Branchez uniquement un fournisseur officiel/autorisé dans une Edge Function Supabase (ou serveur privé), stockez URL/clé/secret dans les secrets de fonction, journalisez les identifiants et réponses expurgées, ajoutez timeouts, retries avec backoff et idempotency key. N’envoyez jamais de clé fournisseur dans `VITE_*` et ne passez une commande à `Completed` qu’après vérification de livraison fournisseur. Gardez les actions d’administration et remboursements audités.

## Déploiement Vercel

1. Importez ce dépôt dans Vercel, framework Vite, build `npm run build`, output `dist`.
2. Ajoutez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` aux environnements Preview/Production.
3. Ajoutez l’URL de production aux URL autorisées Supabase Auth et aux callbacks OAuth Google.
4. Redéployez après toute modification des variables.
5. Vérifiez RLS, bucket privé, SMTP, coordonnées et politiques juridiques avant de mettre en ligne.

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — vérification TypeScript et build Vite
- `npm run preview` — prévisualisation de production

## Limites à configurer avant commercialisation

Google OAuth nécessite ses identifiants; WhatsApp utilise encore un numéro placeholder dans l’interface. Les tutoriels, e-mails support et coordonnées de paiement doivent être ajoutés. Les règles légales sont des modèles, pas un avis juridique. Le traitement automatique fournisseur, la gestion complète des revendeurs et les notifications nécessitent leurs fonctions serveur/intégrations réelles.
