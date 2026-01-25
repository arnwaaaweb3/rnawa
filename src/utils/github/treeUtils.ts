interface TreeNode {
  name: string;
  path: string;
  type: 'tree' | 'blob';
  children?: TreeNode[];
}

export function buildTree(items: any[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const item of items) {
    const parts = item.path.split('/');
    let currentLevel = root;

    parts.forEach((part: string, index: number) => {
      let existingNode = currentLevel.find((n) => n.name === part);

      if (!existingNode) {
        existingNode = {
          name: part,
          path: parts.slice(0, index + 1).join('/'),
          type: index === parts.length - 1 ? item.type : 'tree',
          children: [],
        };

        currentLevel.push(existingNode);
      }

      if (existingNode.children) {
        currentLevel = existingNode.children;
      }
    });
  }

  return root;
}

export function flattenTree(nodes: TreeNode[]): TreeNode[] {
  let flat: TreeNode[] = [];

  nodes.forEach((node) => {
    if (node.type === 'blob') {
      flat.push(node);
    }

    if (node.children && node.children.length > 0) {
      flat = [...flat, ...flattenTree(node.children)];
    }
  });

  return flat;
}
