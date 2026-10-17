# Scissor catalogue version 1

This local section is read-only. It uses no database RPCs. The only forklift-page change is a navigation link.

`scissor-lifts.json` contains sixty-six identities verified on 2026-10-17 against the official Genie product and service-index pages, JLG product pages, and Skyjack publication indexes. Exact model spelling and suffixes remain distinct. Sources carry URL, locator, scope, retrieval date and a separate nullable document date.

The runtime validator in `assets/scissor-lifts.js` enforces the version-1 identity-only contract. All production dates, manufacture dates and heights must be null. Adding those facts requires a new contract with field-level provenance, region/revision/configuration and serial applicability, plus tests. No year is inferred from model digits, catalogue presence, document date or publication date.

`scissor-discovery.json` preserves the separate 40-entry research ledger from Library `libfile_7df2d87a0bc88191a37d8df9baf961e0`, version 0. The downloaded 13,788-byte ZIP passed integrity verification. Its rows are source-directory entries, not specification records. Historical and related brands are labelled; they are not counted as independent OEMs. The accompanying research notes retain all import holds.

`scissor-year-evidence.json` preserves six reviewed evidence records from Library libfile_c9bb437458dc8191b01a0539e260c5f5, version 0 (5,530-byte ZIP, integrity checked). These cover 26 exact model names and add 25 identities beyond the prior 16. Expandable guidance retains manual revision/date, PDF pages, serial applicability, plate/label location and ambiguities. No serial parser is implemented. Model year is not equated with manufacture date. Source-level document dates remain in the evidence records, separate from machine values.

Validation: `node --test tests/*.test.cjs`. Local browser QA confirmed catalogue loading, alphabetical brand options, unknown date/height presentation and suffix-specific model search. No push, deployment, database migration or security change is included.

## Genie deep evidence checkpoint

Library libfile_3b25d352f8288191897311f543331704, version 0, downloaded 5,652-byte archive with valid ZIP integrity. The unchanged structured ledger is retained as genie-deep-evidence.json. Nine identities from manual 96316 were added: GS-1530, GS-1532, GS-1930, GS-1932, GS-2032, GS-2632, GS-2046, GS-2646, GS-3246. Three additional guidance records cover the older model-year format, the 97385 illustrative-plate conflict hold, and exact-unit GS-5390 serial GS90F-54033 (plate manufacture year 2017 only). No serial parser, neighboring-year interpolation, inferred production interval or model-wide manufacture year was added. Generic listing years and the 1997 category launch remain separate research semantics. Public lookup routes are not represented as verified manufacture-date services. All 34 tests passed. Changes remain local pending the next publication decision.

## JLG lookup evidence correction

Library libfile_e190bc65b74481919e387a6ecfd60edd passed ZIP and all four supplied SHA256 checks. Added 4394RT and RT4069 identities from serial-matched official lookup observations. Retained all four observations with manufacture_year null. Corrected the erroneous Skyjack URL attached to JLG 3121656 Rev H using the existing verified JLG record; original URL retained for audit. Added source-linked lookup guidance without deriving manufacture year from shipping, service, warranty, PVC, country prefix or excluded vertical-mast 1230ES evidence.

## Other-brand evidence checkpoint

Library libfile_5f3ba424adec81918b46315077d89e6d passed ZIP integrity and all five supplied SHA256 checks. Added 14 identities: Snorkel S3370RT; UpRight X26N; MEC 1930SE, 2632SE, 3346SE, 4046SE, 4555SE, Nano10-XD, Micro 19; Haulotte COMPACT 8, COMPACT 8W, COMPACT 10N, COMPACT 10, COMPACT 12. Preserved external-host provenance for Haulotte and UpRight manuals. MEC guidance uses cover/index intersection: 4555SE begins 16800001, Nano10-XD begins 18000019; excluded earlier serials remain unresolved. UpRight 5119+/51119+ conflict retained. No source-manual intervals became year mappings.

A local Snorkel format checker accepts only exact S3370RT-07-17MMNNNNN, valid month 01–12, and explicitly qualifies its output as a format interpretation requiring plate comparison. The source establishes 17 as 2017, so no century pivot or other year is inferred. Unsupported formats/models/plants/years remain unknown. No machine catalogue date is populated.

Holland Lift lineage corrected against Sinoboom announcement https://www.sinoboom.com/content/details_34_986.html: brand/IP acquired, planned Q1 2026 production, actual resumed production unverified. Prior closure evidence and legacy/new-production separation retained. No deployment in this checkpoint.


## Scoped model-year and plate-guidance update — 17 October 2026

110 model/trade-name identities (not 110 independent designs), 34 scoped guidance records, and 40 discovery groups. This update adds 44 identity strings: Genie 2, Skyjack 4, JCB 14 generation variants, Dingli 7, LGMG 6, Sinoboom 11 model/trade names. Existing catalogue rows are preserved. All catalogue production dates, manufacture dates and unverified heights remain null.

