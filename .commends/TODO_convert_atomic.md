================================================================================
ADDITIONAL ATOMICITY & COVERAGE ENFORCEMENT (MANDATORY)
================================================================================

PURPOSE
-------
This section strengthens task decomposition requirements to ensure that all
outputs consist of the SMALLEST POSSIBLE atomic tasks and that NO execution,
validation, or governance responsibility is implicitly bundled.

These rules DO NOT introduce new behavior.
They only constrain how tasks MUST be decomposed.

--------------------------------------------------------------------------------
ATOMICITY EXPANSION RULES (STRICT)
--------------------------------------------------------------------------------

A task MUST be split into MULTIPLE tasks if it contains ANY of the following:

1. MULTI-STEP EXECUTION
----------------------
If a task requires more than one observable action, it MUST be split.

Examples of observable actions:
- loading
- validating
- transforming
- emitting
- persisting
- marking status
- terminating
- reporting error

Each observable action REQUIRES its own task.

2. PRECONDITION + ACTION COUPLING
---------------------------------
If a task both:
- verifies a condition
- AND performs a change
it MUST be split into:
- one validation task
- one execution task

3. DECISION + EXECUTION COUPLING
--------------------------------
If a task includes:
- a conditional branch
- a failure decision
- a success path
it MUST be split so that:
- decision evaluation is one task
- execution is another task

4. CONTROL FLOW RESPONSIBILITIES
--------------------------------
Control-flow responsibilities MUST be isolated.

The following MUST NEVER appear in the same task:
- advancing a pointer
- halting execution
- invoking another process
- modifying execution state

Each requires its own task.

5. READ + WRITE COUPLING
-----------------------
If a task reads state AND mutates state, it MUST be split into:
- one read-only task
- one write-only task

6. VALIDATION SURFACE EXPANSION
-------------------------------
If a task validates more than ONE constraint source, it MUST be split.

Examples:
- schema + rules
- rules + dependencies
- syntax + semantics

Each validation surface requires a separate task.

7. ERROR HANDLING COUPLING
-------------------------
If a task both:
- performs work
- AND defines an error reaction
the error reaction MUST be its own task.

8. STATUS MUTATION
------------------
Any task that updates task status, progress, or completion markers
MUST be a standalone task.

Status mutation MUST NEVER be bundled with execution.

--------------------------------------------------------------------------------
COVERAGE COMPLETENESS RULES (MANDATORY)
--------------------------------------------------------------------------------

The following responsibilities MUST be represented as EXPLICIT tasks
if present anywhere in the plan:

- rule loading
- rule validation
- rule conflict detection
- plan parsing
- plan normalization
- ambiguity detection
- phase classification
- dependency graph construction
- cycle detection
- cross-phase dependency identification
- missing dependency detection
- sorting enforcement
- emission gating
- output partitioning
- artifact naming
- schema validation
- deterministic ordering verification
- termination enforcement

If ANY responsibility exists implicitly in the plan but is NOT represented
as a task → FAIL.

--------------------------------------------------------------------------------
MINIMUM ATOMIC TASK TEST (REQUIRED)
--------------------------------------------------------------------------------

Before emitting output, the converter MUST apply the following test
to EACH task:

"Can this task be meaningfully executed, retried, failed, or rolled back
WITHOUT referencing any other behavior?"

If NO → the task is NOT atomic and MUST be split.

--------------------------------------------------------------------------------
PROHIBITED AGGREGATION (STRICT)
--------------------------------------------------------------------------------

A task MUST NOT:
- perform setup + execution
- perform execution + cleanup
- perform validation + mutation
- perform detection + resolution
- perform planning + acting
- perform emitting + finalization

Each MUST be separate tasks.

--------------------------------------------------------------------------------
FAILURE CONDITIONS (EXPANDED)
--------------------------------------------------------------------------------

The converter MUST FAIL if:
- Any task covers more than one execution concern
- Any responsibility is implied but not task-represented
- Any task could be partially completed
- Any task cannot be independently reasoned about
- Any task cannot be independently logged, audited, or retried

--------------------------------------------------------------------------------
END OF ATOMICITY & COVERAGE ENFORCEMENT
================================================================================
