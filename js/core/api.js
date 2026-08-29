/**
 * 山熏 · 演示版数据层（公开仓库）
 * 仅 localStorage + 静态 JSON，无远程 API
 */
(function(global){
  const cfg = () => global.SX_CONFIG || { pageSize:50 };

  function paginate(items, { page=1, limit=50 }={}){
    const total = items.length;
    const start = (page-1)*limit;
    return { items: items.slice(start, start+limit), total, page, limit, pages: Math.ceil(total/limit)||1 };
  }

  function filterBatches(items, { q='', stage='', status='', from='', to='' }={}){
    return items.filter(b=>{
      if(q){
        const s = q.toLowerCase();
        if(!(b.id||'').toLowerCase().includes(s) && !(b.sup||'').toLowerCase().includes(s)) return false;
      }
      if(stage && b.stage!==stage) return false;
      if(status && b.st!==status) return false;
      if(from && b.inD && b.inD < from) return false;
      if(to && b.inD && b.inD > to) return false;
      return true;
    });
  }

  const BatchAPI = {
    async list(params={}){
      const c = cfg();
      const all = global.B || [];
      const filtered = filterBatches(all, params);
      return paginate(filtered, { page: params.page||1, limit: params.limit||c.pageSize });
    },

    async get(id){
      return (global.B||[]).find(b=>b.id===id) || null;
    },

    async loadAll(){
      try{
        const cached = localStorage.getItem('sx_batches');
        if(cached){
          const parsed = JSON.parse(cached);
          if(Array.isArray(parsed) && parsed.length){
            global.B = parsed;
            return global.B;
          }
        }
      }catch(e){}
      const c = cfg();
      const res = await fetch(c.demoData.batches);
      if(!res.ok) throw new Error('无法加载演示批次数据');
      global.B = await res.json();
      return global.B;
    },

    async save(batch){
      const idx = (global.B||[]).findIndex(b=>b.id===batch.id);
      if(idx>=0) global.B[idx]=batch; else global.B.push(batch);
      try{ localStorage.setItem('sx_batches', JSON.stringify(global.B)); }catch(e){}
      return batch;
    },

    saveAll(){
      try{ localStorage.setItem('sx_batches', JSON.stringify(global.B||[])); }catch(e){}
    },
  };

  const ReadingAPI = {
    async list(params={}){
      const c = cfg();
      let items = global.R || [];
      if(params.from) items = items.filter(r=>r.d >= params.from);
      if(params.to) items = items.filter(r=>r.d <= params.to);
      return paginate(items, { page: params.page||1, limit: params.limit||c.pageSize });
    },
  };

  const LedgerAPI = {
    async list(type, params={}){
      const c = cfg();
      const items = (global.LEDGER_DEMO||{})[type] || [];
      return paginate(items, { page: params.page||1, limit: params.limit||c.pageSize });
    },
  };

  const AnomalyAPI = {
    async list(params={}){
      const c = cfg();
      let items = global.ANOM || [];
      if(params.handled==='0') items = items.filter(a=>!a.handled);
      if(params.handled==='1') items = items.filter(a=>a.handled);
      return paginate(items, { page: params.page||1, limit: params.limit||c.pageSize });
    },
  };

  global.SX_API = { BatchAPI, ReadingAPI, LedgerAPI, AnomalyAPI, paginate };
})(window);
