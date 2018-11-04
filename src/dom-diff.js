import TYPES from './type'

// 补丁包 存放两个虚拟dom的差异部分
let patchs = {}
// 当前父节点下的子节点的索引
let globalIndex = 0

function diff (oldTree, newTree) {
  walk(oldTree, newTree, globalIndex)
  return patchs
}

function isString (node) {
  return typeof node === 'string'
}

function walk (oldTree, newTree, index) {
  // 每个元素都有一个补丁对象
  let currentPatchs = []
  // 新节点不存在的情况
  if (!newTree) {
    currentPatchs.push({
      type: TYPES.REMOVE,
      index
    })
  } else if (isString(oldTree)) {
    // 新对象的值是文本了 若不相等则记录补丁
    if (isString(newTree) && oldTree !== newTree) {
      currentPatchs.push({
        type: TYPES.TEXT,
        text: newTree
      })
    }

    if (!isString(newTree)) {
      currentPatchs.push({
        type: TYPES.REPLACE,
        newNode: newTree
      })
    }
  } else if (oldTree.type === newTree.type) {
    let patchAttrs = diffProps(oldTree.props, newTree.props)
    if (Object.keys(patchAttrs).length > 0) {
      currentPatchs.push({
        type: TYPES.ATTRS,
        attr: patchAttrs
      })
    }
    diffChildren(oldTree.children, newTree.children)
    
  } else {
    // type不一致
    currentPatchs.push({
      type: TYPES.REPLACE,
      newNode: newTree
    })
  }

  // 放到最外层的大补丁包中
  if (currentPatchs.length > 0) {
    patchs[index] = currentPatchs
  }
}

function diffProps (oldProps, newProps) {
  // 存放props补丁
  let patchProps = {}
  for (let key in oldProps) {
    if (oldProps[key] !== newProps[key]) {
      patchProps[key] = newProps[key]
    }
  }
  for (let key in newProps) {
    if (newProps[key] !== oldProps[key]) {
      patchProps[key] = newProps[key]
    }
  }
  return patchProps
}

function diffChildren (oldChildrens, newChildrens) {
  oldChildrens.forEach((child, idx) => {
    walk(child, newChildrens[idx], ++globalIndex)
  })
}
export {
  diff
}