let { people } = require("./test");

console.log("Old Array", people);

people = [...people, { name: "Barbara" }];

console.log("New Array", people);
