# Verification log

Updated workflow tests initially failed with 53 identities and old setup source still present. After source merges and generator synchronization, all inventory/retirement tests passed. Instruction tests now inspect the canonical onboarding reference rather than duplicated command prose. Capture-only tests were retired with the removed runtime; text-template/no-tooling/short-router and active-route regressions replace the relevant source assertions. Integration now protects new guide customizations and binary image bytes across two updates. No updater-policy fixes were required.

Review R1 found a retained git-workflow gate still rejecting text-only guides plus a UI-triggered PR checkbox. Added active instruction guards; the focused cleanup suite failed on the old gate, then passed 4/4 after the narrow guide/checkbox correction. Update-engine and installer behavior were unchanged.
