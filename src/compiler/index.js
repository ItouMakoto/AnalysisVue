const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名称
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // 用来获取的标签名的 match 结果，例如：<my:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配开始标签的
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配闭合标签的
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的键值对 id='app' id="app" id=app
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配 {{ xxx }}


let root=null
let stack=[]
function start(tagName, attrs) {
    let element = createASTElement(tagName, attrs);
    if (!root) {
        root = element;
    }
    let currentParent =stack[stack.length-1]
    if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
    }
    stack.push(element);
}

function end(endTag) {
    let element = stack.pop();
    let currentParent = stack[stack.length - 1];
    if(element.tagName!==endTag){
        throw new Error(endTag+'标签错误')
    }
    if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
    }
}

function chars(text) {
    text = text.replace(/\s/g, '');
    let currentParent =stack[stack.length-1]
    if (text) {
        currentParent.children.push({
            type: 3,
            text
        });
    }
}
function createASTElement(tagName,attrs){
    return{
        tagName,
        type:1,
        children:[],
        parent:null,
        attrs
    }
}
export function parseHTML(html) {
    function advance(n){
        html = html.substring(n);
    }
    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],//这个是标签名例如div start[0]是<div
                attrs: []
            };
            advance(start[0].length);
            let end, attr;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {//截去匹配后，不是结尾标签并且是属性，继续匹配
                advance(attr[0].length);
                match.attrs.push({ name: attr[1], value: attr[3]||attr[4]||attr[5] });//attr[1] attr[3]是属性的key-value键值对
            }
            if (end) {
                advance(end[0].length);
                return match;
            }
        }
    }
    while (html) {
        let textEnd = html.indexOf('<');
        if (textEnd == 0) {//当前文本开头是<符号，一种是开始标签，一种是结束标签
            const startTagMatch = parseStartTag();//解析开始标签
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }
            const endTagMatch = html.match(endTag);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                end(endTagMatch[1]);
                continue;
            }
        }
        let text;
        if (textEnd > 0) {
            text = html.substring(0, textEnd);//123</div>
        }
        if (text) {
            advance(text.length);
            chars(text);
        }
    }
    return root
}
