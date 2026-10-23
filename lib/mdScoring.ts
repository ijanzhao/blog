/**
 * Matched-control gene-set scoring primitive.
 *
 * IMPORTANT:
 * - This is a deterministic, testable research primitive, NOT a reproduction of
 *   the 2025 Cell paper's MD implementation.
 * - Do not label output as a validated MD score until the exact paper signature,
 *   preprocessing, control selection, and GEO benchmark have been verified.
 * - Input values must already be normalized expression values on a consistent scale.
 */

export type ExpressionMatrix = Record<string, number[]>;

export interface MatchedControlScoreOptions {
  bins?: number;
  controlsPerSignatureGene?: number;
  seed?: number;
}

export interface MatchedControlScoreResult {
  method: 'matched_control_module_score_v0.1';
  sampleScores: number[];
  signatureGenesUsed: string[];
  controlGenesUsed: string[];
  missingSignatureGenes: string[];
  parameters: Required<MatchedControlScoreOptions>;
}

function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function hashSeed(seed: number, text: string): number {
  let h = seed >>> 0;
  for (let i = 0; i < text.length; i += 1) {
    h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const result = [...items];
  let state = seed >>> 0;
  for (let i = result.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Computes a sample-wise signature mean minus a deterministic, expression-bin-
 * matched control mean. This is an Ijan research candidate, not a claim of exact
 * equivalence to Seurat AddModuleScore or the source paper.
 */
export function scoreMatchedControlModule(
  expression: ExpressionMatrix,
  signatureGenes: string[],
  options: MatchedControlScoreOptions = {},
): MatchedControlScoreResult {
  const parameters = {
    bins: options.bins ?? 24,
    controlsPerSignatureGene: options.controlsPerSignatureGene ?? 25,
    seed: options.seed ?? 20251016,
  };

  if (!Number.isInteger(parameters.bins) || parameters.bins < 2) {
    throw new Error('bins must be an integer >= 2');
  }
  if (!Number.isInteger(parameters.controlsPerSignatureGene) || parameters.controlsPerSignatureGene < 1) {
    throw new Error('controlsPerSignatureGene must be an integer >= 1');
  }

  const allGenes = Object.keys(expression).sort();
  if (allGenes.length === 0) throw new Error('expression matrix is empty');

  const sampleCount = expression[allGenes[0]].length;
  if (sampleCount === 0) throw new Error('expression matrix has no samples');

  for (const gene of allGenes) {
    const values = expression[gene];
    if (values.length !== sampleCount) throw new Error(`inconsistent sample count for gene: ${gene}`);
    if (values.some((v) => !Number.isFinite(v))) throw new Error(`non-finite expression value for gene: ${gene}`);
  }

  const signatureSet = new Set(signatureGenes);
  // Array.from avoids Set spread syntax that can fail under lower TS targets.
  const uniqueSignatureGenes = Array.from(signatureSet);
  const signatureGenesUsed = uniqueSignatureGenes.filter((gene) => gene in expression).sort();
  const missingSignatureGenes = uniqueSignatureGenes.filter((gene) => !(gene in expression)).sort();
  if (signatureGenesUsed.length === 0) throw new Error('none of the signature genes are present in expression matrix');

  const ranked = allGenes
    .map((gene) => ({ gene, avg: mean(expression[gene]) }))
    .sort((a, b) => a.avg - b.avg || a.gene.localeCompare(b.gene));

  const geneBin = new Map<string, number>();
  ranked.forEach(({ gene }, index) => {
    const bin = Math.min(parameters.bins - 1, Math.floor((index / ranked.length) * parameters.bins));
    geneBin.set(gene, bin);
  });

  const controls = new Set<string>();
  for (const gene of signatureGenesUsed) {
    const bin = geneBin.get(gene)!;
    const candidates = allGenes.filter((candidate) =>
      !signatureSet.has(candidate) && geneBin.get(candidate) === bin,
    );
    const selected = seededShuffle(candidates, hashSeed(parameters.seed, gene))
      .slice(0, parameters.controlsPerSignatureGene);
    for (const control of selected) controls.add(control);
  }

  if (controls.size === 0) {
    throw new Error('no matched control genes available; increase matrix size or adjust bins');
  }

  const controlGenes = Array.from(controls);
  const signatureMeans = Array.from({ length: sampleCount }, (_, sample) =>
    mean(signatureGenesUsed.map((gene) => expression[gene][sample])),
  );
  const controlMeans = Array.from({ length: sampleCount }, (_, sample) =>
    mean(controlGenes.map((gene) => expression[gene][sample])),
  );

  return {
    method: 'matched_control_module_score_v0.1',
    sampleScores: signatureMeans.map((value, index) => value - controlMeans[index]),
    signatureGenesUsed,
    controlGenesUsed: controlGenes.sort(),
    missingSignatureGenes,
    parameters,
  };
}
