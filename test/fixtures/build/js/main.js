'use strict';

function bar(value) {
    if (console) {
        console.log(value);
    }
}

function foo() {
    return bar();
}

bar('Hello World!');