Reviewed Library bundles: Skyjack libfile_7cd8edc3921081919136376d52515622; Genie claim checks libfile_478103af644c8191a38b75fb7516f53b; four-brand libfile_7036bb06e22481918abb4c5e1690db94. Locally materialized and reconciled the supplied source reviews; full Skyjack source archive was not downloaded again. Raw source ledgers and source hashes accompany normalized guidance.

Genie checker supports only finite intervals from 97385 and 1272217GT, exact supplied model/family/facility/sequence and historical year bounds 2005–2016. It does not implement open-ended intervals or GS30D disputed older scope. GS30P uses overlap 151487–160599. The example serial outside cover scope is rejected. Output explicitly separates model year from unknown manufacture date. 97385's contradictory example plate is held; its labelled model-year legend remains usable. Other manuals remain guidance, not parser coverage.

Skyjack SJ3013 field variants remain separate, limited to M09281002–M09301244; revision conflict retained. Large RT A202 scope capped at A202999999. ELEVATE Live's reviewed Production Year display derives from in-service/shipped fields and is not manufacture-date authority. SKYCODED controller dates are excluded.

JCB retains RAJ prefix and market-conditional year-field scope, LGMG exact AS/NZS Gen2 plate layouts, and Sinoboom region/serial/All distinctions. Sinoboom typo 0932ME is not a new identity. Dingli's official model selector provides identity/document guidance; the distributor mirror gap remains in the raw ledger and adds no identity or date rule. No universal tenth-character year rule is implemented.

Validation: 47 automated tests passed, including original 22 forklift decoder regressions, malformed/stale response handling, finite serial boundaries, yearless formats, model/facility mismatch, conflicting examples and input-change invalidation. User's local in-app browser confirmed 110 loaded identities, scoped Genie 2016 model year with unknown manufacture date, yearless result, stale-result clearing, Snorkel qualified 2017-03 interpretation and LGMG six-model filter. No push, deployment, production database mutation or security-setting change in this update.


## Six-brand and European source reconciliation — 17 October 2026

174 model/trade-name identities, 54 scoped identification records and 40 discovery groups. All prior 110 model records and sources preserved exactly. First imported the six-brand bundle (libfile_145e74c088c081919d413201f500ace8): 34 identities and 12 records. Then imported the European bundle (libfile_c1759ec96b70819197cf4617dc4828ac; canonical libfile_2e9cde10b638819189e06af540ab118a): 30 identities and eight records; all supplied SHA-256 checks passed. Full research ledgers retain original brand names and manufacturer-versus-mirror provenance; display brands group related names without rebadging historical sources.

BoSS has four exact model/serial batches with exclusive manufacture-date upper bound 2012-11-01 and no lower bound or exact manufacture year. This safety-related notice does not establish upgrade completion, safe condition or compatibility. Aichi retains literal after 779462 wording with unresolved boundary inclusion. Manitou EU S1 scope is not North American merely because its document code contains EN-US. Almac, Manitou, ELS and selected other manuals retain third-party hosting provenance.

AIRO XL17 E / XL20 RTE and PB S151-16 E indexed-only claims remain held outside the catalogue/guidance cards. PB S131-19 E cover/plate versus S131-13 E body discrepancy and raw edition 48/14/1115 are retained. AXCS PS14-50861/50862 overlapping parts ranges and PS1930 subsection mismatch remain unresolved; operations scopes and parts-index scopes are labelled separately, CE prefixes and HB serial gaps preserved. No parser added from these bundles. No manufacture year populated. Holland Lift restart remains an announced plan, not verified completion.

Validation: 50 tests passed, including source-hold, BoSS bound/notice, Aichi boundary, mirror provenance, PB and AXCS overlap regressions. Existing parsers and forklift decoder unchanged in this follow-up. No publication or database/security mutation.


## Zoomlion / Noblelift / XCMG / SANY — 17 October 2026

233 model/trade-name identities and 71 scoped guidance records. Added 59 identities and 17 records from Library bundle libfile_7cc807c40ee08191bd74a20f0408351b after local source-review reconciliation and supplied SHA-256 checks. All previous 174 model records and sources preserved exactly. The raw ledger retains all 28 sources, including restricted lookup routes and unapproved leads.

Zoomlion scope includes ZS1008; common plate guidance is limited to the named electric series. Noblelift uses PDF-cover models, without asserting equivalence to differing North American download labels; New Generation plate part-number conflict is retained. XCMG blank month/year forms are not populated plates; XG0807FA and the unverified XG1930AC dated-photo lead are not promoted. SANY's six explicit brochure alias pairs are identity strings, not six extra independent designs; binding and online timestamps are not manufacture dates. No serial rules, dated ranges or actual-unit dates added.

51 tests passed, including all original forklift and scissor regression tests. Source conflicts and unknown dates remain explicit. No database/security change, push or deployment.
