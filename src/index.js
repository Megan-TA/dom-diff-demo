import {createElement, render} from './element'
import {renderDom} from './dom'
import { diff } from './dom-diff'
import Patch from './patch'


let virtualDom = createElement('ul', {class: 'list'}, [
  createElement('li', {class: 'item'}, ['a']),
  createElement('li', {class: 'item'}, ['b']),
  createElement('li', {class: 'item'}, ['c']),
  createElement('li', {class: 'item'}, ['d'])
])

let virtualDom2 = createElement('ul', {class: 'lists'}, [
  createElement('li', {class: 'item'}, [
    createElement('div', {class: 'item'}, ['o']),
  ]),
  createElement('li', {class: 'blue'}, ['v']),
  createElement('li', {class: 'item'}, ['9']),
  createElement('p', {}, ['pppppp'])
])


console.log(virtualDom)

let $dom = render(virtualDom)

console.log($dom)

renderDom($dom, document.getElementById('root'))

let patchs = diff(virtualDom, virtualDom2)

console.log('补丁包：', patchs)

// 开始打补丁 更新视图
Patch($dom, patchs)



