export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '()')
  return reg.test(el.className)
}

export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

/* *
 * 创建一个元素 然后判断浏览器支持哪一种属性 然后添加前缀做兼容
 * */
let elementStyle = document.createElement('div').style

let vendor = (()=> {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
    return false
  }
})()
export function prefixStyle(style) {
if (!vendor) {
  return style
}
if (vendor === 'standard') {
  return style
}
return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
