
***THIS IS READ ONLY FILE AND SHOULD NOT BE EDITED UNDER ANY CIRCUMSTANCES.**
# Post-Implementation Checklist

**When**: Run after **each plan** implementation
**Rule**: Complete every item below in order. Do not skip unless the item is explicitly not applicable (e.g. no migrations for that scope).

---

- [ ] **1. move the plan file** (if not alrady there) to the following location and add perflix as described in cursor rules.
- [ ] **3. Migrations** — If needed: run migrations (e.g. `pnpm db:migrate`); N/A if no migrations for this scope.
- [ ] **4. Build** — Run `pnpm build` from ; resolve any issues.
- [ ] **5  Clean** - Check and Clean any depraced old code/docuemented needs to be removed/adjust and clean/adjust it.
- [ ] **5. Handoff brief** — read the following file `notes/implementations/readme.txt` and create the plan implemnetaion brife for the next agent.
- [ ] **6. add implemnt item/s to checklist** — only if a new high level item has implemented then Update `notes/implementations/implementaion_progress_checklist.md` with a high level implementaion goal/mark as done what that acomplished on the plan (one per plan/phase/several per phase/plan - what is reasonable).
