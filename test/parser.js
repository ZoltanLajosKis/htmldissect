const assert = require('chai').assert;
const Parser = require("../lib/parser.js").Parser;

describe("Parser", () => {
    describe("new Parser()", () => {
        it("creates a Parser", () => {
            let p = new Parser()
                .write("<p><a href='index.html'>Link</a>  <br>Click!</p>")
                .end();
            p.expectOpen("p");
            p.expectOpen("a", {href: "index.html"});
            p.expectText("Link");
            p.expectClose("a");
            p.expectText();
            p.expectOpenClose("br");
            p.expectText("Click!");
            p.expectClose("p");
        });
    });
    describe("new Parser({skipWhitespaceOnlyText: true})", () => {
        it("creates a Parser that skips whitespace only text", () => {
            let p = new Parser({skipWhitespaceOnlyText: true})
                .write("<p><a href='index.html'>Link</a>  <br>Click!</p>")
                .end();
            p.expectOpen("p");
            p.expectOpen("a", {href: "index.html"});
            p.expectText("Link");
            p.expectClose("a");
            p.expectOpenClose("br");
            p.expectText("Click!");
            p.expectClose("p");
        });
    });



    describe("p.expectOpen()", () => {
        it("returns the next token if it is an open token", () => {
            let p = new Parser().write("<a>").end();
            let t = p.expectOpen();
            assert.equal(t.isOpen(), true);
        });
        it("throws an exception if the next token is not open", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.expectOpen();
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpen();
            }, Error, "eof");
        });
    });
    describe("p.expectOpen(tag)", () => {
        it("returns the attributes of the next token if it is an open token with the same tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let a = p.expectOpen("img");
            assert.equal(a.src, "pic.jpg");
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpen("a");
            }, Error, "expect");
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.expectOpen("a");
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpen("a");
            }, Error, "eof");
        });
    });
    describe("p.expectOpen(tag, match)", () => {
        it("returns the attributes of the next token if it is an open token with the same tag and matching attributes", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let a = p.expectOpen("img", {src: "pic.jpg"});
            assert.equal(a.src, "pic.jpg");
        });
        it("throws an exception if the next token is open with matching tag and different attributes", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpen("img", {src: "image.jpg"});
            }, Error, "expect");
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpen("a", {href: "index.html"});
            }, Error, "expect");
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.expectOpen("a", {href: "index.html"});
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpen("a", {href: "index.html"});
            }, Error, "eof");
        });
    });
    describe("p.expectOpen(cb)", () => {
        it("calls cb with the next token if it is an open token", (done) => {
            let p = new Parser().write("<a>").end();
            p.expectOpen(t => {
                assert.equal(t.isOpen(), true);
                done();
            });
        });
        it("throws an exception if the next token is not open", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.expectOpen(() => { /*do nothing*/ });
            }, Error, "expect");

        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpen(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.expectOpen(tag, {}, cb)", () => {
        it("calls cb with the attributes of the next token if it is an open token with the same tag", (done) => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            p.expectOpen("img", {}, a => {
                assert.equal(a.src, "pic.jpg");
                done();
            });
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpen("a", {}, () => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.expectOpen("img", {}, () => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpen("img", {}, () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.expectOpen(tag, match, cb)", () => {
        it("calls cb with the attributes of the next token if it is an open token with the same tag and matching attributes", (done) => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            p.expectOpen("img", {src: "pic.jpg"}, a => {
                assert.equal(a.src, "pic.jpg");
                done();
            });
        });
        it("throws an exception if the next token is open with matching tag and different attributes", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpen("img", {src: "image.jpg"}, () => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpen("a", {href: "index.html"}, () => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.expectOpen("a", {href: "index.html"}, () => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpen("a", {href: "index.html"}, () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.expectClose()", () => {
        it("returns the next token if it is a close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            let t = p.expectClose();
            assert.equal(t.isClose(), true);
        });
        it("throws an exception if the next token is not close", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            assert.throws(() => {
                p.expectClose();
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectClose();
            }, Error, "eof");
        });
    });
    describe("p.expectClose(tag)", () => {
        it("returns the next token if it is a close token with the same tag", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            let t = p.expectClose("a");
            assert.equal(t.isClose(), true);
        });
        it("throws an exception if the next token is close with a different tag", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectClose("img");
            }, Error, "expect");
        });
        it("throws an exception if the next is not an close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            assert.throws(() => {
                p.expectClose("a");
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectClose("a");
            }, Error, "eof");
        });
    });
    describe("p.expectClose(cb)", () => {
        it("calls cb with the next token if it is a close token", (done) => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.expectClose(t => {
                assert.equal(t.isClose(), true);
                done();
            });
        });
        it("throws an exception if the next token is not close", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            assert.throws(() => {
                p.expectClose(() => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectClose(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.expectClose(tag, cb)", () => {
        it("calls cb with the next token if it is a close token with the same tag", (done) => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.expectClose("a", t => {
                assert.equal(t.isClose(), true);
                done();
            });
        });
        it("throws an exception if the next token is close with a different tag", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectClose("img", () => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if the next is not an close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            assert.throws(() => {
                p.expectClose("a", () => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectClose("a", () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.expectOpenClose()", () => {
        it("returns the next token if it is an open token followed by a close token pair", () => {
            let p = new Parser().write("<br/>").end();
            let t = p.expectOpenClose();
            assert.equal(t.isOpen(), true);
        });
        it("throws an exception if the next token is an open token not followed by a close token pair", () => {
            let p = new Parser().write("<section></p>").end();
            assert.throws(() => {
                p.expectOpenClose();
            }, Error, "expect");
        });
        it("throws an exception if the next token is not open", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            assert.throws(() => {
                p.expectOpenClose();
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpenClose();
            }, Error, "eof");
        });
    });
    describe("p.expectOpenClose(tag)", () => {
        it("returns the attributes of the next token if it is an open token with the same tag if it is followed by a pair close token", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let a = p.expectOpenClose("img");
            assert.equal(a.src, "pic.jpg");
        });
        it("throws an exception if the next token is open with the same tag not followed by a pair close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            assert.throws(() => {
                p.expectOpenClose("a");
            }, Error, "expect");
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpenClose("a");
            }, Error, "expect");
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            assert.throws(() => {
                p.expectOpenClose("a");
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpenClose("a");
            }, Error, "eof");
        });
    });
    describe("p.expectOpenClose(tag, match)", () => {
        it("returns the attributes of the next token if it is an open token with the same tag and matching attributes", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let a = p.expectOpenClose("img", {src: "pic.jpg"});
            assert.equal(a.src, "pic.jpg");
        });
        it("throws an exception if the next token is open with matching tag and different attributes", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpenClose("img", {src: "image.jpg"});
            }, Error, "expect");
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpenClose("a", {href: "index.html"});
            }, Error, "expect");
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.expectOpenClose("a", {href: "index.html"});
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpenClose("a", {href: "index.html"});
            }, Error, "eof");
        });
    });
    describe("p.expectOpenClose(cb)", () => {
        it("calls the cb with the next token if it is an open token followed by a pair close token (after cb execution)", () => {
            let p = new Parser().write("<a href='index.html'>Link</a><br/>").end();
            let res = false;
            p.expectOpenClose(t => {
                res = t.isOpen("a");
                p.expectText();
            });
            p.expectOpen("br");
            assert.equal(res, true);
        });
        it("throws an exception if the next token is an open not followed by a pair close token", () => {
            let p = new Parser().write("<p><br/></p>").end();
            assert.throws(() => {
                p.expectOpenClose(() => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if the next token is not open", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            assert.throws(() => {
                p.expectOpenClose(() => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpenClose(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.expectOpenClose(tag, {}, cb)", () => {
        it("calls the cb with the attributes of next token if it is an open token with the same tag if it is followed by a pair close token (after cb execution)", () => {
            let p = new Parser().write("<a href='index.html'>Link</a><br/>").end();
            let res = false;
            p.expectOpenClose("a", {}, a => {
                res = a.href === "index.html";
                p.expectText();
            });
            p.expectOpen("br");
            assert.equal(res, true);
        });
        it("throws an exception if the next token is open with the same tag not followed by a pair close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            assert.throws(() => {
                p.expectOpenClose("a", {}, () => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpenClose("a", {}, () => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            assert.throws(() => {
                p.expectOpenClose("a", {}, () => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpenClose("a", {}, () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.expectOpenClose(tag, match, cb)", () => {
        it("calls the cb returns the attributes of the next token if it is an open token with the same tag and matching attributes if it is followed by a pair close token (after cb execution)", () => {
            let p = new Parser().write("<a href='index.html'>Link</a><br/>").end();
            let res = false;
            p.expectOpenClose("a", {href: "index.html"}, a => {
                res = a.href === "index.html";
                p.expectText();
            });
            p.expectOpen("br");
            assert.equal(res, true);
        });
        it("throws an exception if the next token is open with matching tag and different attributes", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpenClose("img", {src: "image.jpg"}, () => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpenClose("a", {href: "index.html"}, () => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.expectOpenClose("a", {href: "index.html"}, () => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpenClose("a", {href: "index.html"}, () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });


    describe("p.expectText()", () => {
        it("returns the text of the next token if it is a text token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            let text = p.expectText();
            assert.equal(text, "Link");
        });
        it("throws an exception if the next token is not text", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.expectText();
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectText();
            }, Error, "eof");
        });
    });
    describe("p.expectText(match)", () => {
        it("returns the text of the next token if it is a text token with matching text", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            let text = p.expectText("Link");
            assert.equal(text, "Link");
        });
        it("throws an exception if the next token is text with non-matching text", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            assert.throws(() => {
                p.expectText("Click here");
            }, Error, "expect");
        });
        it("throws an exception if the next token is not text", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectText("Link");
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectText("Text");
            }, Error, "eof");
        });
    });
    describe("p.expectText(cb)", () => {
        it("calls cb with the text of the next token if it is a text token", (done) => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.expectText(text => {
                assert.equal(text, "Link");
                done();
            });
        });
        it("throws an exception if the next token is not text", () => {
            let p = new Parser().write("<a></a>").end();
            assert.throws(() => {
                p.expectText(() => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectText(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.expectText(match, cb)", () => {
        it("calls cb with the text of the next token if it is a text token with matching text", (done) => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.expectText("Link", text => {
                assert.equal(text, "Link");
                done();
            });
        });
        it("throws an exception if the next token is text with non-matching text", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            assert.throws(() => {
                p.expectText("Click here", () => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if the next token is not text", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectText("Link", () => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectText("Text", () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.expectComment()", () => {
        it("returns the text of the next token if it is a comment token", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            let text = p.expectComment();
            assert.equal(text.trim(), "Comment");
        });
        it("throws an exception if the next token is not comment", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.expectComment();
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectComment();
            }, Error, "eof");
        });
    });
    describe("p.expectComment(match)", () => {
        it("returns the text of the next token if it is a comment token with matching text", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            let text = p.expectComment(/^\s*Comment\s*$/);
            assert.equal(text.trim(), "Comment");
        });
        it("throws an exception if the next token is comment with non-matching text", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            assert.throws(() => {
                p.expectComment(/^\s*Click here\s*$/);
            }, Error, "expect");
        });
        it("throws an exception if the next token is not comment", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectComment("Link");
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectComment("Comment");
            }, Error, "eof");
        });
    });
    describe("p.expectComment(cb)", () => {
        it("calls cb with the text of the next token if it is a comment token", (done) => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.expectComment(text => {
                assert.equal(text.trim(), "Comment");
                done();
            });
        });
        it("throws an exception if the next token is not comment", () => {
            let p = new Parser().write("<a></a>").end();
            assert.throws(() => {
                p.expectComment(() => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectComment(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.expectComment(match, cb)", () => {
        it("calls cb with the text of the next token if it is a comment token with matching text", (done) => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.expectComment(/^\s*Comment\s*$/, text => {
                assert.equal(text.trim(), "Comment");
                done();
            });
        });
        it("throws an exception if the next token is comment with non-matching text", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            assert.throws(() => {
                p.expectComment(/\s*Click here\s*/, () => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if the next token is not comment", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectComment("Link", () => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectComment("Comment", () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.expectCommentEnd()", () => {
        it("returns the next token if it is a comment end token", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            let t = p.expectCommentEnd();
            assert.equal(t.isCommentEnd(), true);
        });
        it("throws an exception if the next token is not comment end", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            assert.throws(() => {
                p.expectCommentEnd();
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectCommentEnd();
            }, Error, "eof");
        });
    });
    describe("p.expectCommentEnd(cb)", () => {
        it("calls cb with the next token if it is a comment end token", (done) => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            p.expectCommentEnd(t => {
                assert.equal(t.isCommentEnd(), true);
                done();
            });
        });
        it("throws an exception if the next token is not comment end", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            assert.throws(() => {
                p.expectCommentEnd(() => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectCommentEnd(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });


    describe("p.expectEnd()", () => {
        it("returns the next token if it is an end token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            let t = p.expectEnd();
            assert.equal(t.isEnd(), true);
        });
        it("throws an exception if the next token is not an end token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectEnd();
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectEnd();
            }, Error, "eof");
        });
    });
    describe("p.expectEnd(cb)", () => {
        it("calls cb with the next token if it is an end token", (done) => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.expectEnd(t => {
                assert.equal(t.isEnd(), true);
                done();
            });
        });
        it("throws an exception if the next token is not an end token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectEnd(() => { /*do nothing*/ });
            }, Error, "expect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectEnd(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.skipToOpen()", () => {
        it("skips to the next open token", () => {
            let p = new Parser().write("<!-- Comment --><a href='index.html'>Link</a>").end();
            let t = p.skipToOpen();
            assert.equal(t.isOpen("a", {href: "index.html"}), true);
            assert.doesNotThrow(() => {
                p.expectText(/\s*Link\s*/);
                p.expectClose("a");
            });
        });
        it("throws an exception if there are no more open tokens", () => {
            let p = new Parser().write("<!-- Comment --><!-- Comment -->").end();
            assert.throws(() => {
                p.skipToOpen();
            }, Error, "eof");
        });
    });
    describe("p.skipToOpen(tag)", () => {
        it("skips to the next open token with the same tag and returns its attributes", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            let a = p.skipToOpen("img");
            assert.equal(a.src, "pic.jpg");
            assert.doesNotThrow(() => {
                p.expectClose("img");
            });
        });
        it("throws an exception if there are no more open tokens with the same tag", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.skipToOpen("a");
            }, Error, "eof");
        });
    });
    describe("p.skipToOpen(tag, match)", () => {
        it("skips to the next open token with the same tag and and matching attributes and returns its attributes", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            let a = p.skipToOpen("img", {src: "pic.jpg"});
            assert.equal(a.src, "pic.jpg");
            assert.doesNotThrow(() => {
                p.expectClose("img");
            });
        });
        it("throws an exception if there are no more open tokens with the same tag and matching attributes", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.skipToOpen("img", {src: "image.jpg"});
            }, Error, "eof");
        });
    });
    describe("p.skipToOpen(cb)", () => {
        it("skips to the next open token with the same tag and calls cb with its attributes", (done) => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            p.skipToOpen("img", a => {
                assert.equal(a.src, "pic.jpg");
                done();
            });
            assert.doesNotThrow(() => {
                p.expectClose("img");
            });
        });
        it("throws an exception if there are no more open tokens with the same tag", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.skipToOpen("a", () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.skipToOpen(tag, {}, cb)", () => {
        it("skips to the next open token with the same tag and calls cb with its attributes", (done) => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            p.skipToOpen("img", a => {
                assert.equal(a.src, "pic.jpg");
                done();
            });
            assert.doesNotThrow(() => {
                p.expectClose("img");
            });
        });
        it("throws an exception if there are no more open tokens with the same tag", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.skipToOpen("a", {}, () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.skipToOpen(tag, match, cb)", () => {
        it("skips to the next open token with the same tag and and matching attributes and returns its attributes", (done) => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            p.skipToOpen("img", {src: "pic.jpg"}, a => {
                assert.equal(a.src, "pic.jpg");
                done();
            });
            assert.doesNotThrow(() => {
                p.expectClose("img");
            });
        });
        it("throws an exception if there are no more open tokens with the same tag and matching attributes", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.skipToOpen("img", {src: "image.jpg"}, () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });


    describe("p.skipToClose()", () => {
        it("skips to the next close token", () => {
            let p = new Parser().write("<!-- Comment --><a href='index.html'>Link</a><br/>").end();
            let t = p.skipToClose();
            assert.equal(t.isClose("a"), true);
            assert.doesNotThrow(() => {
                p.expectOpenClose("br");
            });
        });
        it("throws an exception if there are no more close tokens", () => {
            let p = new Parser().write("<!-- Comment --><!-- Comment -->").end();
            assert.throws(() => {
                p.skipToClose();
            }, Error, "eof");
        });
    });
    describe("p.skipToClose(tag)", () => {
        it("skips to the next close token with the same tag", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'><br/>").end();
            let t = p.skipToClose("img");
            assert.equal(t.isClose("img"), true);
            assert.doesNotThrow(() => {
                p.expectOpenClose("br");
            });
        });
        it("throws an exception if there are no more close tokens with the same tag", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.skipToClose("a");
            }, Error, "eof");
        });
    });
    describe("p.skipToClose(cb)", () => {
        it("skips to the next close and calls cb with it", () => {
            let p = new Parser().write("<!-- Comment --><a href='index.html'>Link</a><br/>").end();
            let res = false;
            p.skipToClose(t => {
                res = t.isClose("a");
            });
            assert.equal(res, true);
            assert.doesNotThrow(() => {
                p.expectOpenClose("br");
            });
        });
        it("throws an exception if there are no more close tokens with the same tag", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.skipToClose("a", () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.skipToClose(tag, cb)", () => {
        it("skips to the next close token with the same tag and calls cb with it", () => {
            let p = new Parser().write("<!-- Comment --><br/><a href='index.html'>Link</a><br/>").end();
            let res = false;
            p.skipToClose("a", t => {
                res = t.isClose("a");
            });
            assert.equal(res, true);
            assert.doesNotThrow(() => {
                p.expectOpenClose("br");
            });
        });
        it("throws an exception if there are no more close tokens with the same tag", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.skipToClose("a", {}, () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });


    describe("p.next()", () => {
        it("jumps to the next token and returns it", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            let t = p.next();
            assert.equal(t.isComment(/^\s*Comment\s*$/), true);
            t = p.next();
            assert.equal(t.isCommentEnd(), true);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            assert.doesNotThrow(() => {
                p.next();
                p.next();
                p.next();
            });
            assert.throws(() => {
                p.next();
            }, Error, "eof");
        });
    });
    describe("p.next(cb)", () => {
        it("jumps to the next token and calls cb with it", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            p.next(t => {
                if (t.isComment(/^\s*Comment\s*$/)) {
                    p.next(t2 => {
                        assert.equal(t2.isCommentEnd(), true);
                    });
                }
            });

        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            assert.doesNotThrow(() => {
                p.next(() => { /*do nothing*/ });
                p.next(() => { /*do nothing*/ });
                p.next(() => { /*do nothing*/ });
            });
            assert.throws(() => {
                p.next(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.peekExpectOpen()", () => {
        it("returns the next token if it is an open token", () => {
            let p = new Parser().write("<a>").end();
            let t = p.peekExpectOpen();
            assert.equal(t.isOpen(), true);
            let t2 = p.expectOpen();
            assert.deepEqual(t, t2);
        });
        it("throws an exception if the next token is not open", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen();
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen();
            }, Error, "eof");
        });
    });
    describe("p.peekExpectOpen(tag)", () => {
        it("returns the attributes of the next token if it is an open token with the same tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let a = p.peekExpectOpen("img");
            assert.equal(a.src, "pic.jpg");
            let a2 = p.expectOpen("img");
            assert.deepEqual(a, a2);
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekExpectOpen("a");
            }, Error, "peekExpect");
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen("a");
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen("a");
            }, Error, "eof");
        });
    });
    describe("p.peekExpectOpen(tag, match)", () => {
        it("returns the attributes of the next token if it is an open token with the same tag and matching attributes", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let a = p.peekExpectOpen("img", {src: "pic.jpg"});
            assert.equal(a.src, "pic.jpg");
            let a2 = p.expectOpen("img", {src: "pic.jpg"});
            assert.deepEqual(a, a2);

        });
        it("throws an exception if the next token is open with matching tag and different attributes", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekExpectOpen("img", {src: "image.jpg"});
            }, Error, "peekExpect");
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekExpectOpen("a", {href: "index.html"});
            }, Error, "peekExpect");
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen("a", {href: "index.html"});
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen("a", {href: "index.html"});
            }, Error, "eof");
        });
    });
    describe("p.peekExpectOpen(cb)", () => {
        it("calls cb with the next token if it is an open token", (done) => {
            let p = new Parser().write("<a>").end();
            p.peekExpectOpen(t => {
                assert.equal(t.isOpen(), true);
                let t2 = p.expectOpen();
                assert.deepEqual(t, t2);
                done();
            });
        });
        it("throws an exception if the next token is not open", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen(() => { /*do nothing*/ });
            }, Error, "peekExpect");

        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.peekExpectOpen(tag, {}, cb)", () => {
        it("calls cb with the attributes of the next token if it is an open token with the same tag", (done) => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            p.peekExpectOpen("img", {}, a => {
                assert.equal(a.src, "pic.jpg");
                let a2 = p.expectOpen("img", {});
                assert.deepEqual(a, a2);
                done();
            });
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekExpectOpen("a", {}, () => { /*do nothing*/ });
            }, Error, "peekExpect");
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen("img", {}, () => { /*do nothing*/ });
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen("img", {}, () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.peekExpectOpen(tag, match, cb)", () => {
        it("calls cb with the attributes of the next token if it is an open token with the same tag and matching attributes", (done) => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            p.peekExpectOpen("img", {src: "pic.jpg"}, a => {
                assert.equal(a.src, "pic.jpg");
                let a2 = p.expectOpen("img", {src: "pic.jpg"});
                assert.deepEqual(a, a2);
                done();
            });
        });
        it("throws an exception if the next token is open with matching tag and different attributes", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekExpectOpen("img", {src: "image.jpg"}, () => { /*do nothing*/ });
            }, Error, "peekExpect");
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekExpectOpen("a", {href: "index.html"}, () => { /*do nothing*/ });
            }, Error, "peekExpect");
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen("a", {href: "index.html"}, () => { /*do nothing*/ });
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen("a", {href: "index.html"}, () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.peekExpectClose()", () => {
        it("returns the next token if it is a close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            let t = p.peekExpectClose();
            assert.equal(t.isClose(), true);
            let t2 = p.expectClose();
            assert.deepEqual(t, t2);
        });
        it("throws an exception if the next token is not close", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            assert.throws(() => {
                p.peekExpectClose();
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectClose();
            }, Error, "eof");
        });
    });
    describe("p.peekExpectClose(tag)", () => {
        it("returns the next token if it is a close token with the same tag", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            let t = p.peekExpectClose("a");
            assert.equal(t.isClose(), true);
            let t2 = p.expectClose("a");
            assert.deepEqual(t, t2);
        });
        it("throws an exception if the next token is close with a different tag", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectClose("img");
            }, Error, "peekExpect");
        });
        it("throws an exception if the next is not an close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            assert.throws(() => {
                p.peekExpectClose("a");
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectClose("a");
            }, Error, "eof");
        });
    });
    describe("p.peekExpectClose(cb)", () => {
        it("calls cb with the next token if it is a close token", (done) => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.peekExpectClose(t => {
                assert.equal(t.isClose(), true);
                let t2 = p.expectClose();
                assert.deepEqual(t, t2);
                done();
            });
        });
        it("throws an exception if the next token is not close", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            assert.throws(() => {
                p.peekExpectClose(() => { /*do nothing*/ });
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectClose(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.peekExpectClose(tag, cb)", () => {
        it("calls cb with the next token if it is a close token with the same tag", (done) => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.peekExpectClose("a", t => {
                assert.equal(t.isClose(), true);
                let t2 = p.expectClose("a");
                assert.deepEqual(t, t2);
                done();
            });
        });
        it("throws an exception if the next token is close with a different tag", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectClose("img", () => { /*do nothing*/ });
            }, Error, "peekExpect");
        });
        it("throws an exception if the next is not an close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            assert.throws(() => {
                p.peekExpectClose("a", () => { /*do nothing*/ });
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectClose("a", () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.peekExpectText()", () => {
        it("returns the text of the next token if it is a text token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            let text = p.peekExpectText();
            assert.equal(text, "Link");
            let text2 = p.expectText();
            assert.equal(text, text2);
        });
        it("throws an exception if the next token is not text", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.peekExpectText();
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectText();
            }, Error, "eof");
        });
    });
    describe("p.peekExpectText(match)", () => {
        it("returns the text of the next token if it is a text token with matching text", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            let text = p.peekExpectText("Link");
            assert.equal(text, "Link");
            let text2 = p.expectText("Link");
            assert.equal(text, text2);
        });
        it("throws an exception if the next token is text with non-matching text", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            assert.throws(() => {
                p.peekExpectText("Click here");
            }, Error, "peekExpect");
        });
        it("throws an exception if the next token is not text", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekExpectText("Link");
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectText("Text");
            }, Error, "eof");
        });
    });
    describe("p.peekExpectText(cb)", () => {
        it("calls cb with the text of the next token if it is a text token", (done) => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.peekExpectText(text => {
                assert.equal(text, "Link");
                let text2 = p.expectText("Link");
                assert.equal(text, text2);
                done();
            });
        });
        it("throws an exception if the next token is not text", () => {
            let p = new Parser().write("<a></a>").end();
            assert.throws(() => {
                p.peekExpectText(() => { /*do nothing*/ });
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectText(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.peekExpectText(match, cb)", () => {
        it("calls cb with the text of the next token if it is a text token with matching text", (done) => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.peekExpectText("Link", text => {
                assert.equal(text, "Link");
                let text2 = p.expectText("Link");
                assert.equal(text, text2);
                done();
            });
        });
        it("throws an exception if the next token is text with non-matching text", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            assert.throws(() => {
                p.peekExpectText("Click here", () => { /*do nothing*/ });
            }, Error, "peekExpect");
        });
        it("throws an exception if the next token is not text", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekExpectText("Link", () => { /*do nothing*/ });
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectText("Text", () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.peekExpectComment()", () => {
        it("returns the text of the next token if it is a comment token", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            let text = p.peekExpectComment();
            assert.equal(text.trim(), "Comment");
            let text2 = p.expectComment();
            assert.equal(text, text2);
        });
        it("throws an exception if the next token is not comment", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.peekExpectComment();
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectComment();
            }, Error, "eof");
        });
    });
    describe("p.peekExpectComment(match)", () => {
        it("returns the text of the next token if it is a comment token with matching text", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            let text = p.peekExpectComment(/^\s*Comment\s*$/);
            assert.equal(text.trim(), "Comment");
            let text2 = p.expectComment(/^\s*Comment\s*$/);
            assert.equal(text, text2);
        });
        it("throws an exception if the next token is comment with non-matching text", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            assert.throws(() => {
                p.peekExpectComment(/^\s*Click here\s*$/);
            }, Error, "peekExpect");
        });
        it("throws an exception if the next token is not comment", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekExpectComment("Link");
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectComment("Comment");
            }, Error, "eof");
        });
    });
    describe("p.peekExpectComment(cb)", () => {
        it("calls cb with the text of the next token if it is a comment token", (done) => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.peekExpectComment(text => {
                assert.equal(text.trim(), "Comment");
                let text2 = p.expectComment();
                assert.equal(text, text2);
                done();
            });
        });
        it("throws an exception if the next token is not comment", () => {
            let p = new Parser().write("<a></a>").end();
            assert.throws(() => {
                p.peekExpectComment(() => { /*do nothing*/ });
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectComment(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.peekExpectComment(match, cb)", () => {
        it("calls cb with the text of the next token if it is a comment token with matching text", (done) => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.peekExpectComment(/^\s*Comment\s*$/, text => {
                assert.equal(text.trim(), "Comment");
                let text2 = p.expectComment(/^\s*Comment\s*$/);
                assert.equal(text, text2);
                done();
            });
        });
        it("throws an exception if the next token is comment with non-matching text", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            assert.throws(() => {
                p.peekExpectComment(/\s*Click here\s*/, () => { /*do nothing*/ });
            }, Error, "peekExpect");
        });
        it("throws an exception if the next token is not comment", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekExpectComment("Link", () => { /*do nothing*/ });
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectComment("Comment", () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.peekExpectCommentEnd()", () => {
        it("returns the next token if it is a comment end token", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            let t = p.peekExpectCommentEnd();
            assert.equal(t.isCommentEnd(), true);
            let t2 = p.expectCommentEnd();
            assert.deepEqual(t, t2);
        });
        it("throws an exception if the next token is not comment end", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            assert.throws(() => {
                p.peekExpectCommentEnd();
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectCommentEnd();
            }, Error, "eof");
        });
    });
    describe("p.peekExpectCommentEnd(cb)", () => {
        it("calls cb with the next token if it is a comment end token", (done) => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            p.peekExpectCommentEnd(t => {
                assert.equal(t.isCommentEnd(), true);
                let t2 = p.expectCommentEnd();
                assert.deepEqual(t, t2);
                done();
            });
        });
        it("throws an exception if the next token is not comment end", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            assert.throws(() => {
                p.peekExpectCommentEnd(() => { /*do nothing*/ });
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectCommentEnd(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });


    describe("p.peekExpectEnd()", () => {
        it("returns the next token if it is an end token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            let t = p.peekExpectEnd();
            assert.equal(t.isEnd(), true);
            let t2 = p.expectEnd();
            assert.deepEqual(t, t2);
        });
        it("throws an exception if the next token is not an end token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectEnd();
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectEnd();
            }, Error, "eof");
        });
    });
    describe("p.peekExpectEnd(cb)", () => {
        it("calls cb with the next token if it is an end token", (done) => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.peekExpectEnd(t => {
                assert.equal(t.isEnd(), true);
                let t2 = p.expectEnd();
                assert.deepEqual(t, t2);
                done();
            });
        });
        it("throws an exception if the next token is not an end token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectEnd(() => { /*do nothing*/ });
            }, Error, "peekExpect");
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectEnd(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.peekSkipToOpen()", () => {
        it("skips to the next open token", () => {
            let p = new Parser().write("<!-- Comment --><a href='index.html'>Link</a>").end();
            let t = p.peekSkipToOpen();
            assert.equal(t.isOpen("a", {href: "index.html"}), true);
            assert.doesNotThrow(() => {
                let t2 = p.expectOpen();
                assert.deepEqual(t, t2);
            });
        });
        it("throws an exception if there are no more open tokens", () => {
            let p = new Parser().write("<!-- Comment --><!-- Comment -->").end();
            assert.throws(() => {
                p.peekSkipToOpen();
            }, Error, "eof");
        });
    });
    describe("p.peekSkipToOpen(tag)", () => {
        it("skips to the next open token with the same tag and returns its attributes", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            let a = p.peekSkipToOpen("img");
            assert.equal(a.src, "pic.jpg");
            assert.doesNotThrow(() => {
                let a2 = p.expectOpen("img");
                assert.deepEqual(a, a2);
            });
        });
        it("throws an exception if there are no more open tokens with the same tag", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekSkipToOpen("a");
            }, Error, "eof");
        });
    });
    describe("p.peekSkipToOpen(tag, match)", () => {
        it("skips to the next open token with the same tag and and matching attributes and returns its attributes", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            let a = p.peekSkipToOpen("img", {src: "pic.jpg"});
            assert.equal(a.src, "pic.jpg");
            assert.doesNotThrow(() => {
                let a2 = p.expectOpen("img", {src: "pic.jpg"});
                assert.deepEqual(a, a2);
            });
        });
        it("throws an exception if there are no more open tokens with the same tag and matching attributes", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekSkipToOpen("img", {src: "image.jpg"});
            }, Error, "eof");
        });
    });
    describe("p.peekSkipToOpen(cb)", () => {
        it("skips to the next open token with the same tag and calls cb with its attributes", (done) => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            p.peekSkipToOpen("img", a => {
                assert.equal(a.src, "pic.jpg");
                done();
            });
            assert.doesNotThrow(() => {
                p.expectClose("img");
            });
        });
        it("throws an exception if there are no more open tokens with the same tag", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekSkipToOpen("a", () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.peekSkipToOpen(tag, {}, cb)", () => {
        it("skips to the next open token with the same tag and calls cb with its attributes", (done) => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            p.peekSkipToOpen("img", a => {
                assert.equal(a.src, "pic.jpg");
                done();
            });
            assert.doesNotThrow(() => {
                p.expectClose("img");
            });
        });
        it("throws an exception if there are no more open tokens with the same tag", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekSkipToOpen("a", {}, () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.peekSkipToOpen(tag, match, cb)", () => {
        it("skips to the next open token with the same tag and and matching attributes and returns its attributes", (done) => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            p.peekSkipToOpen("img", {src: "pic.jpg"}, a => {
                assert.equal(a.src, "pic.jpg");
                done();
            });
            assert.doesNotThrow(() => {
                p.expectClose("img");
            });
        });
        it("throws an exception if there are no more open tokens with the same tag and matching attributes", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekSkipToOpen("img", {src: "image.jpg"}, () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });


    describe("p.peekSkipToClose()", () => {
        it("skips to the next close token", () => {
            let p = new Parser().write("<!-- Comment --><a href='index.html'>Link</a><br/>").end();
            let t = p.peekSkipToClose();
            assert.equal(t.isClose("a"), true);
            assert.doesNotThrow(() => {
                let t2 = p.expectClose("a");
                assert.deepEqual(t, t2);
            });
        });
        it("throws an exception if there are no more close tokens", () => {
            let p = new Parser().write("<!-- Comment --><!-- Comment -->").end();
            assert.throws(() => {
                p.peekSkipToClose();
            }, Error, "eof");
        });
    });
    describe("p.peekSkipToClose(tag)", () => {
        it("skips to the next close token with the same tag", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'><br/>").end();
            let t = p.peekSkipToClose("img");
            assert.equal(t.isClose("img"), true);
            assert.doesNotThrow(() => {
                let t2 = p.expectClose("img");
                assert.deepEqual(t, t2);
            });
        });
        it("throws an exception if there are no more close tokens with the same tag", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekSkipToClose("a");
            }, Error, "eof");
        });
    });
    describe("p.peekSkipToClose(cb)", () => {
        it("skips to the next close and calls cb with it", (done) => {
            let p = new Parser().write("<!-- Comment --><a href='index.html'>Link</a><br/>").end();
            p.peekSkipToClose(t => {
                assert.equal(t.isClose("a"), true);
                let t2 = p.expectClose();
                assert.deepEqual(t, t2);
                done();
            });
        });
        it("throws an exception if there are no more close tokens with the same tag", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekSkipToClose("a", () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.peekSkipToClose(tag, cb)", () => {
        it("skips to the next close token with the same tag and calls cb with it", (done) => {
            let p = new Parser().write("<!-- Comment --><br/><a href='index.html'>Link</a><br/>").end();
            p.peekSkipToClose("a", t => {
                assert.equal(t.isClose("a"), true);
                let t2 = p.expectClose("a");
                assert.deepEqual(t, t2);
                done();
            });
        });
        it("throws an exception if there are no more close tokens with the same tag", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekSkipToClose("a", {}, () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.peekIter(cb)", () => {
        it("iterates over tokens until cb returns false", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            let cb = 0;
            p.peekIter(t => {
                switch (true) {
                case t.isOpen("a", {href: "index.html"}):
                case t.isText("Link"):
                    p.next();
                    cb++;
                    break;
                case t.isClose("a"):
                    return false;
                }
                return true;
            });
            let t = p.peek();
            assert.equal(t.isClose("a"), true);
            assert.equal(cb, 2);
        });
        it("throws an exception if cb did not move any tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            let cb = 0;
            assert.throws(() => {
                p.peekIter(t => {
                    switch (true) {
                    case t.isOpen("a", {href: "index.html"}):
                    case t.isText("Link"):
                        cb++;
                        break;
                    case t.isClose("a"):
                        return false;
                    }
                    return true;
                });
            }, Error, "iter");
            assert.equal(cb, 1);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            let cb = 0;
            assert.throws(() => {
                p.peekIter(() => {
                    p.next();
                    cb++;
                });
            }, Error, "eof");
            assert.equal(cb, 4);
        });
    });



    describe("p.peek()", () => {
        it("returns the next token but does not jump on it", () => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            let t = p.peek();
            assert.equal(t.isComment(/^\s*Comment\s*$/), true);
            let t2 = p.next();
            assert.deepEqual(t, t2);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            assert.doesNotThrow(() => {
                p.next();
                p.next();
                p.next();
            });
            assert.throws(() => {
                p.peek();
            }, Error, "eof");
        });
    });
    describe("p.peek(cb)", () => {
        it("calls cb with the next token but does not jump on it", (done) => {
            let p = new Parser().write("<!-- Comment --><<img src='pic.jpg'>").end();
            p.peek(t => {
                if (t.isComment(/^\s*Comment\s*$/)) {
                    p.next(t2 => {
                        assert.deepEqual(t, t2);
                        done();
                    });
                }
            });

        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            assert.doesNotThrow(() => {
                p.next(() => { /*do nothing*/ });
                p.next(() => { /*do nothing*/ });
                p.next(() => { /*do nothing*/ });
            });
            assert.throws(() => {
                p.peek(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.ifOpen()", () => {
        it("returns the next token if it is an open token", () => {
            let p = new Parser().write("<a>").end();
            let t = p.ifOpen();
            assert.equal(t.isOpen(), true);
        });
        it("returns false if the next token is not open", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            let r = p.ifOpen();
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifOpen();
            }, Error, "eof");
        });
    });
    describe("p.ifOpen(tag)", () => {
        it("returns the attributes of the next token if it is an open token with the same tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let a = p.ifOpen("img");
            assert.equal(a.src, "pic.jpg");
        });
        it("returns false if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let r = p.ifOpen("a");
            assert.equal(r, false);
        });
        it("returns false if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            let r = p.ifOpen("a");
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifOpen("a");
            }, Error, "eof");
        });
    });
    describe("p.ifOpen(tag, match)", () => {
        it("returns the attributes of the next token if it is an open token with the same tag and matching attributes", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let a = p.ifOpen("img", {src: "pic.jpg"});
            assert.equal(a.src, "pic.jpg");
        });
        it("returns false if the next token is open with matching tag and different attributes", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let r = p.ifOpen("img", {src: "image.jpg"});
            assert.equal(r, false);
        });
        it("returns false if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let r = p.ifOpen("a", {href: "index.html"});
            assert.equal(r, false);
        });
        it("returns false if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            let r = p.ifOpen("a", {href: "index.html"});
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifOpen("a", {href: "index.html"});
            }, Error, "eof");
        });
    });
    describe("p.ifOpen(cb)", () => {
        it("calls cb with the next token if it is an open token", () => {
            let p = new Parser().write("<a>").end();
            let cb = false;
            let r = p.ifOpen(t => {
                assert.equal(t.isOpen(), true);
                cb = true;
            });
            assert.equal(cb, true);
            assert.equal(r, true);
        });
        it("returns false if the next token is not open", () => {
            let p = new Parser().write("<a></a>").end();
            let cb = false;
            p.next();
            let r = p.ifOpen(() => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifOpen(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.ifOpen(tag, {}, cb)", () => {
        it("calls cb with the attributes of the next token if it is an open token with the same tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let cb = false;
            let r = p.ifOpen("img", {}, a => {
                assert.equal(a.src, "pic.jpg");
                cb = true;
            });
            assert.equal(cb, true);
            assert.equal(r, true);
        });
        it("returns false if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let cb = false;
            let r = p.ifOpen("a", {}, () => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("returns false if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            let cb = false;
            let r = p.ifOpen("img", {}, () => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifOpen("img", {}, () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.ifOpen(tag, match, cb)", () => {
        it("calls cb with the attributes of the next token if it is an open token with the same tag and matching attributes", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let cb = false;
            let r = p.ifOpen("img", {src: "pic.jpg"}, a => {
                assert.equal(a.src, "pic.jpg");
                cb = true;
            });
            assert.equal(cb, true);
            assert.equal(r, true);
        });
        it("returns false if the next token is open with matching tag and different attributes", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let cb = false;
            let r = p.ifOpen("img", {src: "image.jpg"}, () => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("returns false if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let cb = false;
            let r = p.ifOpen("a", {href: "index.html"}, () => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("returns false if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            let cb = false;
            let r = p.ifOpen("a", {href: "index.html"}, () => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifOpen("a", {href: "index.html"}, () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.ifClose()", () => {
        it("returns the next token if it is a close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            let t = p.ifClose();
            assert.equal(t.isClose(), true);
        });
        it("returns false if the next token is not close", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            let r = p.ifClose();
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifClose();
            }, Error, "eof");
        });
    });
    describe("p.ifClose(tag)", () => {
        it("returns the next token if it is a close token with the same tag", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            let t = p.ifClose("a");
            assert.equal(t.isClose(), true);
        });
        it("returns false if the next token is close with a different tag", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            let r = p.ifClose("img");
            assert.equal(r, false);
        });
        it("returns false if the next is not an close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            let r = p.ifClose("a");
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifClose("a");
            }, Error, "eof");
        });
    });
    describe("p.ifClose(cb)", () => {
        it("calls cb with the next token if it is a close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            let cb = false;
            let r = p.ifClose(t => {
                assert.equal(t.isClose(), true);
                cb = true;
            });
            assert.equal(cb, true);
            assert.equal(r, true);
        });
        it("returns false if the next token is not close", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            let cb = false;
            let r = p.ifClose(() => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifClose(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.ifClose(tag, cb)", () => {
        it("calls cb with the next token if it is a close token with the same tag", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            let cb = false;
            let r = p.ifClose("a", t => {
                assert.equal(t.isClose(), true);
                cb = true;
            });
            assert.equal(cb, true);
            assert.equal(r, true);
        });
        it("returns false if the next token is close with a different tag", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            let cb = false;
            let r = p.ifClose("img", () => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("returns false if the next is not an close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            let cb = false;
            let r = p.ifClose("a", () => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifClose("a", () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.ifOpenClose()", () => {
        it("returns the next token if it is an open token followed by a close token pair", () => {
            let p = new Parser().write("<br/>").end();
            let t = p.ifOpenClose();
            assert.equal(t.isOpen(), true);
        });
        it("throws an exception if the next token is an open token not followed by a close token pair", () => {
            let p = new Parser().write("<section></p>").end();
            assert.throws(() => {
                p.ifOpenClose();
            }, Error, "expect");
        });
        it("returns false if the next token is not open", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            let r = p.ifOpenClose();
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifOpenClose();
            }, Error, "eof");
        });
    });
    describe("p.ifOpenClose(tag)", () => {
        it("returns the attributes of the next token if it is an open token with the same tag if it is followed by a pair close token", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let a = p.ifOpenClose("img");
            assert.equal(a.src, "pic.jpg");
        });
        it("throws an exception if the next token is open with the same tag not followed by a pair close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            assert.throws(() => {
                p.ifOpenClose("a");
            }, Error, "expect");
        });
        it("returns false if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let r = p.ifOpenClose("a");
            assert.equal(r, false);
        });
        it("returns false if the next is not an open token", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            let r = p.ifOpenClose("a");
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifOpenClose("a");
            }, Error, "eof");
        });
    });
    describe("p.ifOpenClose(tag, match)", () => {
        it("returns the attributes of the next token if it is an open token with the same tag and matching attributes", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let a = p.ifOpenClose("img", {src: "pic.jpg"});
            assert.equal(a.src, "pic.jpg");
        });
        it("returns false if the next token is open with matching tag and different attributes", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let r = p.ifOpenClose("img", {src: "image.jpg"});
            assert.equal(r, false);
        });
        it("returns false if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let r = p.ifOpenClose("a", {href: "index.html"});
            assert.equal(r, false);
        });
        it("returns false if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            let r = p.ifOpenClose("a", {href: "index.html"});
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifOpenClose("a", {href: "index.html"});
            }, Error, "eof");
        });
    });
    describe("p.ifOpenClose(cb)", () => {
        it("calls the cb with the next token if it is an open token followed by a pair close token (after cb execution)", () => {
            let p = new Parser().write("<a href='index.html'>Link</a><br/>").end();
            let cb = false;
            let r = p.ifOpenClose(t => {
                assert.equal(t.isOpen("a"), true);
                p.expectText();
                cb = true;
            });
            p.expectOpen("br");
            assert.equal(cb, true);
            assert.equal(r, true);
        });
        it("throws an exception if the next token is an open not followed by a pair close token", () => {
            let p = new Parser().write("<p><br/></p>").end();
            assert.throws(() => {
                p.ifOpenClose(() => {
                    p.expectOpen("br");
                });
            }, Error, "expect");
        });
        it("returns false if the next token is not open", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            let cb = false;
            let r = p.ifOpenClose(() => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifOpenClose(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.ifOpenClose(tag, {}, cb)", () => {
        it("calls the cb with the attributes of next token if it is an open token with the same tag if it is followed by a pair close token (after cb execution)", () => {
            let p = new Parser().write("<a href='index.html'>Link</a><br/>").end();
            let cb = false;
            let r = p.ifOpenClose("a", {}, a => {
                assert.equal(a.href, "index.html");
                p.expectText();
                cb = true;
            });
            p.expectOpen("br");
            assert.equal(cb, true);
            assert.equal(r, true);
        });
        it("throws an exception if the next token is open with the same tag not followed by a pair close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            assert.throws(() => {
                p.ifOpenClose("a", {}, () => {
                    p.expectOpen("br");
                });
            }, Error, "expect");
        });
        it("returns false if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let cb = false;
            let r = p.ifOpenClose("a", {}, () => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("returns false if the next is not an open token", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            let cb = false;
            let r = p.ifOpenClose("a", {}, () => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifOpenClose("a", {}, () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.ifOpenClose(tag, match, cb)", () => {
        it("calls the cb returns the attributes of the next token if it is an open token with the same tag and matching attributes if it is followed by a pair close token (after cb execution)", () => {
            let p = new Parser().write("<a href='index.html'>Link</a><br/>").end();
            let cb = false;
            let r = p.ifOpenClose("a", {href: "index.html"}, a => {
                assert.equal(a.href, "index.html");
                p.expectText();
                cb = true;
            });
            p.ifOpen("br");
            assert.equal(cb, true);
            assert.equal(r, true);
        });
        it("returns false if the next token is open with matching tag and different attributes", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let cb = false;
            let r = p.ifOpenClose("img", {src: "image.jpg"}, () => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("returns false if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let cb = false;
            let r = p.ifOpenClose("a", {href: "index.html"}, () => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("returns false if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            let cb = false;
            let r = p.ifOpenClose("a", {href: "index.html"}, () => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifOpenClose("a", {href: "index.html"}, () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.ifText()", () => {
        it("returns the text of the next token if it is a text token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            let text = p.ifText();
            assert.equal(text, "Link");
        });
        it("returns false if the next token is not text", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            let r = p.ifText();
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifText();
            }, Error, "eof");
        });
    });
    describe("p.ifText(match)", () => {
        it("returns the text of the next token if it is a text token with matching text", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            let text = p.ifText("Link");
            assert.equal(text, "Link");
        });
        it("returns false if the next token is text with non-matching text", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            let r = p.ifText("Click here");
            assert.equal(r, false);
        });
        it("returns false if the next token is not text", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let r = p.ifText("Link");
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifText("Text");
            }, Error, "eof");
        });
    });
    describe("p.ifText(cb)", () => {
        it("calls cb with the text of the next token if it is a text token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            let cb = false;
            let r = p.ifText(text => {
                assert.equal(text, "Link");
                cb = true;
            });
            assert.equal(cb, true);
            assert.equal(r, true);
        });
        it("returns false if the next token is not text", () => {
            let p = new Parser().write("<a></a>").end();
            let cb = false;
            let r = p.ifText(() => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifText(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.ifText(match, cb)", () => {
        it("calls cb with the text of the next token if it is a text token with matching text", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            let cb = false;
            let r = p.ifText("Link", text => {
                assert.equal(text, "Link");
                cb = true;
            });
            assert.equal(cb, true);
            assert.equal(r, true);
        });
        it("returns false if the next token is text with non-matching text", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            let cb = false;
            let r = p.ifText("Click here", () => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("returns false if the next token is not text", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let cb = false;
            let r = p.ifText("Link", () => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifText("Text", () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.ifComment()", () => {
        it("returns the text of the next token if it is a comment token", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            let text = p.ifComment();
            assert.equal(text.trim(), "Comment");
        });
        it("returns false if the next token is not comment", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            let r = p.ifComment();
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifComment();
            }, Error, "eof");
        });
    });
    describe("p.ifComment(match)", () => {
        it("returns the text of the next token if it is a comment token with matching text", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            let text = p.ifComment(/^\s*Comment\s*$/);
            assert.equal(text.trim(), "Comment");
        });
        it("returns false if the next token is comment with non-matching text", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            let r = p.ifComment(/^\s*Click here\s*$/);
            assert.equal(r, false);
        });
        it("returns false if the next token is not comment", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let r = p.ifComment("Link");
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifComment("Comment");
            }, Error, "eof");
        });
    });
    describe("p.ifComment(cb)", () => {
        it("calls cb with the text of the next token if it is a comment token", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            let cb = false;
            let r = p.ifComment(text => {
                assert.equal(text.trim(), "Comment");
                cb = true;
            });
            assert.equal(cb, true);
            assert.equal(r, true);
        });
        it("returns false if the next token is not comment", () => {
            let p = new Parser().write("<a></a>").end();
            let cb = false;
            let r = p.ifComment(() => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifComment(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
    describe("p.ifComment(match, cb)", () => {
        it("calls cb with the text of the next token if it is a comment token with matching text", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            let cb = false;
            let r = p.ifComment(/^\s*Comment\s*$/, text => {
                assert.equal(text.trim(), "Comment");
                cb = true;
            });
            assert.equal(cb, true);
            assert.equal(r, true);
        });
        it("returns false if the next token is comment with non-matching text", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            let cb = false;
            let r = p.ifComment(/\s*Click here\s*/, () => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("returns false if the next token is not comment", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            let cb = false;
            let r = p.ifComment("Link", () => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifComment("Comment", () => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.ifCommentEnd()", () => {
        it("returns the next token if it is a comment end token", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            let t = p.ifCommentEnd();
            assert.equal(t.isCommentEnd(), true);
        });
        it("returns false if the next token is not comment end", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            let r = p.ifCommentEnd();
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifCommentEnd();
            }, Error, "eof");
        });
    });
    describe("p.ifCommentEnd(cb)", () => {
        it("calls cb with the next token if it is a comment end token", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            let cb = false;
            let r = p.ifCommentEnd(t => {
                assert.equal(t.isCommentEnd(), true);
                cb = true;
            });
            assert.equal(cb, true);
            assert.equal(r, true);
        });
        it("returns false if the next token is not comment end", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            let cb = false;
            let r = p.ifCommentEnd(() => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifCommentEnd(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });



    describe("p.ifEnd()", () => {
        it("returns the next token if it is an end token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            let t = p.ifEnd();
            assert.equal(t.isEnd(), true);
        });
        it("returns false if the next token is not an end token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            let r = p.ifEnd();
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifEnd();
            }, Error, "eof");
        });
    });
    describe("p.ifEnd(cb)", () => {
        it("calls cb with the next token if it is an end token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            let cb = false;
            let r = p.ifEnd(t => {
                assert.equal(t.isEnd(), true);
                cb = true;
            });
            assert.equal(cb, true);
            assert.equal(r, true);
        });
        it("returns false if the next token is not an end token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            let cb = false;
            let r = p.ifEnd(() => {
                cb = true;
            });
            assert.equal(cb, false);
            assert.equal(r, false);
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.ifEnd(() => { /*do nothing*/ });
            }, Error, "eof");
        });
    });
});

