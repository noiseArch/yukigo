type Visitor = {
  [nodeType: string]: (node: any, parent?: any) => void;
};

export function traverse(node: any, visitor: Visitor, parent?: any) {
  if (!node || typeof node !== 'object') return;
  if (node.type && visitor[node.type]) {
    visitor[node.type](node, parent);
  }
  for (const key in node) {
    if (key === 'type') continue;
    const child = node[key];
    if (Array.isArray(child)) {
      child.forEach(c => traverse(c, visitor, node));
    } else if (typeof child === 'object' && child !== null) {
      traverse(child, visitor, node);
    }
  }
}


