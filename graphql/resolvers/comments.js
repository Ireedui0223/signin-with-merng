const Post = require("../../models/post");
const checkAuth = require("../../util/check-auth");
const { UserInputError, AuthenticationError } = require("apollo-Server");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      //   console.log("test");
      const { userName } = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "comment body must not empty",
          },
        });
      }
      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          userName,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else throw new UserInputError("post not found");
    },
    async deleteComment(_, { postId, commentId }, context) {
      const { userName } = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id == commentId);
        if (post.comments[commentIndex].userName === userName) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("action not allowed");
        }
      } else {
        throw new UserInputError("post not found");
      }
    },
  },
};
