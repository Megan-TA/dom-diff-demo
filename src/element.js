class Element {
  constructor (type, props, children) {
    this.type = type
    this.props = props
    this.children = children
  }
}
// 返回虚拟节点
function createElement (type, props, children) {
  return new Element(type, props, children)
}

function render (virtualDom) {
  let { type, props, children } = virtualDom
  let el = document.createElement(type)
  for (let key in props) {
    setAttr(el, key, props[key])
  }

  for (let key in children) {
    let child = children[key]
    // 如果元素类型是Element则递归 否则就是一个文本
    let newChild = child instanceof Element ?
      render(child) : 
      document.createTextNode(child)
    el.appendChild(newChild)
  }
  return el
}
// 专门遍历props的属性值
// 兼容input标签value属性以及所有标签的style属性
function setAttr (node, key, val) {
  switch(key) {
  case 'value':
    let tagName = node.tagName.toLowerCase()
    if (tagName === 'input' || tagName === 'textarea') {
      node.value = val
    } else {
      node.setAttribute(key, val)
    }
    break
  case 'style':
    node.style.cssText = val
    break
  default:
    node.setAttribute(key, val)
  }
  return node
}

export {
  createElement,
  render,
  setAttr,
  Element
}

  