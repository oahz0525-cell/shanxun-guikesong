/**
 * 山熏 · 业务常量（批次工艺、导航、表格列）
 */
window.SX_CONSTANTS = {
  WORKFLOW: [
    { id: 'buy', label: '采购', sub: '原料进货验收', img: 'assets/flow/buy.png' },
    { id: 'rawstock', label: '原料库', sub: '验收合格原料暂存', img: 'assets/flow/rawstock.png' },
    { id: 'prep', label: '预处理', sub: '腌制与初步处理', img: 'assets/flow/prep.png' },
    { id: 'dry', label: '晾挂', sub: '自然风干', img: 'assets/flow/dry.png' },
    { id: 'smoke', label: '熏制', sub: '柴火熏制', img: 'assets/flow/smoke.png' },
    { id: 'qc', label: '成品检验', sub: '质量检验', img: 'assets/flow/qc.png' },
    { id: 'stock', label: '成品库', sub: '成品冷藏管理', img: 'assets/flow/stock.png' },
    { id: 'ship', label: '出库', sub: '订单出库发货', img: 'assets/flow/ship.png' },
  ],
  STAGE_ORDER: ['buy', 'rawstock', 'prep', 'dry', 'smoke', 'qc', 'stock', 'ship'],
  STAGE_LABEL: { buy: '采购', rawstock: '原料库', prep: '预处理', dry: '晾挂', smoke: '熏制', qc: '成品检验', stock: '成品库', ship: '出库' },
  BUY_SUBS: [
    { id: 'all', label: '全部' }, { id: 'pending', label: '待采购' }, { id: 'buying', label: '采购中' },
    { id: 'inspecting', label: '到货验收中' }, { id: 'passed', label: '验收完成' }, { id: 'failed', label: '不合格' },
  ],
  BUY_SUB_LABEL: { pending: '待采购', buying: '采购中', inspecting: '到货验收中', passed: '验收完成', failed: '不合格（退货/隔离）' },
  COLS: {
    all: ['批次', '进货', '工艺', '出货', '得率'],
    buy: ['批次', '供应商', '进货日', '重量', '单价', '金额'],
    make: ['批次', '状态', '晾挂天数', '均湿', '待处理异常', '得率'],
    sell: ['批次', '出货日', '渠道', '出货重量', '得率', '状态'],
  },
  RIGHT: ['重量', '单价', '金额', '晾挂天数', '均湿', '出货重量', '得率', '待处理异常'],
  HUM_MIN: 34, HUM_MAX: 60, HUM_LOW: 42,
  TITLES: { today: '今日', batches: '批次', detail: '批次详情', factory: '车间', todo: '代办', anomaly: '代办', ledger: '台账' },
};

// 兼容现有全局变量
const C = window.SX_CONSTANTS;
window.WORKFLOW = C.WORKFLOW;
window.STAGE_ORDER = C.STAGE_ORDER;
window.STAGE_LABEL = C.STAGE_LABEL;
window.BUY_SUBS = C.BUY_SUBS;
window.BUY_SUB_LABEL = C.BUY_SUB_LABEL;
window.COLS = C.COLS;
window.RIGHT = C.RIGHT;
window.HUM_MIN = C.HUM_MIN;
window.HUM_MAX = C.HUM_MAX;
window.HUM_LOW = C.HUM_LOW;
window.TITLES = C.TITLES;
