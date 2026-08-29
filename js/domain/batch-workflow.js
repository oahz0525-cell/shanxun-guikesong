/**
 * 山熏 · 批次流转与登记
 */
function registrarRowHtml() {
  const name = AUTH?.name || '—';
  return `<div class="registrar-row"><span class="registrar-label">登记人</span>
    <input class="registrar-input" type="text" value="${name}" readonly tabindex="-1"></div>`;
}

function logBatchEvent(b, title, detail, registrar) {
  b.events = b.events || [];
  b.events.push({ time: todayStr(), title, detail, registrar: registrar || AUTH?.name || '—' });
}

function getStageNextOptions(b) {
  if (!b) return [];
  const opts = [];
  if (b.stage === 'rawstock' && (b.buySub === 'passed' || !b.buySub)) opts.push({ to: 'prep', label: '原料库 → 预处理（腌制）' });
  if (b.stage === 'prep') opts.push({ to: 'dry', label: '预处理 → 晾挂' });
  if (b.stage === 'dry' && b.dryReady) opts.push({ to: 'smoke', label: '晾挂 → 熏制' });
  if (b.stage === 'smoke') opts.push({ to: 'qc', label: '熏制 → 成品检验' });
  return opts;
}

function updateStageOptions() {
  const id = $('#a-bid')?.value, b = batchById(id), sel = $('#a-stage');
  if (!sel || !b) return;
  const opts = getStageNextOptions(b);
  sel.innerHTML = opts.length ? opts.map(o => `<option value="${o.to}">${o.label}</option>`).join('') : '<option value="">无可转环节</option>';
}

function applyStageTransition(b, to, registrar, note) {
  const labels = { prep: '腌制中', dry: '晾挂中', smoke: '熏制中', qc: '检验中' };
  const titles = { prep: '转入预处理', dry: '转入晾挂', smoke: '转入熏制', qc: '转入成品检验' };
  if (b.stage === 'rawstock' && to === 'prep') { b.stage = 'prep'; b.st = labels.prep; }
  else if (b.stage === 'prep' && to === 'dry') { b.stage = 'dry'; b.st = labels.dry; b.dryReady = 0; }
  else if (b.stage === 'dry' && to === 'smoke') {
    if (!b.dryReady) { toast('晾挂未满期', '暂不可转熏制', 1); return false; }
    b.stage = 'smoke'; b.st = labels.smoke; b.dryReady = 0;
  } else if (b.stage === 'smoke' && to === 'qc') { b.stage = 'qc'; b.st = labels.qc; }
  else { toast('无效流转', '请选择有效目标环节', 1); return false; }
  logBatchEvent(b, titles[to] || '状态变更', note || STAGE_LABEL[to] || to, registrar);
  return true;
}

window.registrarRowHtml = registrarRowHtml;
window.logBatchEvent = logBatchEvent;
window.getStageNextOptions = getStageNextOptions;
window.updateStageOptions = updateStageOptions;
window.applyStageTransition = applyStageTransition;
