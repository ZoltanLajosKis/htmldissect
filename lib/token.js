'use strict';

class Token {
    static newOpen(tag, attrs) {
        let t = new Token("open");
        t.tag = tag;
        t.attrs = attrs;
        return t;
    }

    static newClose(tag) {
        let t = new Token("close");
        t.tag = tag;
        return t;
    }

    static newText(text) {
        let t = new Token("text");
        t.text = text;
        return t;
    }

    static newComment(text) {
        let t = new Token("comment");
        t.text = text;
        return t;
    }

    static newCommentEnd() {
        let t = new Token("commentEnd");
        return t;
    }

    static newEnd() {
        let t = new Token("end");
        return t;
    }

    constructor(type) {
        this.type = type;
    }

    isOpen(tag, match) {
        return this.type === "open" && matchTag(this.tag, tag)
                                    && matchAttrs(this.attrs, match);
    }

    isClose(tag) {
        return this.type === 'close' && matchTag(this.tag, tag);
    }

    isText(match) {
        return this.type === 'text' && matchText(this.text, match);
    }

    isComment(match) {
        return this.type === 'comment' && matchText(this.text, match);
    }

    isCommentEnd() {
        return this.type === 'commentEnd';
    }

    isEnd() {
        return this.type === 'end';
    }
}

function matchTag(tag, match) {
    if (!match) {
        return true;
    }
    return tag === match;
}

function matchText(text, match) {
    if (!match) {
        return true;
    }
    if (typeof match === 'string') {
        return text === match;
    }
    if (typeof match === 'function') {
        return match(text);
    }
    return match.test(text);
}

function matchAttrs(attrs, match) {
    for (let k in match) {
        if (!(k in attrs) || !matchText(attrs[k], match[k])) {
            return false;
        }
    }
    return true;
}

module.exports = {Token};

