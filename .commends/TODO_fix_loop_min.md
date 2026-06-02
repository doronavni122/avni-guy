Please help fix the current issue in my codebase while following this strict process. The goal is to resolve all issues iteratively without degrading any existing features, implementations, or performance. Do not stop until the Vercel logs show no errors or warnings, and E2E tests pass successfully.

Step-by-step process:
1. Apply the minimal necessary fixes to address the root cause of the issue. Suggest changes, explain why they fix the problem, and ensure they don't break or alter unrelated functionality.
2. After applying fixes, automatically run `vercel deploy --prod` to deploy to production.
3. Once deployment completes, capture the deployment ID from the output.
4. Run `vercel logs <deployment_id>` to fetch and review the full logs.
5. Trigger a "create new project" action on the deployed site (e.g., via API or UI simulation if needed) and monitor the Vercel logs for any new issues during this action.
6. If the logs show any errors, warnings, or unexpected behavior:
   - Analyze and suggest potential root causes.
   - Propose fixes without degrading features.
   - Repeat the entire process from step 1.
7. To verify beyond logs, integrate or run E2E tests using Playwright:
   - If not already set up, add a basic Playwright test suite (e.g., in `tests/e2e.spec.ts`) to simulate user actions like creating a new project.
   - Example test: Navigate to the deployed URL, perform the "create new project" flow, and assert no errors (e.g., check for success messages, no console errors, and expected UI elements).
   - Run the tests automatically after each deployment using `npx playwright test`.
   - Only consider the iteration complete if both logs are clean and tests pass.

Continue looping through this process until there are no issues in logs or tests. Provide updates after each iteration, including logs snippets, test results, and any proposed changes.