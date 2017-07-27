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
        if (!tag) {
            return this.type === 'open';
        }
        if (!match) {
            return this.type === "open" && this.tag === tag;
        }
        return this.type === "open" && this.tag === tag && this.hasAttrs(match);
    }

    isClose(tag) {
        if (!tag) {
            return this.type === 'close';
        }
        return this.type === 'close' && this.tag === tag;
    }

    isText(match) {
        if (!match) {
            return this.type === 'text';
        }
        if (typeof match === 'string') {
            return this.type === 'text' && this.text === match;
        }
        if (typeof match === 'function') {
            return this.type === 'text' && match(this.text);
        }
        return this.type === 'text' && match.test(this.text);
    }

    isComment(match) {
        if (!match) {
            return this.type === 'comment';
        }
        if (typeof match === 'string') {
            return this.type === 'comment' && this.text === match;
        }
        if (typeof match === 'function') {
            return this.type === 'comment' && match(this.text);
        }
        return this.type === 'comment' && match.test(this.text);
    }

    isCommentEnd() {
        return this.type === 'commentEnd';
    }

    isEnd() {
        return this.type === 'end';
    }

    hasAttrs(match) {
        if (!this.attrs) {
            return false;
        }
        for (let k in match) {
            if (!(k in this.attrs)) {
                return false;
            }

            let m = match[k];
            if (typeof m === 'string') {
                if (m !== this.attrs[k]) {
                    return false;
                }
            } else if (typeof m === 'function') {
                if (!m(this.attrs[k])) {
                    return false;
                }
            } else if (!m.test(this.attrs[k])) {
                return false;
            }
        }
        return true;
    }
}

module.exports = {Token};

