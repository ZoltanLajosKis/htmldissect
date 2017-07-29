'use strict';

const htmlparser = require('htmlparser2');
const Token = require("./token.js").Token;

class Parser {
    constructor(opts) {
        this.opts = opts || {};
        this.tokens = [];
        this.index = 0;

        this.p = new htmlparser.Parser({
            onopentag: (tag, attrs) => {
                this.tokens.push(Token.newOpen(tag, attrs));
            },
            onclosetag: (tag) => {
                this.tokens.push(Token.newClose(tag));
            },
            ontext: (text) => {
                if (this.opts.skipWhitespaceOnlyText && /^[ \n\t]+$/.test(text)) {
                    return;
                }
                this.tokens.push(Token.newText(text));
            },
            oncomment: (text) => {
                this.tokens.push(Token.newComment(text));
            },
            oncommentend: () => {
                this.tokens.push(Token.newCommentEnd());
            },
            onend: () => {
                this.tokens.push(Token.newEnd());
            }
        });
    }

    write(html) {
        this.p.write(html);
        return this;
    }

    end() {
        this.p.end();
        return this;
    }

    expectOpen(tag, match, cb) {
        if (!cb && !match && typeof tag === 'function') {
            cb = tag;
            tag = null;
        }

        let t = this.next();
        if (!t.isOpen(tag, match)) {
            throw new Error("expect");
        }

        let ret;
        if (tag) {
            ret = t.attrs;
        } else {
            ret = t;
        }

        if (typeof cb === 'function') {
            return cb(ret);
        }
        return ret;
    }

    expectClose(tag, cb) {
        if (!cb && typeof tag === 'function') {
            cb = tag;
            tag = null;
        }

        let t = this.next();
        if (!t.isClose(tag)) {
            throw new Error("expect");
        }

        if (typeof cb === 'function') {
            return cb(t);
        }
        return t;
    }

    expectOpenClose(tag, match, cb) {
        if (!cb && !match && typeof tag === 'function') {
            cb = tag;
            tag = null;
        }

        let ret = this.expectOpen(tag, match);
        let openTag = tag || ret.tag;

        if (typeof cb === 'function') {
            ret = cb(ret);
        }

        this.expectClose(openTag);
        return ret;
    }

    expectText(match, cb) {
        if (!cb && typeof match === 'function') {
            cb = match;
            match = null;
        }

        let t = this.next();
        if (!t.isText(match)) {
            throw new Error("expect");
        }

        if (typeof cb === 'function') {
            return cb(t.text);
        }
        return t.text;
    }



    expectComment(match, cb) {
        if (!cb && typeof match === 'function') {
            cb = match;
            match = null;
        }

        let t = this.next();
        if (!t.isComment(match)) {
            throw new Error("expect");
        }

        if (typeof cb === 'function') {
            return cb(t.text);
        }
        return t.text;
    }



    expectCommentEnd(cb) {
        let t = this.next();
        if (!t.isCommentEnd()) {
            throw new Error("expect");
        }

        if (typeof cb === 'function') {
            return cb(t);
        }
        return t;
    }



    expectEnd(cb) {
        let t = this.next();
        if (!t.isEnd()) {
            throw new Error("expect");
        }

        if (typeof cb === 'function') {
            return cb(t);
        }
        return t;
    }



    skipToOpen(tag, match, cb) {
        if (!cb && typeof match === 'function') {
            cb = match;
            match = null;
        }

        let t;
        do {
            t = this.next();
        } while (!t.isOpen(tag, match));

        let ret;
        if (tag) {
            ret = t.attrs;
        } else {
            ret = t;
        }

        if (typeof cb === 'function') {
            return cb(ret);
        }
        return ret;
    }

    skipToClose(tag, cb) {
        if (!cb && typeof tag === 'function') {
            cb = tag;
            tag = null;
        }

        let t;
        do {
            t = this.next();
        } while (!t.isClose(tag));

        if (typeof cb === 'function') {
            return cb(t);
        }
        return t;
    }

    next(cb) {
        if (this.tokens.length <= this.index) {
            throw new Error("eof");
        }
        let t = this.tokens[this.index];
        this.index++;

        if (typeof cb === 'function') {
            return cb(t);
        }
        return t;
    }



    peekExpectOpen(tag, match, cb) {
        if (!cb && !match && typeof tag === 'function') {
            cb = tag;
            tag = null;
        }

        let t = this.peek();
        if (!t.isOpen(tag, match)) {
            throw new Error("peekExpect");
        }

        let ret;
        if (tag) {
            ret = t.attrs;
        } else {
            ret = t;
        }

        if (typeof cb === 'function') {
            return cb(ret);
        }
        return ret;
    }

