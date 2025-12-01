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
    host: "edo4plet5mhv93s3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "pcuxo4jf4n2j8s2e",
    password: "gbslqprom3t8n3yx",
    database: "uoye9fgujzzheqv5",
    poolectionLimit: 10,
    waitForpoolections: true
});

// routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/quote/new', async (req, res) => {
    res.render("newAuthor");
});

// TODO implement new author post

app.get('/author/new', async (req, res) => {
    res.render("newAuthor");
});

app.post("/author/new", async (req, res) => {
  let fName = req.body.fName;
  let lName = req.body.lName;
  let birthDate = req.body.birthDate;
  let sql = `INSERT INTO q_authors
             (firstName, lastName, dob)
              VALUES (?, ?, ?)`;
  let params = [fName, lName, birthDate];
  const [rows] = await pool.query(sql, params);
  res.render("newAuthor", 
             {"message": "Author added!"});
});

app.get("/authors", async (req, res) => {
 let sql = `SELECT *
            FROM q_authors
            ORDER BY lastName`;
 const [rows] = await pool.query(sql);
 res.render("authorList", {"authors":rows});
});

app.get("/author/edit", async function(req, res){
 let authorId = req.query.authorId;

 let sql = `SELECT *, 
        DATE_FORMAT(dob, '%Y-%m-%d') dobISO
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
                sex = ?
            WHERE authorId =  ?`;

  let params = [req.body.fName,  
              req.body.lName, req.body.dob, 
              req.body.sex,req.body.authorId];         
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

app.listen(3000, ()=>{
    console.log("Express server running");
})