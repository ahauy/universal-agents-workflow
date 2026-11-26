# Slice B — existing validator skill

Date: 2026-11-26. Requirement: REQ-DOWNLOAD-003 / US-DOWNLOAD-003.
Changed source: `.agents/skill-library/engineering/spec-validator/SKILL.md` only.
Output evidence: this report. No validator CLI, package or executable was added.

## Method and limits

Read the complete final skill and walked the prescribed decisions for TC-004
through TC-008 below. These are semantic reviews of agent instructions, not
executed parser tests, an IEEE certification or proof that every future LLM
response will obey them. Scenario variations below are paper inputs; signed-off
feature evidence was not altered to simulate failures. Line references refer to
the final skill, not the feature's requirements.

## Scenario outcomes

| Case | Input variation reviewed | Prescribed decision and evidence | Review outcome |
| --- | --- | --- | --- |
| TC-004 | Complete required files, explicitly confirmed ASM records, unique linked BR/REQ/US items and applicable happy/edge acceptance scenarios | Lines 34–58 resolve and read the four BA evidence files without requiring technical artifacts. Lines 62–81 require every REQ/US to undergo all eight criteria: necessary purpose, unambiguous meaning, completeness without guessing, atomicity, feasibility against constraints, observable verification, consistency with other items/rules and valid traceability. Lines 91–115 require semantic coverage and evidence locations, not merely matching IDs. Only all evidence/criteria passing and no gaps permits PASS (119). Both report and matrix are required (112–115, 129–155). | Decision path is complete; no certification claim. The presence of headings or Given/When/Then alone cannot satisfy it. |
| TC-005 | Independently remove `requirements.md`; make `01-elicitation.md` unreadable; empty `03-domain-model.md`; leave only a title/TODO/template in `04-risk-register.md` | Each file is explicitly required (36–39). Each of missing, unreadable, empty and placeholder-only content is a structural blocker (41–47). Record the exact file/condition, supported checks and BLOCKED checks; no empty-string substitution or inferred content. Any blocker forces overall FAIL (120–123), with both output artifacts recording known/blocked evidence (112–113, 129–155). No handover (130–131). | All four variations force FAIL. Other readable evidence may be inspected without claiming complete validation. |
| TC-006 | Set ASM-DOWNLOAD-002 to pending/no confirmation; separately leave an unrelated implementation task checkbox unchecked | Lines 49–55 inspect ASM records plus their actual confirmation context. Pending, unknown and conflicting ASM status blocks, reporting that ASM ID. Checked boxes alone do not prove confirmation. An unrelated unchecked task box is explicitly not an assumption. Lines 120–123 force FAIL for unresolved ASM; the checkbox alone creates no inferred blocker. | ASM and task status are distinguished semantically. No blanket unchecked-checkbox heuristic. |
| TC-007 | Remove acceptance scenarios from US-DOWNLOAD-003; separately leave REQ-DOWNLOAD-003 without applicable story coverage, including a story which names the REQ but does not test its behavior | Lines 102–110 require substantive scenarios with conditions, action and observable outcome for every US, and applicable coverage for every REQ. The review must assess happy paths/domain edges or record inapplicability. Missing scenarios and uncovered requirements are explicit blockers, reported by REQ/US ID. Merely listing a REQ ID is insufficient. Lines 120–123 forbid PASS or accepted-gap override for either omission. | Missing acceptance and uncovered REQ both force FAIL with specific IDs. Scenario labels cannot replace meaningful outcomes. |
| TC-008 | Duplicate REQ-DOWNLOAD-003 definitions (also consider duplicate BR/US definitions); cite absent BR-DOWNLOAD-999 in a REQ Derived from, absent REQ-DOWNLOAD-999 in a US Traces to, or an absent US in a referenced chain | Lines 91–100 inventory real definitions, distinguish references from definitions, require unique IDs per item type and report duplicate locations. Every referenced BR/REQ/US must exist in its expected role; dangling/wrong-type links report source/target IDs. Missing Derived from or Traces to also fails Traceable (74). Lines 102–110 reject broken chains, and 120–123 force FAIL regardless of override. | All duplicate/dangling/missing-link variations force FAIL; ordinary cross-file references are allowed. |

## Additional contract checks

- A user requesting an override for any structural blocker still receives FAIL
  (120–123). Specific explicit acceptance of a non-blocking qualitative gap is
  recorded as PASS WITH ACCEPTED GAPS, with criterion/ID/reason, never clean PASS
  (124–127). Silence or general approval is insufficient.
- The validator never patches source evidence; signed-off inputs stay immutable
  and findings return for versioned revision (57–58, 130–131).
- Scope ambiguity requires resolving the intended feature rather than inspecting
  an unrelated directory (32–33). Missing implementation spec/plan/tasks does not
  block this pre-baseline review (41–42).
- A future test-case assignment may remain pending at this BA stage, but missing
  acceptance criteria or their semantic coverage may not (114–115).

## Self-check

Security: no runtime, service access, executable certification or new dependency.
Spec fidelity: all validation-boundary steps and TC-004..TC-008 have explicit
instruction paths. Reliability: missing inputs cannot be silently substituted;
blocked checks remain visible; failures produce reports and stop handover.
No Critical finding identified in this scoped semantic review.
