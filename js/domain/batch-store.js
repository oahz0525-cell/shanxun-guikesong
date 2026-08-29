/**
 * 山熏 · 批次数据存储与基础工具
 */
window.B = window.B || [];

function saveBatches() {
  if (window.SX_API) SX_API.BatchAPI.saveAll();
  else try { localStorage.setItem('sx_batches', JSON.stringify(B)); } catch (e) {}
}

function todayStr() {
  const d = new Date(), mo = d.getMonth() + 1, dy = d.getDate();
  return mo + '/' + dy;
}

function genBatchId() {
  const d = new Date(), mo = d.getMonth() + 1, dy = d.getDate();
  return `QZ-${String(mo).padStart(2, '0')}${String(dy).padStart(2, '0')}-${String(B.length + 1).padStart(2, '0')}`;
}

function batchById(id) { return B.find(x => x.id === id); }

function stageIdx(s) { return STAGE_ORDER.indexOf(s); }

function yl(b) { return b.outKg ? b.outKg / b.inKg * 100 : null; }

function dotc(s) { return s === '晾挂中' ? 'run' : s === '腌制中' ? 'cure' : 'done'; }

window.saveBatches = saveBatches;
window.todayStr = todayStr;
window.genBatchId = genBatchId;
window.batchById = batchById;
window.stageIdx = stageIdx;
window.yl = yl;
window.dotc = dotc;
