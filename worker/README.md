# theopenfield-counter

A tiny visit counter for theopenfield.org, backed by a single Workers KV key.
Not deployed as part of the site build — deploy this alongside (or after) the
Cloudflare Pages project when ready:

```bash
cd worker
npm install
wrangler kv namespace create COUNTER
# paste the returned id into wrangler.jsonc's kv_namespaces[0].id
wrangler deploy
```

Then point the site's counter endpoint (`data-visit-counter` in index.html's
footer) at the deployed Worker's URL, e.g. `https://counter.theopenfield.org/api/hits`
(wire up a route or custom domain for the Worker to match).

The frontend (`script.js`) fetches this endpoint on page load and hides the
counter element entirely if the request fails for any reason — offline,
unreachable (e.g. the homelab PPE host), or misconfigured. This is by design:
the counter should never show an error or a stale value.
