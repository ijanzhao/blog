import assert from 'node:assert/strict'
import { composeAnswer, evaluateFormula } from '../lib/advisorDose'
import type { HerbDoseRow, SpeciesLike } from '../lib/advisorDose'

const sp = (name_zh: string, description: string, name_latin = 'X y'): SpeciesLike => ({ name_zh, name_latin, description })
const species: SpeciesLike[] = [
  sp('白术', '【用量】5~15克。'),
  sp('黄芩', '【用量】3~10克。'),
  sp('杏仁', '【用量】3~10克，宜后下。'),
  sp('升麻', '【用量】3~10克。'),
  sp('柴胡', '【用量】3~10克。'),
  sp('桔梗', '【用量】3~10克。'),
  sp('白及', '【用法用量】内服：煎汤，6~15g；研末吞服3~6g。外用：适量，研末调敷。【平台备注】x'),
  sp('铁棒锤', '【用量】1~3克。', 'Aconitum pendulum'),
  sp('土白及', '【来源】《太白山本草志》p308。【用量】3~10克。'),
]
const hr = (name_zh: string, min: number, max: number, aliases: string[] = []): HerbDoseRow => ({
  name_zh, name_aliases: aliases, dose_min: min, dose_max: max, source: '中国药典', source_edition: '2020版',
})
const herbs: HerbDoseRow[] = [
  hr('生黄芪', 9, 30, ['黄芪']), hr('黄芩', 3, 10), hr('防风', 5, 10), hr('陈皮', 3, 10),
  hr('浙贝母', 5, 10), hr('百部', 3, 9), hr('白芥子', 3, 9, ['芥子']), hr('茯苓', 10, 15),
  hr('甘草', 2, 10), hr('白术', 6, 12), hr('苦杏仁', 5, 10, ['杏仁']),
]
const FORMULA =
  '生黄芪15克 白术15克 黄芩15克 防风15克 升麻10克 柴胡10克 陈皮10克 桔梗10克 浙贝母10克 杏仁10克 百部10克 白及10克 白芥子10克 茯苓15克 甘草10克'

let failed = 0
const test = (name: string, fn: () => void) => {
  try { fn(); console.log('PASS', name) } catch (e) { failed++; console.error('FAIL', name); console.error(e) }
}
const run = (q: string) => evaluateFormula(q, species, herbs)

test('15味：✓10 ⚠5 ○0', () => {
  const r = run(FORMULA)!
  assert.equal(r.lines.length, 15)
  assert.ok(r.block.startsWith('【剂量核对】（共15味：✓10 ⚠5 ○0）'))
  const warn = r.lines.filter((l) => l.flag === '⚠').map((l) => l.name).sort()
  assert.deepEqual(warn, ['白术', '白芥子', '百部', '防风', '黄芩'].sort())
})
test('白术双来源逐字（出处未注明 → 库内物种记录）', () => {
  const r = run(FORMULA)!
  assert.ok(r.lines.some((l) => l.text === '⚠ 白术 15克（库内物种记录 5~15g，范围内；中国药典2020版 6~12g，超出上限）'))
})
test('白及真实标签【用法用量】可解析为 6~15 → ✓', () => {
  const l = run(FORMULA)!.lines.find((x) => x.name === '白及')!
  assert.equal(l.flag, '✓')
  assert.ok(l.text.includes('6~15g'))
})
test('描述含《太白山本草志》才标该来源', () => {
  const l = run('土白及5克 白术8克 甘草5克')!.lines[0]
  assert.ok(l.text.includes('《太白山本草志》'))
})
test('杏仁合并苦杏仁，两处均范围内', () => {
  const l = run(FORMULA)!.lines.find((x) => x.name === '杏仁')!
  assert.equal(l.flag, '✓')
  assert.ok(l.text.includes('库内物种记录') && l.text.includes('中国药典2020版 5~10g'))
})
test('连跑三次，剂量块逐字相同', () => {
  const a = run(FORMULA)!.block, b = run(FORMULA)!.block, c = run(FORMULA)!.block
  assert.equal(a, b); assert.equal(b, c)
})
test('南杏仁不得匹配杏仁', () => {
  const l = run('南杏仁10克 白术15克 甘草10克')!.lines[0]
  assert.equal(l.flag, '○')
})
test('请核对生黄芪15克 → ✓', () => {
  const l = run('请核对生黄芪15克 白术15克 甘草10克')!.lines[0]
  assert.equal(l.name, '生黄芪'); assert.equal(l.flag, '✓')
})
test('别名 芥子 → 白芥子', () => {
  const l = run('芥子5克 甘草10克 白术8克')!.lines[0]
  assert.ok(l.text.startsWith('✓ 白芥子 5克'))
})
test('重复药名只输出一行', () => {
  const r = run('甘草10克 甘草5克 白术15克 黄芩10克')!
  assert.equal(r.lines.filter((l) => l.name === '甘草').length, 1)
  assert.ok(r.block.includes('重复'))
})
test('受限属种不做常规判定', () => {
  const l = run('铁棒锤1克 白术15克 甘草10克')!.lines[0]
  assert.equal(l.flag, '○'); assert.ok(l.text.includes('不提供剂量信息'))
})
test('低于下限 → ⚠', () => {
  const l = run('甘草1克 白术15克 黄芩5克')!.lines[0]
  assert.equal(l.flag, '⚠'); assert.ok(l.text.includes('低于下限'))
})
test('钱、两不识别；少于3味不触发', () => {
  assert.equal(run('白术3钱 黄芩3钱 甘草2钱'), null)
  assert.equal(run('白术15克'), null)
})
test('表格式输入「药物 剂量 生黄芪 15 g」', () => {
  const r = run('药物 剂量 生黄芪 15 g 白术 15 g 黄芩 15 g')!
  assert.equal(r.lines.length, 3)
})

test('固定段由服务端输出，且不含指令原文', () => {
  const out = composeAnswer('【剂量核对】x', '【配伍禁忌】写"未检查"，不得写"无禁忌"。\n【合规与安全提示】白及：兰科。')
  assert.ok(out.includes('【配伍禁忌】数据库没有十八反、十九畏数据，未检查。'))
  assert.ok(!out.includes('不得写'))
  assert.ok(out.includes('白及：兰科。'))
})

test('固定段由服务端输出，且不含指令原文', () => {
  const out = composeAnswer('【剂量核对】x', '【配伍禁忌】写"未检查"，不得写"无禁忌"。\n【合规与安全提示】白及：兰科。')
  assert.ok(out.includes('【配伍禁忌】数据库没有十八反、十九畏数据，未检查。'))
  assert.ok(!out.includes('不得写'))
  assert.ok(out.includes('白及：兰科。'))
})

if (failed) { console.error(`${failed} test(s) failed`); process.exit(1) }
console.log('ALL PASS')
