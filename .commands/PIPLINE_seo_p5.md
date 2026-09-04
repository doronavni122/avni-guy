**read only file***

Substitute `<current_year_and_current_month>` with the actual current calendar year and month at run time (e.g. `2026-07` or `July 2026`) before researching.

SEO work graph (live): `notes/implementations/seo_work_graph.json` — create from `notes/implementations/seo_work_graph.example.json` if missing.

- Read/update the SEO work graph before picking pages.
- Prefer pages never audited (`auditCount` 0), then lowest `auditCount`, then oldest `lastAuditedAt`, among important `main` / next-main pages.
- Select next 5 from graph + current site map; discover new main pages and append with `auditCount` 0.
- Do not re-audit high-`auditCount` pages unless user forces or all others are done / priority demands refresh.
- After audits (or after full pipeline ship), increment `auditCount`, set `lastAuditedAt`, set `lastPipeline`, bump `updatedAt`; write the graph back atomically with the run.

Do the next steps one by one:

- [] Research top 1% <current_year_and_current_month> SEO, AIO, and GEO best practices.
- [] Pick the top 5 main/next main pages from the seo-work-graph. Audit each against the research and suggest best-practice improvements per page.

Delegate one worker for each page.
Each worker should audit one page and report to a new temp file.

When all workers are done, merge all audit temp files into one temp file containing all findings and suggestions.

Then do:
- [] @.commends/TODO_report2checklist.md on the merge file.
- [] @.commends/TODO_validate_true.md
- [] @.commends/TODO_estimate_scops.md
- [] @.commends/TODO_scope_list_implement.md to fully implement the scope list above.
- [] @.commends/TODO_pr_merge_cleanup.md (or equivalent: open PRs, merge, push, delete branches; never delete long-lived default/integration branches).
