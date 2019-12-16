// Map function

let people = [
  {
    id: 1,
    name: "Narendra Maurya",
    githubHandle: "nandymandy1"
  },
  {
    id: 2,
    name: "Brad Traversy",
    githubHandle: "traversymedia"
  },
  {
    id: 3,
    name: "Chad Collins",
    githubHandle: "kimbodo"
  },
  {
    id: 4,
    name: "Shawn",
    githubHandle: "netninja"
  },
  {
    id: 5,
    name: "Alex",
    githubHandle: "codecourse"
  }
];

console.log("Old Array", people);

// people = people.map(person => {
//   if (person.id === 1) {
//     return { ...person, city: "Hyderabad" };
//   }
//   return person;
// });

// console.log("Modified Array", people);

// Filter operation

// people = people.filter(person => {
//   if (person.name !== "Narendra Maurya") {
//     return person;
//   }
// });

// console.log("Modified Array", people);

people.forEach((person, i) => {
  console.log(`Person ${i}`, person);
});
