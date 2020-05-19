const REMOVE = 'REMOVE'
const REPLACE = 'REPLACE'
const ATTRS = 'ATTRS'
const TEXT = 'TEXT'

const isText = o => {
    return typeof o === 'string'
}

const applyProps = (node, props) => {
    for(let k in props) {
        let value = props[k]
        if(!value) {
            node.removeAttribute(k)
        } else {
            k === 'style' ? applyStyle(node, value) : node.setAttribute(k, value)
        }
    }
}

const applyStyle = (node, styles) => {
    for(let k in styles) {
        let value = styles[k]
        node.style[k] = value
    }
}

let walkIndex = 0

function diff(oldTree, newTree) {
    let patch = {}
    walkIndex = 0
    walk(oldTree, newTree, walkIndex, patch)
    return patch
}

function walk(oldTree, newTree, index, patch) {
    let currentPatches = []
    if(!newTree) {
        currentPatches.push({ type: REMOVE, index })
    } else if(isText(oldTree) && isText(newTree)) {
        if(oldTree !== newTree) {
            currentPatches.push({
                type: TEXT,
                content: newTree
            })
        }
    } else if(oldTree.tagName === newTree.tagName) {
        let propsPatches = diffProps(oldTree.props, newTree.props)
        if(Object.keys(propsPatches).length > 0) {
            currentPatches.push({ type: ATTRS, content: propsPatches })
        }
        diffChildren(oldTree.children, newTree.children, patch)
    } else {
        currentPatches.push({ type: REPLACE, content: newTree })
    }

    if(currentPatches.length > 0) {
        patch[index] = currentPatches
    }
}

function diffChildren(oldChildren, newChildren, patch) {
    oldChildren.forEach((oC, idx) => walk(oC, newChildren[idx], ++walkIndex, patch))
}

function diffProps(oldProps, newProps) {
    let propsPatches = {}

    for(let key in oldProps) {
        if(oldProps[key] !== newProps[key]) {
            // 更新，删除
            propsPatches[key] = newProps[key]
        }
    }

    for(let key in newProps) {
        if(!oldProps.hasOwnProperty(key)) {
            // 新增
            propsPatches[key] = newProps[key]
        }
    }

    return propsPatches
}

function patch(node, patches) {
    walkIndex = 0
    walkPatch(node, patches)
}

function walkPatch(node, patches) {
    let currentPatch = patches[walkIndex++]
    let children = [].slice.call(node.childNodes)
    children.forEach(child => walkPatch(child, patches))
    currentPatch && applyPatch(node, currentPatch)
}

function applyPatch(node, patch) {
    patch.forEach(p => {
        switch(p.type) {
            case REMOVE:
                node.parentNode.removeChild(node)
                break
            case TEXT:
                node.textContent = p.content
                break
            case ATTRS:
                applyProps(node, p.content)
                break
            case REPLACE:
                let newNode = null
                if(isText(p.content)) {
                    newNode = document.createTextNode(p.content)
                } else {
                    newNode = p.content.render()
                }
                node.parentNode.replaceChild(newNode, node)
                break
            default:
                console.log('Unknow Patch Type!')
        }
    })
}
