// React crashes ("Failed to execute 'removeChild' on 'Node'") when something outside React
// (a browser extension such as Google Translate, or our own image loader that strips
// <source> tags) has already detached a node React still believes it owns. This is a
// well-known React/DOM interaction. These guards make removeChild/insertBefore tolerate the
// detached node instead of throwing, so the page keeps rendering.
// https://github.com/facebook/react/issues/11538

export function installDomSafety(): void {
  if (typeof Node === 'undefined' || (Node.prototype as { __nxSafe?: boolean }).__nxSafe) return;
  const proto = Node.prototype as Node & { __nxSafe?: boolean };
  proto.__nxSafe = true;

  const originalRemoveChild = proto.removeChild;
  proto.removeChild = function removeChildSafe<T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = proto.insertBefore;
  proto.insertBefore = function insertBeforeSafe<T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return originalInsertBefore.call(this, node, null) as T;
    return originalInsertBefore.call(this, node, ref) as T;
  };
}
