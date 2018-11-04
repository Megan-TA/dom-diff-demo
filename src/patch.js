import TYPES from './type'
import { render, setAttr, Element } from './element' 

let index = 0
let allPatchs = {}
function patch (node,patchs) {
  allPatchs = patchs
  walk(node)
}

function walk(node) {
  let currentPatch = allPatchs[index++]
  let childNodes = node.childNodes
  childNodes.forEach(child => walk(child))
  if (currentPatch) {
    doPatch(node, currentPatch)
  }
}

function doPatch(node, patchs) {
  patchs.forEach(patch => {
    patch2dom(node, patch)
  })
}

function patch2dom (node, patch) {
  switch (patch.type) {
    case TYPES.ATTRS:
      for (let key in patch.attr) {
        setAttr(node, key, patch.attr[key])
      }
      break
    case TYPES.REMOVE:
      node.parentNode.removeChild(node)
      break
    case TYPES.REPLACE:
      let newNode = patch.newNode instanceof Element ?
        render(patch.newNode) :
        document.createTextNode(patch.newNode)
      node.parentNode.replaceChild(newNode, node)
      break
    case TYPES.TEXT:
      node.textContent = patch.text
      break
    default:
  }
}

export default patch