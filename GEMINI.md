# Antigravity Operational Rules

## Mandatory Test Verification
After every development phase is complete, and *before* it is submitted for acceptance/approval, you MUST run the full test suite and verify that all tests pass.
you must also run validate_imports.py and verify that there are no import errors.


## Development Workflow
Every implementation phase begins from an up-to-date dev branch.
Each phase must use its own feature branch.


## Phase Gate Criteria
Before moving from one development phase to the next, the following gate criteria must be satisfied and verified:
- **All tests passing**: Run the full pytest suite.
- **Import validation passing**: Execute `validate_imports.py` and ensure zero errors.
- **No TODOs introduced**: Ensure no new TODOs are introduced by the phase unless explicitly deferred.
- **Documentation updated**: Update user and system documentation as necessary.
- **Architectural decisions recorded**: Record any key architectural/design decisions in the phase artifacts.
- **Monitoring/audit hooks added**: Add prometheus metrics, custom logging, and audit hooks where applicable.
- **One clean commit series with a walkthrough**: Deliver changes in a clean commit history accompanied by a `walkthrough.md` report.


## Database Migration Guidelines
To prevent CI deployment failures (`supabase db push` out-of-order errors, remote history conflicts) and schema-code mismatches:
1. **Single Canonical Directory**: ALL database migrations MUST be placed in `supabase/migrations/`. Do NOT create disconnected migration files in sub-packages or separate directories.
2. **14-Digit Timestamp Filenames**: Migration filenames MUST strictly follow the standard 14-digit timestamp format: `YYYYMMDDHHMMSS_description.sql` (e.g. `20260722191500_phase3n_11_8_feature.sql`). Never use 8-digit date prefixes like `20260722_description.sql` as they cause timestamp resolution collisions with 14-digit timestamps.
3. **Idempotent SQL Statements**: Write DDL using idempotent patterns (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, `DROP CONSTRAINT IF EXISTS`, `CREATE INDEX IF NOT EXISTS`, `ON CONFLICT DO NOTHING`).
4. **Schema Column Alignment**: Always inspect authoritative database schema migrations (`supabase/migrations/`) before querying database columns in application code. Never query non-existent columns (e.g. query `deleted_at` instead of non-existent `is_deleted`).
5. **No Destructive Repair Hacks in CI Workflows**: GitHub Actions deployment workflows MUST run `supabase db push --include-all` and MUST NOT include `supabase migration repair --status reverted` hacks which corrupt remote migration history.



