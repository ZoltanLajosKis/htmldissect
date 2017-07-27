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

        let ev = this.next();
        if (!ev.isOpen(tag, match)) {
            throw new Error("expect");
        }

        let ret;
        if (tag) {
            ret = ev.attrs;
        } else {
            ret = ev;
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

        let ev = this.next();
        if (!ev.isClose(tag)) {
            throw new Error("expect");
        }

        if (typeof cb === 'function') {
            return cb(ev);
        }
        return ev;
    }

    expectOpenClose(tag, match, cb) {
        if (!cb && !match && typeof tag === 'function') {
            cb = tag;
            tag = null;
        }

        let openTag = tag || this.peekExpectOpen().tag;
        let ret = this.expectOpen(tag, match, cb);

        this.expectClose(openTag);
        return ret;
    }

    expectText(match, cb) {
        if (!cb && typeof match === 'function') {
            cb = match;
            match = null;
        }

        let ev = this.next();
        if (!ev.isText(match)) {
            throw new Error("expect");
        }

        if (typeof cb === 'function') {
            return cb(ev.text);
        }
        return ev.text;
    }



    expectComment(match, cb) {
        if (!cb && typeof match === 'function') {
            cb = match;
            match = null;
        }

        let ev = this.next();
        if (!ev.isComment(match)) {
            throw new Error("expect");
        }

        if (typeof cb === 'function') {
            return cb(ev.text);
        }
        return ev.text;
    }



    expectCommentEnd(cb) {
        let ev = this.next();
        if (!ev.isCommentEnd()) {
            throw new Error("expect");
        }

        if (typeof cb === 'function') {
            return cb(ev);
        }
        return ev;
    }



    expectEnd(cb) {
        let ev = this.next();
        if (!ev.isEnd()) {
            throw new Error("expect");
        }

        if (typeof cb === 'function') {
            return cb(ev);
        }
        return ev;
    }



    skipToOpen(tag, match, cb) {
        if (!cb && typeof match === 'function') {
            cb = match;
            match = null;
        }

        let ev;
        do {
            ev = this.next();
        } while (!ev.isOpen(tag, match));

        let ret;
        if (tag) {
            ret = ev.attrs;
        } else {
            ret = ev;
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

        let ev;
        do {
            ev = this.next();
        } while (!ev.isClose(tag));

        if (typeof cb === 'function') {
            return cb(ev);
        }
        return ev;
    }

    next(cb) {
        if (this.tokens.length <= this.index) {
            throw new Error("eof");
        }
        let ev = this.tokens[this.index];
        this.index++;

        if (typeof cb === 'function') {
            return cb(ev);
        }
        return ev;
    }



    peekExpectOpen(tag, match, cb) {
        if (!cb && !match && typeof tag === 'function') {
            cb = tag;
            tag = null;
        }

        let ev = this.peek();
        if (!ev.isOpen(tag, match)) {
            throw new Error("peekExpect");
        }

        let ret;
        if (tag) {
            ret = ev.attrs;
        } else {
            ret = ev;
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

        let ev = this.peek();
        if (!ev.isClose(tag)) {
            throw new Error("peekExpect");
        }

        if (typeof cb === 'function') {
            return cb(ev);
        }
        return ev;
    }

    peekExpectText(match, cb) {
        if (!cb && typeof match === 'function') {
            cb = match;
            match = null;
        }

        let ev = this.peek();
        if (!ev.isText(match)) {
            throw new Error("peekExpect");
        }

        if (typeof cb === 'function') {
            return cb(ev.text);
        }
        return ev.text;
    }

    peekExpectComment(match, cb) {
        if (!cb && typeof match === 'function') {
            cb = match;
            match = null;
        }

        let ev = this.peek();
        if (!ev.isComment(match)) {
            throw new Error("peekExpect");
        }

        if (typeof cb === 'function') {
            return cb(ev.text);
        }
        return ev.text;
    }

    peekExpectCommentEnd(cb) {
        let ev = this.peek();
        if (!ev.isCommentEnd()) {
            throw new Error("peekExpect");
        }

        if (typeof cb === 'function') {
            return cb(ev);
        }
        return ev;
    }

    peekExpectEnd(cb) {
        let ev = this.peek();
        if (!ev.isEnd()) {
            throw new Error("peekExpect");
        }

        if (typeof cb === 'function') {
            return cb(ev);
        }
        return ev;
    }

    peekSkipToOpen(tag, match, cb) {
        if (!cb && typeof match === 'function') {
            cb = match;
            match = null;
        }

        let ev = this.peek();
        while (!ev.isOpen(tag, match)) {
            this.next();
            ev = this.peek();
        }

        let ret;
        if (tag) {
            ret = ev.attrs;
        } else {
            ret = ev;
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

        let ev = this.peek();
        while (!ev.isClose(tag)) {
            this.next();
            ev = this.peek();
        }

        if (typeof cb === 'function') {
            return cb(ev);
        }
        return ev;
    }

    peek(cb) {
        let ev;
        if (this.tokens.length <= this.index) {
            throw new Error("eof");
        }
        ev = this.tokens[this.index];

        if (typeof cb === 'function') {
            return cb(ev);
        }
        return ev;
    }
}

module.exports = {Parser};

