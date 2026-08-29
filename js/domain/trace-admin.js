/**
 * 山熏 · 厂内端溯源桥接（批次 → TraceAPI / 二维码）
 */
function genTraceToken(batchId) {
  return TraceAPI.batchToken(batchId);
}

function renderQrToElement(sel, url, size) {
  const box = typeof sel === 'string' ? $(sel) : sel;
  if (!box) return;
  box.innerHTML = '';
  if (typeof QRCode !== 'undefined') {
    QRCode.toCanvas(url, { width: size || 140, margin: 2, color: { dark: '#2A2418', light: '#FFFFFF' } }, (err, canvas) => {
      if (!err) box.appendChild(canvas);
      else box.textContent = '二维码生成失败';
    });
  } else box.textContent = 'QRCode 库未加载';
}

function buildTraceRecord(b, registrar, token) {
  const t = token || b.traceToken || genTraceToken(b.id), p = b.purchase || {};
  const events = (b.events || []).slice();
  const stageRank = { buy: 0, rawstock: 1, prep: 2, dry: 3, smoke: 4, qc: 5, stock: 6, ship: 7 };
  const rank = stageRank[b.stage] ?? 0;
  const pubMap = [
    { t: '原料', d: `贵州散养土猪后腿 · ${b.sup || '—'} · 验收合格入库`, min: 1 },
    { t: '腌制', d: '传统调料入缸腌制，锁住鲜香', min: 2 },
    { t: '晾挂', d: `清镇晾挂车间 · 自然风干 ${b.days || '—'} 天`, min: 3 },
    { t: '熏制', d: '柴火熏制，山熏独有烟熏风味', min: 4 },
    { t: '检验', d: '成品检验合格，准予入库', min: 5 },
    { t: '封箱溯源', d: `成品入库 ${b.outKg || b.inKg} 斤 · ${b.stockRoom || '成品冷藏'} · ${b.stockedAt || todayStr()}`, min: 6 },
    { t: '到你手中', d: b.out ? `${b.out} 出库 · ${b.ch || '—'}渠道` : '等待出库送达', min: 7 },
  ];
  const publicStages = pubMap.map(s => ({ t: s.t, d: s.d, ok: rank >= s.min ? 1 : 0 }));
  return {
    batchId: b.id, product: '柴火腊肉 · 土猪后腿', sup: b.sup, inKg: b.inKg, outKg: b.outKg,
    channel: b.ch, shippedAt: b.out, stockedAt: b.stockedAt || null, stockRoom: b.stockRoom || null,
    token: t, publicStages, events,
    internal: {
      pr: (b.pr || '—') + ' 元/斤', buyer: p.buyer || '—', invoice: b.invoice || p.invoice || '—',
      anomaly: b.ab || 0, readings: b.real ? 64 : 0, registrar,
    },
  };
}

function getTraceTokenForBatch(batchId) {
  try {
    const reg = JSON.parse(localStorage.getItem('sx_trace') || '{}');
    return reg['_batch_' + batchId] || null;
  } catch { return null; }
}

async function ensureAllTraceRecords() {
  await TraceAPI.loadDemoRecords();
  TraceAPI.seedDemo();
  let changed = false;
  B.forEach(b => {
    if (b.stage !== 'stock' && b.stage !== 'ship') return;
    const token = TraceAPI.batchToken(b.id);
    if (b.traceToken !== token) { b.traceToken = token; changed = true; }
    const demo = TraceAPI.DEMO_BY_TOKEN[token];
    if (demo) {
      if (!b.stockedAt) { b.stockedAt = demo.stockedAt; changed = true; }
      if (!b.stockRoom) { b.stockRoom = demo.stockRoom; changed = true; }
      TraceAPI.saveRecord({ ...demo, batchId: b.id, token });
    } else {
      if (!b.stockedAt) { b.stockedAt = b.inD; changed = true; }
      if (!b.stockRoom) { b.stockRoom = '成品冷藏①'; changed = true; }
      TraceAPI.saveRecord(buildTraceRecord(b, '石红英', token));
    }
  });
  if (changed) saveBatches();
}

function showTraceQr(token, kind) {
  const url = TraceAPI.getTraceUrl(token);
  $('#trace-qr-url').textContent = url;
  $('#trace-qr-title').textContent = kind === 'stock' ? '成品入库 · 包装溯源码已生成' : '溯源信息已更新';
  $('#trace-qr-desc').textContent = kind === 'stock'
    ? '请打印或粘贴于外包装。扫码后登录即可查看本产品溯源故事；厂内账号自动显示完整工艺记录。'
    : '批次出库后溯源快照已更新，包装上的二维码链接不变。';
  renderQrToElement('#trace-qr-canvas', url, 180);
  $('#trace-qr-mask').classList.add('on');
}

function closeTraceQr() { $('#trace-qr-mask')?.classList.remove('on'); }
function closeTraceQrMask(e) { if (e.target.id === 'trace-qr-mask') closeTraceQr(); }

window.genTraceToken = genTraceToken;
window.renderQrToElement = renderQrToElement;
window.buildTraceRecord = buildTraceRecord;
window.getTraceTokenForBatch = getTraceTokenForBatch;
window.ensureAllTraceRecords = ensureAllTraceRecords;
window.showTraceQr = showTraceQr;
window.closeTraceQr = closeTraceQr;
window.closeTraceQrMask = closeTraceQrMask;
