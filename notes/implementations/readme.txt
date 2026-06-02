Plan implementation brief format. One file per plan: notes/implementations/<plan_base>_brief.txt

Sections (dense, machine-parseable):
- next plan suggestion
- files to read
- rules (.cursor/rules/)
- tools and status
- open issues

RULE: For each implementaion plan that crated and implemented model will crate a brife note for the next model using answeing the following quastions:
1. what will you suggest to write to the next model that will plan implementation for continue implementations to copleate all the high level checklist requerments (combined of what possible into a single plan): @implementaion_progress_checklist.md

2. which files to read at the begining of the conversation?
list the names with short sentence of how to treet them.
3. which project rules or to read at the begining of the conversation?
4. which system rules to read at the begining of the conversation? if relevant.
4. describe the new/current tools approach and where we are now in single pharagraph

NOTE: Use the exact plan name (including prefix) for the brief file when tied to a plan. See .cursor/rules/implementation-notes-placement.mdc.
location (plan briefs): notes/implementations/ — only files named NNN_plan_slug_brief.txt where NNN_plan_slug.plan.md exists in .cursor/plans/
location (session / no-plan briefs): notes/sessions/

MUST: make sure all the high level tasks that implemented or in progress are currectly updated in the followig file: @implementaion_progress_checklist.md
location: notes/implementations/implementaion_progress_checklist.md

MUST: always include the root level END-GOAL-PROJECTS.md in the files to read list.
MUST: always include task graph rule in the rules to read list
MUST: always write report creation date in the first section in the following way: date , time, time zone

NOTE: add accpected results after the just implemented plan (manual action to do and see results) before moving with farther implementations:
    - action to do
    - expected result
        - for example action to do: "add new project and send a generate prompt"
        - for example accepctense: "project generated e2e in under 60 second and load results"
