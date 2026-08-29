/**
 * 山熏 · 溯源 API（演示 / 可接服务端）
 * 演示：localStorage 模拟；生产：TraceAPI.useRemote = true 并配置 endpoint
 */
(function(global){
  const TRACE_SEED_VER='4';
  /** 各环节负责老师傅（演示占位图 + 手写签名） */
  const STAGE_CRAFTSMEN={
    raw:{name:'王德福',roleShort:'采购员',role:'原料采购 · 三十年',photo:'assets/craftsmen/wang-defu-cutout.png'},
    prep:{name:'李师傅',roleShort:'腌制匠',role:'腌制匠人 · 七代传承',photo:'assets/craftsmen/li-shifu-cutout.png'},
    dry:{name:'杨明飞',roleShort:'晾挂师',role:'晾挂师傅 · 温湿度监测',photo:'assets/craftsmen/yang-mingfei-cutout.png'},
    smoke:{name:'石武举',roleShort:'熏制师',role:'熏制老师傅 · 柴火控温',photo:'assets/craftsmen/shi-wuju-cutout.png'},
    qc:{name:'石红英',roleShort:'质检员',role:'质检负责人 · 出厂把关',photo:'assets/craftsmen/shi-hongying-cutout.png'},
    stock:{name:'李师傅',roleShort:'入库员',role:'入库登记 · 溯源存档',photo:'assets/craftsmen/li-shifu-cutout.png'},
    ship:{name:'石红英',roleShort:'出库员',role:'出库负责人 · 送达确认',photo:'assets/craftsmen/shi-hongying-cutout.png'},
  };
  const STAGE_IMAGES={
    raw:'assets/trace/stage-raw.jpg',
    prep:'assets/trace/stage-prep.jpg',
    dry:'assets/trace/stage-dry.jpg',
    smoke:'assets/trace/stage-smoke.jpg',
    qc:'assets/trace/stage-qc.jpg',
    pack:'assets/trace/stage-pack.jpg',
    deliver:'assets/trace/stage-deliver.jpg',
  };
  function stageImageFor(title){
    if(!title) return STAGE_IMAGES.raw;
    if(title.includes('原料')) return STAGE_IMAGES.raw;
    if(title.includes('腌制')) return STAGE_IMAGES.prep;
    if(title.includes('晾挂')) return STAGE_IMAGES.dry;
    if(title.includes('熏制')) return STAGE_IMAGES.smoke;
    if(title.includes('检验')) return STAGE_IMAGES.qc;
    if(title.includes('封箱')) return STAGE_IMAGES.pack;
    if(title.includes('到你')) return STAGE_IMAGES.deliver;
    return STAGE_IMAGES.raw;
  }
  function craftsmanForStage(title){
    if(!title) return null;
    if(title.includes('原料')) return STAGE_CRAFTSMEN.raw;
    if(title.includes('腌制')) return STAGE_CRAFTSMEN.prep;
    if(title.includes('晾挂')) return STAGE_CRAFTSMEN.dry;
    if(title.includes('熏制')) return STAGE_CRAFTSMEN.smoke;
    if(title.includes('检验')) return STAGE_CRAFTSMEN.qc;
    if(title.includes('封箱')) return STAGE_CRAFTSMEN.stock;
    if(title.includes('到你')) return STAGE_CRAFTSMEN.ship;
    return null;
  }
  let DEMO_BY_TOKEN={};
  let _demoRecordsPromise=null;
  function loadDemoRecords(){
    if(_demoRecordsPromise) return _demoRecordsPromise;
    _demoRecordsPromise=fetch('data/demo/trace-records.json')
      .then(r=>r.ok?r.json():{})
      .then(j=>{ DEMO_BY_TOKEN=j||{}; return DEMO_BY_TOKEN; })
      .catch(()=>{ DEMO_BY_TOKEN={}; return DEMO_BY_TOKEN; });
    return _demoRecordsPromise;
  }

  function readReg(){
    try{ return JSON.parse(localStorage.getItem('sx_trace')||'{}'); }catch{ return {}; }
  }
  function writeReg(reg){
    try{ localStorage.setItem('sx_trace',JSON.stringify(reg)); }catch(e){}
  }

  const TraceAPI={
    endpoint:'/api/trace/generate',
    useRemote:false,
    batchToken(batchId){ return 'SX'+String(batchId).replace(/-/g,''); },
    tracePageBase(){
      const p=location.pathname.replace(/[^/]*$/,'');
      return location.origin+p;
    },
    getTraceUrl(token){
      return this.tracePageBase()+'trace.html?t='+encodeURIComponent(token);
    },
    getRecord(token){
      if(!token) return null;
      const reg=readReg();
      if(reg[token]) return reg[token];
      return DEMO_BY_TOKEN[token]||null;
    },
    getRecordByBatch(batchId){
      const reg=readReg();
      const tok=reg['_batch_'+batchId]||this.batchToken(batchId);
      return this.getRecord(tok);
    },
    saveRecord(entry){
      const reg=readReg();
      reg[entry.token]=entry;
      reg['_batch_'+entry.batchId]=entry.token;
      writeReg(reg);
      return entry;
    },
    /** 演示：本地生成；生产：POST endpoint */
    async generate(batch, registrar, buildRecord){
      if(this.useRemote){
        const res=await fetch(this.endpoint,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({batchId:batch.id,registrar,stage:batch.stage}),
        });
        if(!res.ok) throw new Error('溯源 API 失败');
        const data=await res.json();
        if(data.record) this.saveRecord(data.record);
        return data;
      }
      const token=batch.traceToken||this.batchToken(batch.id);
      const entry=buildRecord(batch,registrar,token);
      this.saveRecord(entry);
      return {token,url:this.getTraceUrl(token),record:entry};
    },
    seedDemo(){
      if(localStorage.getItem('sx_trace_ver')===TRACE_SEED_VER) return;
      Object.values(DEMO_BY_TOKEN).forEach(e=>this.saveRecord(e));
      localStorage.setItem('sx_trace_ver',TRACE_SEED_VER);
    },
    loadDemoRecords,
    STAGE_CRAFTSMEN,
    STAGE_IMAGES,
    craftsmanForStage,
    stageImageFor,
  };
  Object.defineProperty(TraceAPI,'DEMO_BY_TOKEN',{get:()=>DEMO_BY_TOKEN});

  global.TraceAPI=TraceAPI;
})(typeof window!=='undefined'?window:global);
