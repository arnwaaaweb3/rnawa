export interface TreeNode {
  name: string;
  path: string;
  type: 'tree' | 'blob';
  children?: TreeNode[];
}