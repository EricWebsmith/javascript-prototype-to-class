import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';
import { Classifier } from '../../prototype_to_class';

const old521 = `
/**
 * @param {number[][]} vec
 */
var Vector2D = function(vec) {
	
};

/**
 * @return {number}
 */
Vector2D.prototype.next = function() {
	
};

/**
 * @return {boolean}
 */
Vector2D.prototype.hasNext = function() {
	
};

/** 
 * Your Vector2D object will be instantiated and called as such:
 * var obj = new Vector2D(vec)
 * var param_1 = obj.next()
 * var param_2 = obj.hasNext()
 */
`;

const expect521 = `
class Vector2D {
    /**
     * @param {number[][]} vec
     */
    constructor(vec) {

    }

    /**
     * @return {number}
     */
    next() {

    }

    /**
     * @return {boolean}
     */
    hasNext() {

    }
}
`;

suite('Model Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('251. Flatten 2D Vector', () => {
        const classifier_ = new Classifier();
        const actual = classifier_.toClass(old521);
        assert.equal(actual, expect521);
    });
});
