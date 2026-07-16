# Troubleshooting Guide

> Common issues encountered during development and deployment of Open Money Tracker.

## Table of Contents

- [Missing git connection](#missing-git-connection)
- [compatibility_date is required](#compatibility_date-is-required)
- [Worker name undefined](#worker-name-undefined)
- [Works with npm run dev but fails in production](#works-with-npm-run-dev-but-fails-in-production)
- [Sidebar toggle button does not appear in production](#sidebar-toggle-button-does-not-appear-in-production)
- [Custom domain not visible](#custom-domain-not-visible)
- [Cached or outdated deployment](#cached-or-outdated-deployment)

---

### Missing git connection

**Symptom:**  
The Deploy button does not respond and the browser console shows:

```
Missing git connection
```

**Solution:**  
Re-authorise the **Cloudflare Workers and Pages** GitHub integration. Grant access to the repository `AndrewLenz21/open-money-tracker`.

---

### compatibility_date is required

**Symptom:**  
Wrangler fails the deployment with an error indicating that `compatibility_date` is missing.

**Solution:**  
Add a valid date to `wrangler.jsonc`:

```jsonc
"compatibility_date": "2026-07-15"
```

The date should be recent enough to cover the Workers runtime features used by the project.

---

### Worker name undefined

**Symptom:**  
Cloudflare displays a warning that the Worker name is `undefined`.

**Solution:**  
Add the Worker name to `wrangler.jsonc`:

```jsonc
"name": "open-money-tracker"
```

---

### Works with npm run dev but fails in production

**Symptom:**  
Everything works during `npm run dev` but breaks after `npm run build` / `npm run preview`.

**Explanation:**  
`npm run dev` runs the Astro dev server with Vite's development transforms — individual ES modules, hot module replacement, and loose module resolution. This does **not** reproduce the production environment.

**Solution:**  
Always validate production behaviour with:

```bash
npm run build
npm run preview
```

`npm run preview` serves the exact static output from `dist/` using Astro's built-in preview server. If it works in preview, it will work on Cloudflare.

Common production-only issues:

| Issue | Likely cause |
|-------|-------------|
| JS error on page load | Tree-shaking removed a required export |
| CSS missing | Tailwind class constructed dynamically |
| Component not rendering | Conditional render depends on `import.meta.env.DEV` or `window` during SSR |
| Route not found | Missing trailing-slash handling in Wrangler config |

---

### Sidebar toggle button does not appear in production

**Symptom:**  
The sidebar toggle button (PanelLeftOpen / PanelLeftClose) exists in the DOM during `npm run dev` but is absent in the production build (`npm run build` + `npm run preview`).

**Diagnosis:**  

1. **Check if the element exists in the DOM.**  
   Use DevTools to inspect the navbar. If the button is present but invisible, the issue is CSS (display, opacity, z-index, position).  
   If the button is **not in the DOM at all**, the issue is a conditional render or a hydration error.

2. **Find the conditional render.**  
   In `Navbar.tsx`, the button was wrapped in:

   ```tsx
   {isDashboard ? <button>...</button> : null}
   ```

   If `isDashboard` evaluates to `false`, the button is never rendered.

3. **Check how `isDashboard` is computed.**  

   ```tsx
   const isDashboard =
     typeof window !== "undefined" &&
     window.location.pathname === ROUTES.dashboard;
   ```

   During SSR, `window` is `undefined`, so `isDashboard` is `false`.  
   On `client:only` islands this is not a problem because the component only renders on the client.  
   However, if the component fails to hydrate (JS error, failed module fetch), the conditional never runs and the button stays absent.

4. **Normalise trailing slashes.**  

   ```tsx
   const path = pathname.replace(/\/+$/, "") || "/";
   ```

   Some hosting environments append or strip trailing slashes. Compare the normalised path against both `/` and `/dashboard`.

5. **Pass `isDashboard` as a prop from Astro.**  

   `dashboard.astro`:

   ```astro
   <Navbar isDashboard={true} client:only="react" />
   ```

   `Navbar.tsx`:

   ```tsx
   const isDashboard = propIsDashboard ?? (
     typeof window !== "undefined" &&
     window.location.pathname === ROUTES.dashboard
   );
   ```

   This guarantees the button renders regardless of `window.location` quirks during hydration.

6. **Always verify with `npm run build && npm run preview`.**  
   The dev server can mask issues that only appear in the bundled production output.

---

### Custom domain not visible

**Symptom:**  
The custom domain (`open-money-tracker.andrew-lenz.com`) does not resolve or shows an error.

**Checklist:**

- [ ] The domain is associated with the **Production** environment in the Worker's Domains tab.
- [ ] The correct deployment is active (check the Deployments tab).
- [ ] The HTTPS certificate has finished provisioning (can take a few minutes).
- [ ] A hard refresh (`Ctrl + F5`) has been performed.
- [ ] The domain was added from **Cloudflare Dashboard → Workers & Pages → open-money-tracker → Domains → Add Domain**, not from a separate zone setup.

---

### Cached or outdated deployment

**Symptom:**  
Changes pushed to `main` are not reflected on the live site.

**Checklist:**

- [ ] Check the **Deployments** tab in Cloudflare — is the latest commit deployed?
- [ ] Is the **active deployment** the one you expect?
- [ ] Perform a **hard refresh** (`Ctrl + F5`) to bypass browser cache.
- [ ] Confirm the domain points to the **Production** environment, not a preview branch.
