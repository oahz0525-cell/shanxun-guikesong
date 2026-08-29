/**
 * 山熏 · 应用启动
 */
async function boot() {
  loadAuth();
  updateAuthUI();
  try {
    const rr = await fetch('data/demo/readings.json');
    if (rr.ok) {
      window.R = await rr.json();
      R.forEach(r => { r.src = r.src || 'manual'; });
      if (typeof buildAnom === 'function') buildAnom();
    }
    await SX_API.BatchAPI.loadAll();
    if (TraceAPI.loadDemoRecords) await TraceAPI.loadDemoRecords();
    await ensureAllTraceRecords();
  } catch (e) {
    console.error('启动失败', e);
    toast('数据加载失败', '请刷新页面重试', 1);
  }
  go('today');
  renderAll();
}
