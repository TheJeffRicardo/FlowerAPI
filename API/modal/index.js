const db = require('../config')

const {hash, compare, hashSync} = require('bcrypt')

const {createToken} = require('../middleware/AuthenticatedUser')
class User {
    login(req, res) {
        const {emailAdd, userPass} = req.body;
        const strQry = 
        `
        SELECT user_id, firstName, lastName, gender, cellphoneNumber, emailAdd, userPass, joinDate
        FROM users
        WHERE emailAdd = '${emailAdd}';
        `
        db.query(strQry, async (err, data)=>{
            if(err) throw err;
            if((!data.length) || (data == null)) {
                res.status(401).json({err: 
                    "You provide a wrong email address"})
            }else {
                compare(userPass,
                    data[0].userPass, 
                    (cErr, cResult)=> {
                        if(cErr) throw cErr;
                        const jwToken = 
                        createToken(
                            {
                                emailAdd, userPass  
                            }
                        );
                        res.cookie('LegitUser',
                        jwToken, {
                            maxAge: 3600000,
                            httpOnly: true
                        })
                        if(cResult) {
                            res.status(200).json({
                                msg: 'Logged in',
                                jwToken,
                                result: data[0]
                            })
                        }else {
                            res.status(401).json({
                                err: 'You entered an invalid password or did not register. '
                            })
                        }
                    })
            }
        })     
    }
    fetchUsers(req, res) {
        const strQry = 
        `
        SELECT user_id, firstName, lastName, gender, cellphoneNumber, emailAdd, joinDate
        FROM users;
        `;
        db.query(strQry, (err, data)=>{
            if(err) throw err
            else res.status(200).json( 
                {results: data} )
        })
    }
    fetchUser(req, res) {
        const strQry = 
        `
        SELECT user_id, firstName, lastName, gender, cellphoneNumber, emailAdd, joinDate
        FROM users
        WHERE user_id = ?;
        `;
        db.query(strQry,[req.params.id], 
            (err, data)=>{
            if(err) throw err;
            else res.status(200).json( 
                {results: data} )
        })
    }
    async createUser(req, res) {
        let detail = req.body
        detail.userPass = await hash(detail.userPass, 15)
        let user = {
            emailAdd: detail.emailAdd,
            userPass: detail.userPass
        }
        const strQry =
        `INSERT INTO users
        SET ?;`;
        db.query(strQry, [detail], (err)=> {
            if(err) {
                res.status(401).json({err})
            }else {
                const jwToken = createToken(user);
                res.cookie("LegitUser", jwToken, {
                    maxAge: 3600000,
                    httpOnly: true
                });
                res.status(200).json({msg: "A user record was saved."})
            }
        })    
    }
    updateUser(req, res) {
        let data = req.body;
        // if(data.userPass !== null || 
        //     data.userPass !== undefined)
        //     console.log(data.userPass);
        //     data.userPass = hashSync(data.userPass, 15)
        const strQry = 
        `
        UPDATE users
        SET ?
        WHERE user_id = ?;
        `;
        db.query(strQry,[data, req.params.id], 
            (err)=>{
            if(err) throw err
            res.status(200).json( {msg: 
                "A row was affected"} )
        })    
    }
    deleteUser(req, res) {
        const strQry = 
        `
        DELETE FROM users
        WHERE user_id = ?;
        `;
        db.query(strQry,[req.params.id], 
            (err)=>{
            if(err) throw err;
            res.status(200).json( {msg: 
                "A record was removed from a database"} )
        })    
    }
}

class Flower {
    fetchFlowers(req, res) {
        const strQry = `SELECT id, flowername, colour, 
        picture, descript
        FROM flowers;`
        db.query(strQry, (err, results)=> {
            if(err) throw err
            res.status(200).json({results: results})
        });
    }
    fetchFlower(req, res) {
        const strQry = `SELECT id, flowername, colour, 
        picture, descript
        FROM flowers
        WHERE id = ?;`
        db.query(strQry, [req.params.id], (err, results)=> {
            if(err) throw err
            res.status(200).json({results: results})
        });

    }
    addFlower(req, res) {
        const strQry = 
        `
        INSERT INTO flowers
        SET ?;
        `;
        db.query(strQry,[req.body],
            (err)=> {
                if(err){
                    res.status(400).json({err: "Unable to insert a new record."})
                }else {
                    res.status(200).json({msg: "Flower saved"})
                }
            }
        );    
    }
    updateFlower(req, res) {
        const strQry = 
        `
        UPDATE flowers
        SET ?
        WHERE id = ?
        `;
        db.query(strQry,[req.body, req.params.id],
            (err)=> {
                if(err){
                    res.status(400).json({err: "Unable to update a record."})
                }else {
                    res.status(200).json({msg: "Flower updated"})
                }
            }
        );    

    }
    deleteFlower(req, res) {
        const strQry = 
        `
        DELETE FROM flowers
        WHERE id = ?;
        `;
        db.query(strQry,[req.params.id], (err)=> {
            if(err) res.status(400).json({err: "The record was not found."})
            res.status(200).json({msg: "A Flower was deleted."})
        })
    }
}

module.exports = {
    User, 
    Flower
}