const assert = require('assert');
const Token = require("../lib/token.js").Token;


describe("Token", () => {
    describe("t.isOpen()", () => {
        it("returns true for an open token", () => {
            let t = Token.newOpen("a");
            let res = t.isOpen();
            assert.equal(res, true);
        });
        it("returns false for a different token", () => {
            let t = Token.newClose("a");
            let res = t.isOpen();
            assert.equal(res, false);
        });
    });
    describe("t.isOpen(tag)", () => {
        it("returns true for an open token with the same tag", () => {
            let t = Token.newOpen("a");
            let res = t.isOpen("a");
            assert.equal(res, true);
        });
        it("returns false for an open token with different tag", () => {
            let t = Token.newOpen("img");
            let res = t.isOpen("a");
            assert.equal(res, false);
        });
        it("returns false for a different token", () => {
            let t = Token.newText("HTML dissect");
            let res = t.isOpen("a");
            assert.equal(res, false);
        });
    });
    describe("t.isOpen(tag, match)", () => {
        it("returns true for an open token with the same tag and matching attributes", () => {
            let t = Token.newOpen("a", {href: "index.html", rel: "nofollow"});
            let res = t.isOpen("a", {href: /.*?\.html/, rel: "nofollow"});
            assert.equal(res, true);
        });
        it("returns false for an open token with different tag", () => {
            let t = Token.newOpen("img", {src: "pic.jpg"});
            let res = t.isOpen("a");
            assert.equal(res, false);
        });
        it("returns false for an open token with same tag but non-matching attributes", () => {
            let t = Token.newOpen("a", {href: "index.html", rel: "nofollow"});
            let res = t.isOpen("a", {href: /.*?\.js/});
            assert.equal(res, false);
        });
        it("returns false with for a different token", () => {
            let t = Token.newClose("a");
            let res = t.isOpen("a");
            assert.equal(res, false);
        });
    });



    describe("t.isClose()", () => {
        it("returns true for a close token", () => {
            let t = Token.newClose("a");
            let res = t.isClose();
            assert.equal(res, true);
        });
        it("returns false for a different token", () => {
            let t = Token.newText("HTML dissect");
            let res = t.isClose();
            assert.equal(res, false);
        });
    });
    describe("t.isClose(tag)", () => {
        it("returns true for a close token with same tag", () => {
            let t = Token.newClose("a");
            let res = t.isClose("a");
            assert.equal(res, true);
        });
        it("returns false for a close token with different tag", () => {
            let t = Token.newClose("img");
            let res = t.isClose("a");
            assert.equal(res, false);
        });
        it("returns false for a different token", () => {
            let t = Token.newText("HTML dissect");
            let res = t.isClose("a");
            assert.equal(res, false);
        });
    });



    describe("t.isText()", () => {
        it("returns true for a text token", () => {
            let t = Token.newText("HTML dissect");
            let res = t.isText();
            assert.equal(res, true);
        });
        it("returns false for a different token", () => {
            let t = Token.newClose("img");
            let res = t.isText();
            assert.equal(res, false);
        });
    });
    describe("t.isText(matchStr)", () => {
        it("returns true for a text token with matching text", () => {
            let t = Token.newText("HTML dissect");
            let res = t.isText("HTML dissect");
            assert.equal(res, true);
        });
        it("returns false for a text token with not matching text", () => {
            let t = Token.newText("HTML dissect");
            let res = t.isText("HTML");
            assert.equal(res, false);
        });
        it("returns false for a different token", () => {
            let t = Token.newClose("img");
            let res = t.isText("HTML");
            assert.equal(res, false);
        });
    });
    describe("t.isText(matchFn)", () => {
        it("returns true for a text token with matching text", () => {
            let t = Token.newText("HTML dissect");
            let res = t.isText(s => s.startsWith("HTML"));
            assert.equal(res, true);
        });
        it("returns false for a text token with not matching text", () => {
            let t = Token.newText("HTML dissect");
            let res = t.isText(s => s.length === 10);
            assert.equal(res, false);
        });
        it("returns false for a different token", () => {
            let t = Token.newClose("img");
            let res = t.isText(() => true);
            assert.equal(res, false);
        });
    });
    describe("t.isText(matchRE)", () => {
        it("returns true with a regexp match argument for matching text", () => {
            let t = Token.newText("HTML dissect");
            let res = t.isText(/^[A-Z]+? [a-z]{7}$/);
            assert.equal(res, true);
        });
        it("returns false for a text token with not matching text", () => {
            let t = Token.newText("HTML dissect");
            let res = t.isText(/^[A-Z]+? [a-z]{5}$/);
            assert.equal(res, false);
        });
        it("returns false for a different token", () => {
            let t = Token.newClose("img");
            let res = t.isText(/^HTML$/);
            assert.equal(res, false);
        });
    });

    describe("t.isText()", () => {
        it("returns true for a text token", () => {
            let t = Token.newText("HTML dissect");
            let res = t.isText();
            assert.equal(res, true);
        });
        it("returns false for a different token", () => {
            let t = Token.newClose("img");
            let res = t.isText();
            assert.equal(res, false);
        });
    });
    describe("t.isText(matchStr)", () => {
        it("returns true for a text token with matching text", () => {
            let t = Token.newText("HTML dissect");
            let res = t.isText("HTML dissect");
            assert.equal(res, true);
        });
        it("returns false for a text token with not matching text", () => {
            let t = Token.newText("HTML dissect");
            let res = t.isText("HTML");
            assert.equal(res, false);
        });
        it("returns false for a different token", () => {
            let t = Token.newClose("img");
            let res = t.isText("HTML");
            assert.equal(res, false);
        });
    });
    describe("t.isText(matchFn)", () => {
        it("returns true for a text token with matching text", () => {
            let t = Token.newText("HTML dissect");
            let res = t.isText(s => s.startsWith("HTML"));
            assert.equal(res, true);
        });
        it("returns false for a text token with not matching text", () => {
            let t = Token.newText("HTML dissect");
            let res = t.isText(s => s.length === 10);
            assert.equal(res, false);
        });
        it("returns false for a different token", () => {
            let t = Token.newClose("img");
            let res = t.isText(() => true);
            assert.equal(res, false);
        });
    });
    describe("t.isText(matchRE)", () => {
        it("returns true with a regexp match argument for matching text", () => {
            let t = Token.newText("HTML dissect");
            let res = t.isText(/^[A-Z]+? [a-z]{7}$/);
            assert.equal(res, true);
        });
        it("returns false for a text token with not matching text", () => {
            let t = Token.newText("HTML dissect");
            let res = t.isText(/^[A-Z]+? [a-z]{5}$/);
            assert.equal(res, false);
        });
        it("returns false for a different token", () => {
            let t = Token.newClose("img");
            let res = t.isText(/^HTML$/);
            assert.equal(res, false);
        });
    });



    describe("t.isComment()", () => {
        it("returns true for a comment token", () => {
            let t = Token.newComment("HTML dissect");
            let res = t.isComment();
            assert.equal(res, true);
        });
        it("returns false for a different token", () => {
            let t = Token.newClose("img");
            let res = t.isComment();
            assert.equal(res, false);
        });
    });
    describe("t.isComment(matchStr)", () => {
        it("returns true for a text token with matching text", () => {
            let t = Token.newComment("HTML dissect");
            let res = t.isComment("HTML dissect");
            assert.equal(res, true);
        });
        it("returns false for a text token with not matching text", () => {
            let t = Token.newComment("HTML dissect");
            let res = t.isComment("HTML");
            assert.equal(res, false);
        });
        it("returns false for a different token", () => {
            let t = Token.newClose("img");
            let res = t.isComment("HTML");
            assert.equal(res, false);
        });
    });
    describe("t.isComment(matchFn)", () => {
        it("returns true for a text token with matching text", () => {
            let t = Token.newComment("HTML dissect");
            let res = t.isComment(s => s.startsWith("HTML"));
            assert.equal(res, true);
        });
        it("returns false for a text token with not matching text", () => {
            let t = Token.newComment("HTML dissect");
            let res = t.isComment(s => s.length === 10);
            assert.equal(res, false);
        });
        it("returns false for a different token", () => {
            let t = Token.newClose("img");
            let res = t.isComment(() => true);
            assert.equal(res, false);
        });
    });
    describe("t.isComment(matchRE)", () => {
        it("returns true with a regexp match argument for matching text", () => {
            let t = Token.newComment("HTML dissect");
            let res = t.isComment(/^[A-Z]+? [a-z]{7}$/);
            assert.equal(res, true);
        });
        it("returns false for a text token with not matching text", () => {
            let t = Token.newComment("HTML dissect");
            let res = t.isComment(/^[A-Z]+? [a-z]{5}$/);
            assert.equal(res, false);
        });
        it("returns false for a different token", () => {
            let t = Token.newClose("img");
            let res = t.isComment(/^HTML$/);
            assert.equal(res, false);
        });
    });



    describe("t.isCommentEnd()", () => {
        it("returns true for a close token", () => {
            let t = Token.newCommentEnd();
            let res = t.isCommentEnd();
            assert.equal(res, true);
        });
        it("returns false for a different token", () => {
            let t = Token.newComment("HTML dissect");
            let res = t.isCommentEnd();
            assert.equal(res, false);
        });
    });


    describe("t.hasAttrs(attrs)", () => {
        it("returns true for an open token with matching attributes", () => {
            let t = Token.newOpen("img", {src: "pic.jpg", class: "thumbnail"});
            let res = t.hasAttrs({src: "pic.jpg", class: "thumbnail"});
            assert.equal(res, true);
        });
        it("returns false for an open token with not matching attributes", () => {
            let t = Token.newOpen("img", {src: "pic.jpg", class: "thumbnail"});
            let res = t.hasAttrs({src: "image.jpg", class: "thumbnail"});
            assert.equal(res, false);
        });
        it("returns false for an open token with different attributes", () => {
            let t = Token.newOpen("img", {src: "pic.jpg", class: "thumbnail"});
            let res = t.hasAttrs({src: "pic.jpg", style: "border: 3px;"});
            assert.equal(res, false);
        });
        it("returns false for a different token", () => {
            let t = Token.newClose("img");
            let res = t.hasAttrs({src: "pic.jpg", class: "thumbnail"});
            assert.equal(res, false);
        });
    });
    describe("t.hasAttrs(attrStr)", () => {
        it("returns true for an open token with matching attributes", () => {
            let t = Token.newOpen("span", {class: "important largefont"});
            let res = t.hasAttrs({class: "important largefont"});
            assert.equal(res, true);
        });
        it("returns false for an open token with not matching attributes", () => {
            let t = Token.newOpen("span", {class: "important largefont"});
            let res = t.hasAttrs({class: "important smallfont"});
            assert.equal(res, false);
        });
    });
    describe("t.hasAttrs(attrFn)", () => {
        it("returns true for an open token with matching attributes", () => {
            let t = Token.newOpen("span", {class: "important largefont"});
            let res = t.hasAttrs({class: s => s.startsWith("important")});
            assert.equal(res, true);
        });
        it("returns false for an open token with not matching attributes", () => {
            let t = Token.newOpen("span", {class: "important largefont"});
            let res = t.hasAttrs({class: s => s.startsWith("notice")});
            assert.equal(res, false);
        });
    });
    describe("t.hasAttrs(attrRE)", () => {
        it("returns true for an open token with matching attributes", () => {
            let t = Token.newOpen("span", {class: "important largefont"});
            let res = t.hasAttrs({class: /^important .+$/});
            assert.equal(res, true);
        });
        it("returns false for an open token with not matching attributes", () => {
            let t = Token.newOpen("span", {class: "important largefont"});
            let res = t.hasAttrs({class: /^important .{5}$/});
            assert.equal(res, false);
        });
    });
});
