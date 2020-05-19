
class VNode {
    constructor(tagName, props = {}, children = []) {
        this.tagName = tagName
        this.props = props
        this.children = children
    }

    render() {
        let node = document.createElement(this.tagName)
        let fragment = document.createDocumentFragment()
        this.children.forEach(c => {
            if(isText(c)) {
                fragment.appendChild(document.createTextNode(c))
            } else {
                fragment.appendChild(c.render())
            }
        })
        applyProps(node, this.props)
        node.appendChild(fragment)
        return node
    }
}
