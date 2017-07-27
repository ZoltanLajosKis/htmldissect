const assert = require('assert');
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpen();
            });
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
            });
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.expectOpen("a");
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpen("a");
            });
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
            });
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpen("a", {href: "index.html"});
            });
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.expectOpen("a", {href: "index.html"});
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpen("a", {href: "index.html"});
            });
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
            });

        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpen(() => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.expectOpen("img", {}, () => { /*do nothing*/ });
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpen("img", {}, () => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpen("a", {href: "index.html"}, () => { /*do nothing*/ });
            });
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.expectOpen("a", {href: "index.html"}, () => { /*do nothing*/ });
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpen("a", {href: "index.html"}, () => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectClose();
            });
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
            });
        });
        it("throws an exception if the next is not an close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            assert.throws(() => {
                p.expectClose("a");
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectClose("a");
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectClose(() => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if the next is not an close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            assert.throws(() => {
                p.expectClose("a", () => { /*do nothing*/ });
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectClose("a", () => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if the next token is not open", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            assert.throws(() => {
                p.expectOpenClose();
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpenClose();
            });
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
            });
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpenClose("a");
            });
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            assert.throws(() => {
                p.expectOpenClose("a");
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpenClose("a");
            });
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
            });
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpenClose("a", {href: "index.html"});
            });
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.expectOpenClose("a", {href: "index.html"});
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpenClose("a", {href: "index.html"});
            });
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
            });
        });
        it("throws an exception if the next token is not open", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            assert.throws(() => {
                p.expectOpenClose(() => { /*do nothing*/ });
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpenClose(() => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpenClose("a", {}, () => { /*do nothing*/ });
            });
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<br/>").end();
            p.next();
            assert.throws(() => {
                p.expectOpenClose("a", {}, () => { /*do nothing*/ });
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpenClose("a", {}, () => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectOpenClose("a", {href: "index.html"}, () => { /*do nothing*/ });
            });
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.expectOpenClose("a", {href: "index.html"}, () => { /*do nothing*/ });
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectOpenClose("a", {href: "index.html"}, () => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectText();
            });
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
            });
        });
        it("throws an exception if the next token is not text", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectText("Link");
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectText("Text");
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectText(() => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if the next token is not text", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectText("Link", () => { /*do nothing*/ });
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectText("Text", () => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectComment();
            });
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
            });
        });
        it("throws an exception if the next token is not comment", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectComment("Link");
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectComment("Comment");
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectComment(() => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if the next token is not comment", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.expectComment("Link", () => { /*do nothing*/ });
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectComment("Comment", () => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectCommentEnd();
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectCommentEnd(() => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectEnd();
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.expectEnd(() => { /*do nothing*/ });
            });
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
            });
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
            });
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
            });
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
            });
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
            });
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
            });
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
            });
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
            });
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
            });
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
            });
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
            });
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
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen();
            });
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
            });
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen("a");
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen("a");
            });
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
            });
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekExpectOpen("a", {href: "index.html"});
            });
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen("a", {href: "index.html"});
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen("a", {href: "index.html"});
            });
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
            });

        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen(() => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen("img", {}, () => { /*do nothing*/ });
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen("img", {}, () => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if the next token is open with a different tag", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekExpectOpen("a", {href: "index.html"}, () => { /*do nothing*/ });
            });
        });
        it("throws an exception if the next is not an open token", () => {
            let p = new Parser().write("<a></a>").end();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen("a", {href: "index.html"}, () => { /*do nothing*/ });
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a>").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectOpen("a", {href: "index.html"}, () => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectClose();
            });
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
            });
        });
        it("throws an exception if the next is not an close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            assert.throws(() => {
                p.peekExpectClose("a");
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectClose("a");
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectClose(() => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if the next is not an close token", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            assert.throws(() => {
                p.peekExpectClose("a", () => { /*do nothing*/ });
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectClose("a", () => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectText();
            });
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
            });
        });
        it("throws an exception if the next token is not text", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekExpectText("Link");
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectText("Text");
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectText(() => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if the next token is not text", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekExpectText("Link", () => { /*do nothing*/ });
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectText("Text", () => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectComment();
            });
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
            });
        });
        it("throws an exception if the next token is not comment", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekExpectComment("Link");
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectComment("Comment");
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectComment(() => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if the next token is not comment", () => {
            let p = new Parser().write("<img src='pic.jpg'>").end();
            assert.throws(() => {
                p.peekExpectComment("Link", () => { /*do nothing*/ });
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("Link").end();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectComment("Comment", () => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectCommentEnd();
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<!-- Comment -->").end();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectCommentEnd(() => { /*do nothing*/ });
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectEnd();
            });
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
            });
        });
        it("throws an exception if there are no more tokens", () => {
            let p = new Parser().write("<a href='index.html'>Link</a>").end();
            p.next();
            p.next();
            p.next();
            p.next();
            assert.throws(() => {
                p.peekExpectEnd(() => { /*do nothing*/ });
            });
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
            });
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
            });
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
            });
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
            });
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
            });
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
            });
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
            });
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
            });
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
            });
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
            });
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
            });
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
            });
        });
    });

});

