const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//sensitive datatai ajilj baigaa tohioldold key ashiglaj ogdog
const { SECRET_KEY } = require("../../config");

//token uusgeh function
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      userName: user.userName,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}
//burtguuleh bolon nevtreh valtiationiig duudaj ogj baina
const { UserInputError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validator");

//mutation todorhoilson ni
module.exports = {
  Mutation: {
    //login mutation
    async login(_, { userName, password }) {
      const { errors, valid } = validateLoginInput(userName, password);

      if (!valid) {
        throw new UserInputError("Error ", { errors });
      }

      const user = await User.findOne({ userName });
      if (!user) {
        errors.general = "user not found";
        throw new UserInputError("user not found", { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }
      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    // register Mutation
    async register(
      _,
      { registerInput: { userName, email, password, confirmPassword } },
      context,
      info
    ) {
      //todo : validate user data
      const { valid, errors } = validateRegisterInput(
        // ug orj irj bui utgin zagvariig hadgalsan
        userName,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        //valid nohtsoliig hangaagui tohioldold aldaanii medeelel haruulna
        throw new UserInputError("Errors", { errors }); // hereglechiin aldaag haruulah heseg
      }
      //todo: make sure user doesnt already exists
      const user = User.findOne({ userName }); //findone function ni mongoosiin function bogood tuhain nohtsoltoi niitsej baigaa tohiodold tuhain elementiig butsaadag herev negees olon utga butsah ym bol ehnii elementiig butsaana
      if (user) {
        //deerh function biyleed tuhain utga db dotroos oldvol aldaanii medeelel haruuulna
        throw new UserInputError("UserName is taken", {
          //aldaanii medeelel haruulah heseg
          errors: {
            userName: "this username is taken",
          },
        });
      }

      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        userName,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      const token = generateToken(res);
      return {
        ...res._doc,
        id: res.id,
        token,
      };
    },
  },
};
