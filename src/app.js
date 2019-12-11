const express = require('express');
const mysql = require('mysql');
const app = express();

app.set('view engine', 'hbs')

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

const db = mysql.createConnection({         // info in 'session' tab
    host:'127.0.0.1',                       // in Workbench
    user: 'root',
    password: 'password',
    port: 3306,             //mySQL port
    database: 'users_db'
});

db.connect((err) => {
    if(err) {
        console.log(err); 
    } else{
        console.log('MySQL Connected');
        
    }
})

app.get('/', (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err){
            console.log("error in query while retreving table");  
        } else{
            // console.log(result);
            // let table = "";

            // for (let i = 0; i < result.length; i++) {                    // returns 2x rows per user that is returned from database

            //     table += `<tr><td>Name:<td><td>${result[i].user_name}</td></tr>`;
            //     table += `<tr><td>Email:<td><td>${result[i].email}</td></tr>`;
                
            // }



            // table= `<table>${table}</table>`            //completes table by wrapping it in table tags
            
            res.render('index', {                       // passes complete table in HTML back to handlebars (index.hbs)
                // table: table
                data:result
            })  
        }
    })
});

app.get('/register', (req, res) =>{         // reroutes to register page, once submit button pressed
    res.render(
        'register'
    )
})

app.post('/register', (req, res) => {
    const name = req.body.theUserName;
    const email = req.body.theUserEmail;
    const password = req.body.theUserPassword;

    let sql = 'INSERT INTO users SET user_name = ?, email = ?, user_password = ?';          // sequence of variables has to match the array (? used for security reasons)
    let user = [name, email, password];

    let sqlEmailCheck = 'SELECT email FROM users WHERE email = ?'           // looks to see if an email exists that = an exiting email

    db.query(sqlEmailCheck, email, (err, result) => {          // returns array of result
        if(err){
            console.log("Error code: " + err);
        } else {
            if (result.length > 0) {                                        // if array has any content - the email exists already and isn't re-added
                res.send('<h1>Sorry, That email has been taken!</h1>')
            } else {
                let query = db.query(sql, user, (err, result) => {          // adds entry to db, if it is a unique email address
                    if(err){
                        console.log("Error code: " + err);
                    } else {
                        res.send(
                            '<h1>User Registered</h1>'
                        )
                    }
                })
            }
        }
    });

    


    // res.render('register', {                    // passes thorough the info from user onput via POST
    //     data: [name, email, password]
    // })
});



app.post('/edit/:id', (req, res) => {
    const userId = req.params.id;
    const method = req.body._method;
    const newName = req.body.editName;

    let sql = 'UPDATE users SET user_name = ? WHERE id = ?'
    let userUpdate = [newName, userId]
    if(method == 'PUT'){
        db.query(sql, userUpdate, (err, result)=>{
            if(err){
                console.log('There is an error in your query ' + err);
                
            } else{
                res.send('<h1>Username updated!</h1>')
            }
        })
    }

    // res.send('edit')
});

app.listen(3001, ()=> {
    console.log("Server is running");
})

