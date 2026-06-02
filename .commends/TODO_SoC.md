Map current journeys + mark prompting footprint
Scan repo tree, files, dependencies, god-classes
Define clean target interface + internal boundaries for new prompting slice
Inventory new concerns & decide placement
Choose incremental strategy (flags, side-by-side, strangler)
Prototype / spike one small vertical slice with 1–2 new concerns
Measure (coupling reduction, test coverage on slice) → iterate


Map current user journeys end-to-end
Identify main steps in each journey
Document components/services/files involved per step
Highlight where cross-cutting or shared logic currently resides
Scan repository folder structure and module boundaries
Identify files/classes/functions related to the target concern
Run static analysis for coupling and dependency metrics
List god-classes, large files, or scattered logic
Define the target bounded context for the concern
Specify the narrow public interface / contract
Decide internal sub-concerns and their ownership
Determine placement of cross-cutting concerns (middleware/decorators)
Inventory new or upgraded features to introduce
Prioritize features by risk and business value
Analyze shared state, databases, or external dependencies
Identify potential breaking changes or format impacts
Define feature flag or toggle mechanism
Plan incremental slices / vertical cuts
Select first minimal vertical slice to implement
Outline test strategy for the isolated slice
Document rollback and observability plan
Write lightweight ADR or decision record
Get alignment from team/architecture stakeholders