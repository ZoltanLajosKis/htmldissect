# HTML dissect

[![Build Status](https://travis-ci.org/ZoltanLajosKis/htmldissect.svg?branch=master)](https://travis-ci.org/ZoltanLajosKis/htmldissect)
[![Coverage Status](https://coveralls.io/repos/github/ZoltanLajosKis/htmldissect/badge.svg?branch=master)](https://coveralls.io/github/ZoltanLajosKis/htmldissect?branch=master)

An HTML parser that lets you write concise and sequential code for extracting
data from HTML pages and for verifying the page structure.

With sequential code the page elements are processed in the same function, so
extracted data pieces will be available within the same scope.
This makes it easy to extract complex data structures and lets you organize
the code into separate functions and to use recursion for complicated documents
such as wiki pages.

The expect-based syntax lets you verify assumptions on the structure of the
complete document. When processing a batch of HTML documents from the same
source you can iteratively refine the assumptions until all documents are
processed successfully.

HTML dissect uses the [htmlparser2](https://www.npmjs.com/package/htmlparser2)
package internally for parsing the HTML documents.

## Install
```sh
npm install htmldissect
```


## Example

HTML dissect methods can be used with different coding styles. See the
following examples for extracting titles and the corresponding text from the
HTML snippet below.

```html
<section id="main">
  <h3>Lorem ipsum</h3>
  <p>Dolor sit amet.</p>
  <p>Consectetuer adipiscing elit.</p>
  <h3>Sed do eiusmod</h3>
  <p>Tempor incididunt.</p>
  <p>Ut labore.</p>
  <p>Et dolore magna aliqua.</p>
</section>

```

### Procedural style
Procedural style results in flat and easy to understand code.

```javascript
const Parser = require("htmldissect").Parser;
const p = new Parser({skipWhitespaceOnlyText: true}).write(html).end();

const map = {};

p.expectOpen("section", {id: "main"});
let title;
let text = [];
for (;;) {
    let next = p.peek();
    if (next.isOpen("h3")) {
        if (title) { map[title] = text; text = []; }

        p.expectOpen("h3");
        title = p.expectText().trim();
        p.expectClose("h3");

    } else if (next.isOpen("p")) {
        p.expectOpen("p");
        text.push(p.expectText().trim());
        p.expectClose("p");

    } else if (next.isClose("section")) {
        map[title] = text;
        break;
    }
}
p.expectClose("section");
p.expectEnd();

console.log(map);
```
### Callback style
With callback style code responsible for HTML parsing and for data processing
becomes visually separated. The use of callback functions also help in
limiting the scope of variables.

```javascript
const Parser = require("htmldissect").Parser;
const p = new Parser({skipWhitespaceOnlyText: true}).write(html).end();

const map = {};

p.expectOpen("section", {id: "main"});
p.peek(next => {
    let title;
    let text = [];
    for (;;) {
        if (next.isOpen("h3")) {
            if (title) { map[title] = text; text = []; }

            p.expectOpen("h3");
            p.expectText(t => { title = t.trim(); });
            p.expectClose("h3");

        } else if (next.isOpen("p")) {
            p.expectOpen("p");
            p.expectText(t => { text.push(t.trim()); });
            p.expectClose("p");

        } else if (next.isClose("section")) {
            map[title] = text;
            break;
        }
        next = p.peek();
    }
});
p.expectClose("section");
p.expectEnd();

console.log(map);
```


### Wrapped style
Using the `expectOpenClose` method to process an opening and a pair closing
token with a single call results in the most concise code.

```javascript
const Parser = require("htmldissect").Parser;
const p = new Parser({skipWhitespaceOnlyText: true}).write(html).end();

const map = {};

p.expectOpenClose("section", {id: "main"}, () => {
    p.peek(next => {
        let title;
        let text = [];
        for (;;) {
            if (next.isOpen("h3")) {
                if (title) { map[title] = text; text = []; }

                p.expectOpenClose("h3", {}, () => {
                    p.expectText(t => { title = t.trim(); });
                });

            } else if (next.isOpen("p")) {
                p.expectOpenClose("p", {}, () => {
                    p.expectText(t => { text.push(t.trim()); });
                });

            } else if (next.isClose("section")) {
                map[title] = text;
                break;
            }
            next = p.peek();
        }
    });
});
p.expectEnd();

console.log(map);
```


## API

### Parser

The `Parser` object represents the parser.

- **`constructor(opts)`**: Creates a new Parser; `opts` is an object with the
  following attributes:
  - **`skipWhitespaceOnlyText`**: If set to true, text tokens with whitespace
    only content (spaces, tabs, newlines) are ignored.
- **`write(html)`**: Parses a chunk of HTML.
- **`end()`**: Marks the end of input data.

The following methods move to the parser to the next token. They return the
corresponding `Token` object (unless otherwise stated) or call the `cb`
callback with the same value if specified. They throw an exception if the
expectation failed.

- **`next(cb)`**: Returns the next token. Throws an exception if there are no
  more tokens.
- **`expectOpen(tag, match, cb)`**: Returns the next token, or if `tag` is
  specified returns its attributes. Throws an exception if the next token is
  not open, or if it does not match the optional `tag` and `match` parameters,
  where `match` is an object that can specify for each attribute a string,
  regexp or predicate function.
- **`expectClose(tag, cb)`**: Returns the next token. Throws an exception if
  the next token is not close, or if it does not match the optional `tag`
  parameter.
- **`expectOpenClose(tag, match, cb)`**: Returns the next token, or if `tag` is
  specified returns its attributes. Throws an exception if the next token is
  not open, or if it does not match the optional `tag` and `match` parameters,
  where `match` is an object that can specify for each attribute a string,
  regexp or predicate function. Also throws exception if the token is not
  followed by a close token with the same tag.
  The `cb` callback is called before checking the close token, which means it
  can be used to process the HTML content wrapped within the open and close
  token pair.
- **`expectText(match, cb)`**: Returns the text content of the next text token.
  Throws an exception if the next token is not text or its text content does
  not match the optional `match` parameter that can be a string, regexp or
  predicate function.
- **`expectComment(match, cb)`**: Returns the text content of the next comment
  token. Throws an exception if the next token is not comment or its text
  content does not match the optional `match` parameter, that can be a string,
  regexp or predicate function.
- **`expectCommentEnd(cb)`**: Returns the next token. Throws exception if the
  next token is not a comment end token.
- **`expectEnd(cb)`**: Returns the next token. Throws exception if the next
  token is not an end token.
- **`skipToOpen(tag, match, cb)`**: Skips to the next open token that matches
  the optional `tag` and `match` parameters, where `match` is an object that
  can specify for each attribute a string, regexp or predicate function.
  Returns the token, or if `tag` is specified returns its attributes. Throws
  an exception if no matching token is found to skip to.
- **`skipToClose(tag, cb)`**: Skips to the next close token that matches the
  optional `tag` parameter. Returns the token. Throws an exception if no
  matching token is found to skip to.

The following methods work like the expect-based methods, but they do not
move to the next token. They can be used to make conditional decisions when
multiple type of tokens can follow.

- **`peek(cb)`**: Returns the next token. Throws an exception if there are no
  more tokens.
- **`peekExpectOpen(tag, match, cb)`**: Returns the next token, or if `tag` is
  specified returns its attributes. Throws an exception if the next token is
  not open, or if it does not match the optional `tag` and `match` parameters,
  where `match` is an object that can specify for each attribute a string,
  regexp or predicate function.
- **`peekExpectClose(tag, cb)`**: Returns the next token. Throws an exception
  if the next token is not close, or if it does not match the optional `tag`
  parameter.
- **`peekExpectText(match, cb)`**: Returns the text content of the next text
  token. Throws an exception if the next token is not text or its text content
  does not match the optional `match` parameter that can be a string, regexp
  or predicate function.
- **`peekExpectComment(match, cb)`**: Returns the text content of the next
  comment token. Throws an exception if the next token is not comment or its
  text content does not match the optional `match` parameter, that can be a
  string, regexp or predicate function.
- **`peekExpectCommentEnd(cb)`**: Returns the next token. Throws exception if
  the next token is not a comment end token.
- **`peekExpectEnd(cb)`**: Returns the next token. Throws exception if the
  next token is not an end token.
- **`peekSkipToOpen(tag, match, cb)`**: Skips to before the next open token
  that matches the optional `tag` and `match` parameters, where `match` is an
  object that can specify for each attribute a string, regexp or predicate
  function. Returns the token, or if `tag` is specified returns its
  attributes. Throws an exception if no matching token is found to skip to.
- **`peekSkipToClose(tag, cb)`**: Skips to before the next close token that
  matches the optional `tag` parameter. Returns the token. Throws an exception
  if no matching token is found to skip to.
- **`peekIter(cb)`**: Iterates tokens, passing each of them to `cb`. Iteration
  stops when `cb` returns false. Throws an exception if `cb` did not move any
  tokens, or if there are no more tokens.

The if methods only move to the next token and return it if the token matches
the conditions; otherwise it returns falls. They can be used for handling
optional tags (as a shorthand for a peek followed by a single test on the
token). The if methods return true when used with a callback so they can be
used in switch statements.

- **`ifOpen(tag, match, cb)`**: Returns the next token, or if `tag` is
  specified returns its attributes. Returns `false` if the next token is not
  open, or if it does not match the optional `tag` and `match` parameters,
  where `match` is an object that can specify for each attribute a string,
  regexp or predicate function.
- **`ifClose(tag, cb)`**: Returns the next token. Returns `false` if the next
  token is not close, or if it does not match the optional `tag` parameter.
- **`ifText(match, cb)`**: Returns the text content of the next text token.
  Returns `false` if the next token is not text or its text content does not
  match the optional `match` parameter that can be a string, regexp or
  predicate function.
- **`ifComment(match, cb)`**: Returns the text content of the next comment
  token. Returns `false` if the next token is not comment or its text content
  does not match the optional `match` parameter that can be a string, regexp
  or predicate function.
- **`ifCommentEnd()`**: Returns the next token. Returns `false` if the next
  token is not a comment end token.
- **`ifEnd()`**: Returns the next token. Returns `false` if the next token is
not an end token.


### Token

The `Token` objects represent tokens as returned by the above Parser methods,
including an explicit end token at the end.

- **`isOpen(tag, match)`**: Returns true if the token is an open token that
  matches the optional `tag` and `match` parameters, where `match` is an object
  that can specify for each attribute a string, regexp or predicate function.
- **`isClose(tag)`**: Returns true if the token is a close token that matches
  the optional `tag` parameter.
- **`isText(match)`**: Returns true if the token is a text token that matches
  the optional `match` parameter, where `match` is a string, regexp or
  predicate function.
- **`isComment(match)`**: Returns true if the token is a comment token that
  matches the optional `match` parameter, where `match` is a string, regexp or
  predicate function.
- **`isCommentEnd()`**: Returns true if the token is a comment end token.
- **`isEnd()`**: Returns true if the token is an end token.

