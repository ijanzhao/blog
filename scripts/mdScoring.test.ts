import assert from 'node:assert/strict';
import { scoreMatchedControlModule } from '../lib/mdScoring';

const expression = {
  S1: [8, 7, 6],
  S2: [7, 6, 5],
  C1: [1, 2, 1],
  C2: [2, 1, 2],
  G1: [1, 1, 1],
  G2: [2, 2, 2],
  G3: [3, 3, 3],
  G4: [4, 4, 4],
  G5: [5, 5, 5],
  G6: [6, 6, 6],
  G7: [7, 7, 7],
  G8: [8, 8, 8],
  G9: [9, 9, 9],
  G10: [10, 10, 10],
  G11: [11, 11, 11],
  G12: [12, 12, 12],
};

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log('PASS', name); }
  catch (error) { failed += 1; console.error('FAIL', name, error); }
}

test('returns one finite score per sample', () => {
  const result = scoreMatchedControlModule(expression, ['S1', 'S2'], { bins: 2, controlsPerSignatureGene: 2 });
  assert.equal(result.sampleScores.length, 3);
  assert.ok(result.sampleScores.every(Number.isFinite));
  assert.equal(result.method, 'matched_control_module_score_v0.1');
});

test('reports signature genes absent from input', () => {
  const result = scoreMatchedControlModule(expression, ['S1', 'NOT_IN_MATRIX'], { bins: 2, controlsPerSignatureGene: 2 });
  assert.deepEqual(result.missingSignatureGenes, ['NOT_IN_MATRIX']);
  assert.deepEqual(result.signatureGenesUsed, ['S1']);
});

test('deterministic for identical input and parameters', () => {
  const a = scoreMatchedControlModule(expression, ['S1', 'S2'], { bins: 2, controlsPerSignatureGene: 2, seed: 7 });
  const b = scoreMatchedControlModule(expression, ['S1', 'S2'], { bins: 2, controlsPerSignatureGene: 2, seed: 7 });
  assert.deepEqual(a, b);
});

test('rejects inconsistent sample counts', () => {
  assert.throws(() => scoreMatchedControlModule({ A: [1, 2], B: [1] }, ['A'], { bins: 2 }));
});

test('rejects non-finite expression values', () => {
  assert.throws(() => scoreMatchedControlModule({ A: [1, Number.NaN], B: [2, 3], C: [4, 5] }, ['A'], { bins: 2 }));
});

test('rejects a signature with no genes present', () => {
  assert.throws(() => scoreMatchedControlModule(expression, ['UNKNOWN'], { bins: 2 }));
});

if (failed) process.exit(1);
console.log('ALL PASS');
