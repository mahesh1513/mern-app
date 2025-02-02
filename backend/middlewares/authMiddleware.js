const express = require('express');
const jwt = require('jsonwebtoken');
const checkAuth = (req,res,next) => {
    
    let token = req.headers.authorization;
    if(token && token.includes("Bearer")) {

        token = token.replace("Bearer","").trim();
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decoded_user) => {

            if(err) {
                res.status(401).json({message:"Token is not authorized or missing!!!"});
            } else {
                req.user = decoded_user;
                next();
            }
        })

    } else {
        res.status(401).json({message:"Token is not authorized or missing!!!"})
    }

}
module.exports = checkAuth