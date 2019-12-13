export default class MyClass {
    constructor() {
        this._a = 0;
        this._b = 1;
        this._c = 2;
        this.pr();
    }

    pr() {
        console.log(this._a + this._b + this._c)
    }
}