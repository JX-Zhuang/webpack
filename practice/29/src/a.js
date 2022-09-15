class Person {
    constructor() { }
}
const button = document.getElementById('button');
button.onclick = function () {
    throw new Error('error');
}
export default Person;