    peekExpectClose(tag, cb) {
        if (!cb && typeof tag === 'function') {
            cb = tag;
            tag = null;
        }

        let t = this.peek();
        if (!t.isClose(tag)) {
            throw new Error("peekExpect");
        }

        if (typeof cb === 'function') {
            return cb(t);
        }
        return t;
    }

    peekExpectText(match, cb) {
        if (!cb && typeof match === 'function') {
            cb = match;
            match = null;
        }

        let t = this.peek();
        if (!t.isText(match)) {
            throw new Error("peekExpect");
        }

        if (typeof cb === 'function') {
            return cb(t.text);
        }
        return t.text;
    }

    peekExpectComment(match, cb) {
        if (!cb && typeof match === 'function') {
            cb = match;
            match = null;
        }

        let t = this.peek();
        if (!t.isComment(match)) {
            throw new Error("peekExpect");
        }

        if (typeof cb === 'function') {
            return cb(t.text);
        }
        return t.text;
    }

    peekExpectCommentEnd(cb) {
        let t = this.peek();
        if (!t.isCommentEnd()) {
            throw new Error("peekExpect");
        }

        if (typeof cb === 'function') {
            return cb(t);
        }
        return t;
    }

    peekExpectEnd(cb) {
        let t = this.peek();
        if (!t.isEnd()) {
            throw new Error("peekExpect");
        }

        if (typeof cb === 'function') {
            return cb(t);
        }
        return t;
    }

    peekSkipToOpen(tag, match, cb) {
        if (!cb && typeof match === 'function') {
            cb = match;
            match = null;
        }

        let t = this.peek();
        while (!t.isOpen(tag, match)) {
            this.next();
            t = this.peek();
        }

        let ret;
        if (tag) {
            ret = t.attrs;
        } else {
            ret = t;
        }

        if (typeof cb === 'function') {
            return cb(ret);
        }
        return ret;
    }

    peekSkipToClose(tag, cb) {
        if (!cb && typeof tag === 'function') {
            cb = tag;
            tag = null;
        }

        let t = this.peek();
        while (!t.isClose(tag)) {
            this.next();
            t = this.peek();
        }

        if (typeof cb === 'function') {
            return cb(t);
        }
        return t;
    }

    peek(cb) {
        let t;
        if (this.tokens.length <= this.index) {
            throw new Error("eof");
        }
        t = this.tokens[this.index];

        if (typeof cb === 'function') {
            return cb(t);
        }
        return t;
    }



    ifOpen(tag, match, cb) {
        if (!cb && !match && typeof tag === 'function') {
            cb = tag;
            tag = null;
        }

        if (this.peek().isOpen(tag, match)) {
            let ret = this.next();
            if (tag) {
                ret = ret.attrs;
            }

            if (typeof cb === 'function') {
                cb(ret);
                return true;
            }
            return ret;
        }

        return false;
    }

    ifClose(tag, cb) {
        if (!cb && typeof tag === 'function') {
            cb = tag;
            tag = null;
        }

        if (this.peek().isClose(tag)) {
            let ret = this.next();

            if (typeof cb === 'function') {
                cb(ret);
                return true;
            }
            return ret;
        }

        return false;
    }

    ifOpenClose(tag, match, cb) {
        if (!cb && !match && typeof tag === 'function') {
            cb = tag;
            tag = null;
        }

        if (this.peek().isOpen(tag, match)) {
            let openTag = tag || this.peekExpectOpen().tag;
            let ret = this.next();
            if (tag) {
                ret = ret.attrs;
            }

            if (typeof cb === 'function') {
                cb(ret);
                this.expectClose(openTag);
                return true;
            }
            this.expectClose(openTag);
            return ret;
        }

        return false;
    }

    ifText(match, cb) {
        if (!cb && typeof match === 'function') {
            cb = match;
            match = null;
        }

        if (this.peek().isText(match)) {
            let ret = this.next().text;
            if (typeof cb === 'function') {
                cb(ret);
                return true;
            }
            return ret;
        }

        return false;
    }

    ifComment(match, cb) {
        if (!cb && typeof match === 'function') {
            cb = match;
            match = null;
        }

        if (this.peek().isComment(match)) {
            let ret = this.next().text;

            if (typeof cb === 'function') {
                cb(ret);
                return true;
            }
            return ret;
        }

        return false;
    }

    ifCommentEnd(cb) {
        if (this.peek().isCommentEnd()) {
            let ret = this.next();

            if (typeof cb === 'function') {
                cb(ret);
                return true;
            }
            return ret;
        }

        return false;
    }

    ifEnd(cb) {
        if (this.peek().isEnd()) {
            let ret = this.next();

            if (typeof cb === 'function') {
                cb(ret);
                return true;
            }
            return ret;
        }

        return false;
    }
}

module.exports = {Parser};

