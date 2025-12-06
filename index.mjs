import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database poolection pool
const pool = mysql.createPool({
    // IMPORTANT self-note. In a real implementation, we would want to keep these fields secret. (not visible on a public github)

    // Use these credentials if desired for Labs 5 and 6 to use the same database
    host: "edo4plet5mhv93s3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "pcuxo4jf4n2j8s2e",
    password: "gbslqprom3t8n3yx",
    database: "uoye9fgujzzheqv5",

    // Use these credentials if desired for Labs 5 and 6 to have separate databases
    // host: "etdq12exrvdjisg6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    // user: "s2wl78od50wi578x",
    // password: "hm03gri7s00gvd3c",
    // database: "jg6hr8af9azdw040",
    
    poolectionLimit: 10,
    waitForpoolections: true
});

// routes
app.get('/', (req, res) => {
    res.render('index');
});

// Authors
app.get('/author/new', async (req, res) => {
    res.render("newAuthor");
});

app.post("/author/new", async (req, res) => {
  let fName = req.body.fName;
  let lName = req.body.lName;
  let birthDate = req.body.birthDate;
  let deathDate = req.body.deathDate;
  let sex = req.body.sex;
  let profession = req.body.profession;
  let country = req.body.country;
  let portrait = req.body.portrait;
  let biography = req.body.biography
  let sql = `INSERT INTO q_authors
             (firstName, lastName, dob, dod, sex, profession, country, portrait, biography)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  let params = [fName, lName, birthDate, deathDate, sex, profession, country, portrait, biography];
  const [rows] = await pool.query(sql, params);
  res.render("newAuthor", 
             {"message": "Author added!"});
});

app.get("/authors", async (req, res) => {
 let sql = `SELECT *
            FROM q_authors
            ORDER BY authorId`;
 const [rows] = await pool.query(sql);
 res.render("authorList", {"authors":rows});
});

app.get("/author/edit", async function(req, res){
 let authorId = req.query.authorId;

 let sql = `SELECT *, 
        DATE_FORMAT(dob, '%Y-%m-%d') dobISO,
        DATE_FORMAT(dod, '%Y-%m-%d') dodISO
        FROM q_authors
        WHERE authorId =  ${authorId}`;
 const [rows] = await pool.query(sql);
 res.render("editAuthor", {"authorInfo":rows});
});

app.post("/author/edit", async function(req, res){
  let sql = `UPDATE q_authors
            SET firstName = ?,
                lastName = ?,
                dob = ?,
                dod = ?,
                sex = ?,
                profession = ?,
                country = ?,
                portrait = ?,
                biography = ?
            WHERE authorId =  ?`;

  let params = [req.body.fName,  
              req.body.lName, req.body.dob, req.body.dod,
              req.body.sex, req.body.profession, req.body.country, req.body.portrait, req.body.biography, req.body.authorId];         
  const [rows] = await pool.query(sql,params);
  res.redirect("/authors");
});

app.get("/author/delete", async (req, res) => {
    let authorId = req.query.authorId;

    let sql = `DELETE
               FROM q_authors
               WHERE authorId = ?`;

    const [rows] = await pool.query(sql, [authorId]);
    res.redirect("/authors");
});

// Quotes
app.get('/quote/new', async (req, res) => {
    res.render("newQuote");
});

app.post("/quote/new", async (req, res) => {
  let quote = req.body.quote;
  let category = req.body.category;
  let likes = req.body.likes;
  let authorId = req.body.authorId;
  let sql = `INSERT INTO q_quotes
             (quote, category, likes, authorId)
              VALUES (?, ?, ?, ?)`;
  let params = [quote, category, likes, authorId];
  const [rows] = await pool.query(sql, params);
  res.render("newQuote", 
             {"message": "Quote added!"});
});

app.get("/quotes", async (req, res) => {
 let sql = `SELECT *
            FROM q_quotes
            ORDER BY authorId`;
 const [rows] = await pool.query(sql);
 res.render("quoteList", {"quotes":rows});
});

app.get("/quote/edit", async function(req, res){
 let quoteId = req.query.quoteId;

 let sql = `SELECT *
        FROM q_quotes
        WHERE quoteId =  ${quoteId}`;
 const [rows] = await pool.query(sql);
 res.render("editQuote", {"quoteInfo":rows});
});

app.post("/quote/edit", async function(req, res){
  let sql = `UPDATE q_quotes
            SET quote = ?,
                category = ?,
                likes = ?,
                authorId = ?
            WHERE quoteId =  ?`;

  let params = [req.body.quote, req.body.category, req.body.likes,
              req.body.authorId, req.body.quoteId];         
  const [rows] = await pool.query(sql,params);
  res.redirect("/quotes");
});

app.get("/quote/delete", async (req, res) => {
    let quoteId = req.query.quoteId;

    let sql = `DELETE
               FROM q_quotes
               WHERE quoteId = ?`;

    const [rows] = await pool.query(sql, [quoteId]);
    res.redirect("/quotes");
});

// Exoress app listener
app.listen(3000, ()=>{
    console.log("Express server running");
});