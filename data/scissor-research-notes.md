# Scissor Lift Coverage Research
Verified 2026-10-17. This is a discovery/source ledger for Forklift IQ, not a production-ready specification import.

## Implementation import gate
This is a non-exhaustive ledger of 40 brand/group records, not 40 independent manufacturers. JSON rows live under the `rows` key. Import these as source-catalog discovery records only; do not manufacture model specifications or production-year ranges from this file.

Priority holds: GMG 1930i has reversed/conflicting platform versus working-height labels; JLG RT3369 heights disagree between official sources; XCMG Canada contains unrelated copy/units; Sunward mixes model headings; PB locale details differ. The detailed holds below remain unresolved. For UpRight X26N, the catalog serial boundary 51119 conflicts with PDF OCR 5119; visually verify before importing any serial boundary. Historical manufacturer documents sometimes survive on third-party hosts; retain provenance and do not label those hosts official.

## Recommended structure
Equipment category → manufacturer/brand → exact model → regional/generation/configuration-specific specification records → manuals with serial/PVC applicability.

Start model ingestion with Genie, JLG and Skyjack, whose official manuals have explicit applicability. Expand by source completeness, retaining legacy identities and related brand names. The coverage ledger is deliberately broad; a row does not prove every model is currently manufactured or that every branded machine is made in-house.

## Model-level schema
- manufacturer_entity_id; brand_id; exact_model; family; documented_aliases; category; generation; region; standard; propulsion
- platform_height and working_height separately, each retaining published value/unit plus indoor/outdoor/occupancy condition
- rated_capacity; extension_deck_capacity; dimensions with rail position; machine_weight with configuration
- serial_applicability_raw; validated serial bounds; JLG PVC where supplied
- model_year; manufacture_date; documented_launch_date; production_start_year; production_end_year, all independently sourced and nullable
- evidence URL, title, document/part number, revision, document date, page/section, retrieval date, field-level claim, conflict/verification state

## Year evidence rules
A manual's publication or revision date is not the machine's year. A launch establishes a launch event, not a complete production interval. Catalog presence does not establish ongoing production. Serial applicability is not a year mapping. Treat serial numbers as identifiers, not numeric ranges across incompatible prefixes. Match plate/manufacturer records for exact machine years.

Genie GS-84/GS-90 manual 1272222GT printed page iv documents model-year characters through August 31, 2016 and a changed format without those characters from September 1, 2016. This is scoped evidence, not a universal Genie decoder.
https://manuals.genielift.com/Parts%20And%20Service%20Manuals/data/Service/Scissors/1272222.pdf

BoSS explicitly identifies X2 YMG21000–21228, X3 YMG11001–11918, X3X YMG31001–31238 and YMG32001–32158 as affected batches manufactured before November 2012. This only establishes a bounded date relationship and points to an official notice; it is not a year-decoding algorithm or a safety-clearance determination.
https://www.bossaccesstowers.com/news/x-series-update

## Verified conflicts / import holds
- JLG RT3369 product page reports 32 ft 10 in platform height; official specification PDF reports 32 ft 8 in / 10 m. Do not pick a value until market/revision/configuration is reconciled.
  https://www.jlg.com/equipment/scissor-lifts/engine-powered-rough-terrain/rt-series/rt3369
  https://sitecore.jlg.com/dfsmedia/e4042b10c9ce4595b4cc059f1299f079/140682-source
- GMG 1930i headline says 19 ft platform height; its detailed table labels 19 ft as working height and 25 ft as platform height. Hold numeric import pending an applicable manual/specification confirmation.
  https://gogmg.com/1930i/
- XCMG Canada XG1930AC page contains apparent unrelated telescoping-boom/highway copy and a rated-load unit label of hp. Use global manufacturer product page for identity and review each specification independently.
  https://xcmgca.com/product/scissor-lift/xg1930ac/
  https://www.xcmgglobal.com/product/scissor-lifts/xg1930ac-ansi/
- Sunward Canadian SWSL3346DC page also uses SWSL1212DC in the specification heading. Do not infer cross-market equivalence from mixed headings alone.
  https://sunwardca.com/product/swsl-1212dc/
- PB English/German S171-16ES pages differ in populated detail fields. Do not fill regional blanks solely by copying another locale without recording it.
  https://pblift.de/en/productdetails/pb-s171-16es
  https://pblift.de/produktdetails/pb-s171-16es

## Height normalization
Genie explicitly defines working height with +6 ft for US and +2 m for metric. Preserve published unit-specific working heights instead of converting one into the other. Never infer height from model digits.
https://www.genielift.com/docs/default-source/product-specifications/slab-scissor-lifts-%28ansi%29-or-electric-and-bi-energy-lifts-%28ce%29/en-sg/2025/2025-spec-sheet-gs-1432m-gs-1932m---ansi-%28sea%29.pdf?sfvrsn=839e43c1_1

## Entity controls
Hy-Brid / Custom Equipment / AXCS is one related lineage, not three independent OEM counts. AXCS documents gradual rebranding and ASKO majority ownership alongside ELS; do not merge ELS model specifications into AXCS without exact model evidence.
https://axcs.com/news/what-is-axcs
https://axcs.com/news/eric-liner-introduces-axcs-equipment

Magni, GMG and Ballymore official catalogs verify brands/models but this pass did not establish each scissor's underlying OEM. Do not invent a rebrand relationship from visual similarity or matching dimensions.

Normet underground Utilift scissor lifters merit a separate specialized subcategory, not automatic equivalence to ordinary slab MEWPs.

## Research-only exclusions / unresolved leads
- Niftylift: official catalog inspected was boom-focused; no primary-source scissor model verified in this pass.
- Platform Basket HERON: official document labels vertical mast; excluded from scissor seeds.
- Socage Raptor: official catalog labels spider boom lifts; excluded from scissor seeds.
- Everun, Runshare, ATN: scissor primary evidence or exact identity not fully verified in this pass; retain as research candidates only, not nonexistent manufacturers.
- No auction/dealer manufacture-year claims were promoted to manufacturer production ranges.
- No safety suitability, parts compatibility, repair procedures or unit-specific clearance was inferred.
