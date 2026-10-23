# Mesenchymal Drift (MD) scoring: research implementation status

## Status

- Implementation status: isolated research primitive added on branch `research/md-scoring-engine`.
- Validation status: **NOT VALIDATED against the 2025 Cell paper or GEO data**.
- Production status: no production database writes, SQL, migrations, permission changes, merges, or deployments performed.
- This module must not be used to generate clinical, diagnostic, prognostic, or treatment claims.

## Files

- `lib/mdScoring.ts`: deterministic matched-control gene-set scoring primitive.
- `scripts/mdScoring.test.ts`: unit-test source for basic invariants and deterministic behavior.

## Method boundary

The current function computes the mean of the supplied signature genes minus the mean of a deterministic set of expression-bin-matched control genes. Input must already be normalized expression values on a consistent scale. It is a generic research primitive; it is not asserted to be an exact implementation of Seurat `AddModuleScore`, nor of the MD scoring method in Lu et al. (Cell, 2025).

The exact signature, gene identifiers, expression preprocessing, control-gene selection, and comparison protocol must be checked against the paper's methods/supplement and reproducible source data before the result can be labeled an MD score.

## Required validation before product integration

1. Obtain and version the exact MD signature from an authoritative paper/supplement/source.
2. Download and checksum GEO GSE297233 count matrix and sample metadata.
3. Confirm sample IDs, treatment labels, and replicate structure from GEO metadata.
4. Implement the paper-consistent normalization and scoring method; document any deviation.
5. Run tests locally and compare group-level direction/effect sizes with the paper or author-provided analysis.
6. Independently assess GSE297234 single-cell results, separating within-cell-type expression changes from cell-composition changes.
7. Record environment, package versions, input checksums, parameters, missing genes, outputs, and discrepancies.
8. Only after review, propose API integration in a separate change. Production integration requires separate explicit approval.

## Known limitations

- The module does not load GEO data or perform normalization.
- It does not calculate statistical significance, confidence intervals, survival associations, or causal effects.
- It does not model cell-type composition.
- The test source has been committed but **has not been executed in this session**.
- No GEO matrix was downloaded or analyzed in this session.
