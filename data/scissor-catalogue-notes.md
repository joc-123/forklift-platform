# Scissor catalogue version 1

This local section is read-only. It uses no database RPCs. The only forklift-page change is a navigation link.

`scissor-lifts.json` contains forty-one identities verified on 2026-10-17 against the official Genie product and service-index pages, JLG product pages, and Skyjack publication indexes. Exact model spelling and suffixes remain distinct. Sources carry URL, locator, scope, retrieval date and a separate nullable document date.

The runtime validator in `assets/scissor-lifts.js` enforces the version-1 identity-only contract. All production dates, manufacture dates and heights must be null. Adding those facts requires a new contract with field-level provenance, region/revision/configuration and serial applicability, plus tests. No year is inferred from model digits, catalogue presence, document date or publication date.

`scissor-discovery.json` preserves the separate 40-entry research ledger from Library `libfile_7df2d87a0bc88191a37d8df9baf961e0`, version 0. The downloaded 13,788-byte ZIP passed integrity verification. Its rows are source-directory entries, not specification records. Historical and related brands are labelled; they are not counted as independent OEMs. The accompanying research notes retain all import holds.

`scissor-year-evidence.json` preserves six reviewed evidence records from Library libfile_c9bb437458dc8191b01a0539e260c5f5, version 0 (5,530-byte ZIP, integrity checked). These cover 26 exact model names and add 25 identities beyond the prior 16. Expandable guidance retains manual revision/date, PDF pages, serial applicability, plate/label location and ambiguities. No serial parser is implemented. Model year is not equated with manufacture date. Source-level document dates remain in the evidence records, separate from machine values.

Validation: `node --test tests/*.test.cjs`. Local browser QA confirmed catalogue loading, alphabetical brand options, unknown date/height presentation and suffix-specific model search. No push, deployment, database migration or security change is included.
