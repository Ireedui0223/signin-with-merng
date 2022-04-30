const postsResolvers = require("./posts");

const usersResolvers = require("./users");
const commentsResolvers = require("./comments");
module.exports = {
  Post: {
    //subscription esvel mutation post butsaaj baival ene post modifier-r damjih bolno
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postsResolvers.Query,
    ...usersResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
};
