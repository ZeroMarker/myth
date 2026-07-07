// ============================================================
// 希腊神话神谱 — 类型定义
// ============================================================

export interface GodNode {
  id: string;
  name: string;          // 中文名
  nameEn: string;        // 英文名
  title: string;         // 神职 / 称号
  generation: number;    // 第几代 (0 = Chaos)
  description: string;
  color: string;         // 十六进制颜色
  parents: string[];     // 父母 id 列表
}

export interface Relation {
  from: string;
  to: string;
  type: 'parent' | 'partner';
  label?: string;
}

export interface GenealogyData {
  nodes: GodNode[];
  relations: Relation[];
}
