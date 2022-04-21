const { AuthendicationError } = require("apollo-server");

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

module.exports = (context) => {
  //context ={..header}
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    // bearer ...
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch (err) {
        // error handler. oruulj bui medeelel aldaatai bol aldaag haruulah
        throw new AuthendicationError("Invalid/Expired token");
      }
    }
    throw new Error("Authendication token must be 'Bearer[token]");
  }
  throw new Error("authorization header must be provided");
};
