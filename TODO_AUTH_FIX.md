# Auth Page Layout Fix Plan

## Information Gathered:
- Current CSS uses `height: 100vh` with `overflow: hidden` on `.page-auth` and `.auth-main`
- `.auth-shell` has fixed `max-height` causing content cutoff
- Two-column grid layout on desktop (`.auth-shell { grid-template-columns: 1fr 1fr }`)
- Mobile breakpoint at 980px switches to single column
- Form is in `.auth-left` panel, branding content in `.auth-right`

## Plan:
1. **Update `.page-auth`**: 
   - Change `height: 100vh` to `min-height: 100vh`
   - Remove `overflow: hidden` to allow natural scrolling

2. **Update `.auth-main`**:
   - Change `height: 100vh` to `min-height: 100vh`
   - Remove `overflow: hidden`

3. **Update `.auth-shell`**:
   - Change `height: auto` to `min-height: calc(100vh - clamp(32px, 6vw, 48px))`
   - Remove `max-height` constraint
   - Keep `overflow: hidden` for the shell container

4. **Update `.auth-left` (Form Panel)**:
   - Add `overflow-y: auto` to enable internal scrolling
   - This makes only the form panel scrollable when content overflows

5. **Update `.auth-right` (Branding Panel)**:
   - Add `overflow-y: auto` for consistency
   - Ensure branding content scrolls if needed

6. **Update Mobile Breakpoints**:
   - At 980px: Ensure both panels can grow and scroll naturally in stacked layout
   - At 640px: Fine-tune padding adjustments

## Dependent Files:
- `frontend/styles/pages/auth.css` - Primary file to edit

## Followup Steps:
- No additional installation required
- Test by viewing auth page at various viewport heights
- Verify form fields, buttons, and all text remain visible and accessible

