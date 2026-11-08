# Provider integration (not connected yet)

No Free Fire top-up provider credentials or API documentation have been supplied, so this repository intentionally does not send requests to an invented provider endpoint.

## Required before implementation

Obtain an authorized provider's official API documentation and sandbox credentials. The docs need to specify authentication/signatures, product identifiers, LATAM and GLOBAL handling, create-order and status endpoints, idempotency, callback/webhook signature validation, rate limits, and error/retry semantics.

## Security and delivery rules

- Implement the adapter only in a Supabase Edge Function or trusted server; never use `VITE_*` secrets or expose provider credentials to React.
- Store credentials as Supabase Function secrets (`supabase secrets set PROVIDER_API_URL=... PROVIDER_API_KEY=... PROVIDER_API_SECRET=...`). These sample variable names are configuration placeholders, not provider endpoints.
- Verify webhook signatures and correlate callbacks with the internal order ID/idempotency key.
- Retry only safe/idempotent requests with bounded exponential backoff; log redacted request/response metadata.
- Only the trusted backend adapter may set `orders.provider_status` to `delivered`/`completed` after verified provider confirmation. The admin status RPC prevents manual completion without that confirmation.
- Keep all orders pending/processing when the provider is unavailable; never report delivery based on a payment receipt alone.

The Admin > Fournisseur API screen explains this to operators. Once you select a provider and share its public documentation (not its secret credentials), an adapter can be implemented against that real contract.
