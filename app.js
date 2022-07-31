const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
const Joi = require("joi");
const sql = require("./modules/connectToSql");
const bodyParser = require("body-parser");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

const path = require("path");

// const publicDirectoryPath = path.join(__dirname, "./public");

// app.use(express.static(publicDirectoryPath));

const viewsPath = path.join(__dirname, "./views");
app.set("views", viewsPath);

const contactSchema = Joi.object({
  name: Joi.string().required().min(2).max(70),
  country: Joi.string().required().min(2).max(70),
  email: Joi.string().required().email(),
  phone: Joi.number().integer().min(9),
  submit: Joi.string(),
});

app.get("/form", (req, res) => {
  res.render("form");
});

app.post("/form", (req, res) => {
  const { error, value } = contactSchema.validate(req.body);
  if (error) {
    res.send(error.message);
  } else {
    sql.query(
      `INSERT INTO Person
VALUES (NULL, "${req.body.name}","${req.body.country}", "${req.body.email}", "${req.body.phone}");`,
      function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        console.log(fields);
      }
    );
    res.redirect(303, "form");
  }
});

// app.get('*', (req, res) => {
//     res.redirect(303,"/") })

app.get("", (req, res) => {
  res.render("");
});

app.get("/table", (req, res) => {
  sql.query("SELECT * FROM Person", function (error, results, fields) {
    if (error) throw error;
    res.render("table", { personarr: results });
  });
});

app.listen(PORT, () => {
  console.log("Server is up on port " + PORT);
});
