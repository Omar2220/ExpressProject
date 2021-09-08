//In order to work , type : npx nodemon server.js
const Joi = require("joi");
const express = require("express");
const server = express();
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server listening on port ${port} `));

//If we want to read an Obj Prop like :"name: req.body.name"
//We need a Json parsed Obj and by default parsing by Json is not enabled in Express so we do this
server.use(express.json());

const courses = [
  {
    id: 1,
    name: "course 1",
    details: " details about C1 ",
    syllabus: "Vedio editing,Audio editing ,Video producing",
    price: "700$",
  },
  {
    id: 2,
    name: "course 2",
    details: " details about C2 ",
    syllabus: "PHOTOSHOP,Graphic Design basics...",
    price: "500$",
  },
  {
    id: 3,
    name: "course 3",
    details: " details about C3 ",
    syllabus: "HTML,CSS,JS...",
    price: "1000$",
  },
];

//Home route
server.get("/", (req, res) => {
  // handle request here
  res.send(
    "<div class='h1'><h1>Welcome To Our Academy of Tech&Media<h1></div>"
  );
});

//Courses route
server.get("/api/courses", (req, res) => {
  // Handle request here
  res.send(courses);
});

//Read courses
server.get("/api/courses/:id", (req, res) => {
  // Handle request here
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  //If the course was not found => 404
  if (!course) {
    res.status(404).send("The Course Was Not Found");
  } else res.send(course);
});

//Add new course
server.post("/api/courses", (req, res) => {
  //In case the coustomer inserts an invalid input , we have 2 ways to check validation :
  //1) Normal if's block (the LONG way) :
  //   if (!req.body.name || req.body.name < 3) {
  //     //400 => bad req
  //     res.status(400).send("Name is Requierd And Should be At Least 3 Letters");
  //   }
  //2) The more professional and easier way : Joi.
  // Joi is an npm package that helps us validate automaticalliy our code .
  const schema = Joi.object({
    name: Joi.string().min(3).required(), //name prop must be a string , that contains at least 3 characters and it's required
    details: Joi.string().min(55).required(),
    syllabus: Joi.string().min(25).required(),
    price: Joi.number().integer().min(150).required(),
  });
  const validation = schema.validate(req.body); //
  console.log(validation);
  //Send 400 status code (bad request) and display the errors
  if (validation.error) {
    res.status(400).send(validation.error.details[0].message);
    return;
  }
  const course = {
    //Add a new id to courses array (continue counting)
    id: courses.length + 1,
    //We need to read that form the body of the req
    name: req.body.name,
    details: req.body.details,
    syllabus: req.body.syllabus,
    price: req.body.price,
  };
  courses.push(course);
  res.send(course);
});

//Updating courses
server.put("/api/courses/:id", (req, res) => {
  //Look up the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  //If it doesn't exist => send 404 and display the error
  if (!course) {
    res.status(404).send("The Course Was Not Found");
    //Bug 1
    return;
  }
  //Validate => better and cleaner solution is to buiild a function outside the route ,and then use it in more than one place
  const schema = Joi.object({
    name: Joi.string().min(3).required(), //name prop must be a string , that contains at least 3 characters and it's required
    details: Joi.string().min(55).required(),
    syllabus: Joi.string().min(25).required(),
    price: Joi.number().integer().min(150).required(),
  });
  const validation = schema.validate(req.body);
  //If invalid => send 400 -bad request and display the error
  if (validation.error) {
    res.status(400).send(validation.error.details[0].message);
    return;
  }
  //Update the course and return the updated course
  course.name = req.body.name;
  course.details = req.body.details;
  course.syllabus = req.body.syllabus;
  course.price = req.body.price;
});

//Delete courses
server.delete("/api/courses/:id", (req, res) => {
  //Look up the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  //If it doesn't exist => send 404 and display the error
  if (!course) {
    res.status(404).send("The Course Was Not Found");
    //Bug 1
    return;
  }
  //If it exists delete it
  const index = courses.indexOf(course); //get the index of the course
  courses.splice(index, 1); //delete one obj (course) in the given index
  //Return Dleted course => to test that we can check the /api/courses
  res.send(course);
});
