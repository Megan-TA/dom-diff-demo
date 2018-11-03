import {createElement, render} from './element'
import {renderDom} from './dom'


let virtualDom = createElement('ul', {class: 'list'}, [
  createElement('li', {class: 'item', style: 'color: red;background:blue'}, ['a']),
  createElement('li', {class: 'item'}, ['b']),
  createElement('li', {class: 'item'}, ['c'])
])

let $dom = render(virtualDom)

renderDom($dom, document.getElementById('root'))

console.log($dom)

console.log(virtualDom)