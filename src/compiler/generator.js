const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g//["{{test}}","test"]
export function generator(root) {
    console.log('generator', root)
    let code = `_c('${root.tag}',${root.attrs.length ? `{${genProps(root.attrs)}}` : 'undefined'}),
    ${root.children ? `,${genChildren(root.children)}` : ''}`
    return code
}

function genProps(attrs) {
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if (attr.name === 'style') {//处理style属性
            let styleObj = {}
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':')
                styleObj[key] = value
            })
            attr.value = styleObj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)}`
        if (i < attrs.length - 1) {
            str += ','
        }
    }
    console.log('genProps', str)
    return str
}

function genChildren(el) {
    let children = el.children;
    if (children) {
        return children.map(c => gen(c)).join(',')
    } else {
        return false
    }
}

function gen(el) {
    if (el.type === 1) {//如果是元素，则递归生成子元素element=1 text=3
        return generate(el)
    } else {
        let text = el.text;
        if (!defaultTagRE.test(text)) {//如果是普通文本
            return `_v(${text})`
        }else {
            //hello {{name}} hello {{age}}=> hello +name+ hello + age
            let tokens = [];
            let match, index;
            let lastIndex  =defaultTagRE.lastIndex= 0;//正则的exec和正则的/g冲突，需要手动设置lastIndex
            while (match = defaultTagRE.exec(text)) {//看有没有匹配到
                index = match.index;//匹配到的开始索引
                if (index > lastIndex) {//hello// 匹配到了
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)));
                }
                tokens.push(`_s(${match[1].trim()})`);//JSON.stringify=_s()
                lastIndex = index + match[0].length;
            }
            if (lastIndex < text.length) {//大括号匹配完了，但是字符串还有剩余
                tokens.push(JSON.stringify(text.slice(lastIndex)));
            }
            return `_v(${tokens.join('+')})`
        }

    }

}
