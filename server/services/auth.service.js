const User = require("../model/userSchema");
const bcrypt = require('bcrypt');







// exports.signUp = async (userName, email, phoneNumber, password) => {

//   try {


//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);
//     const newUser = {
//       "userName": userName,
//       "email": email,
//       "phoneNumber": phoneNumber,
//       "password": hashedPassword // Store passwords securely (e.g., using bcrypt)
//     };

//     const userCreated = await User.create(newUser);
//     //console.log("created USerData--> ", userCreated);
//     return userCreated;
//   } catch (error) {
//     // Handle errors (e.g., duplicate email)
//     //console.error('Error creating user:', error);
//     return false;
//   }


// };



// exports.login = async (email, password) => {
//   try {
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Find the user in the database
//     const user = await User.findOne({ email });
//     //console.log("user--->", user);
//     // If user not found, return 401 Unauthorized
//     if (!user) {
//       //console.log("user--->1", user);
//       return false;
//     }

//     //console.log("hashedPassword",hashedPassword);
//     //console.log("user.password",user.password);

//     if (await bcrypt.compare(hashedPassword, user.password)) {
//       return user;
//     } else {
//       return false;
//     }

//   } catch (error) {
//     //console.error(error);
//     return false;
//   }

// };



exports.login = async (email, password) => {
  try {

    const user = await User.findOne({ email });
    if (!user) {

      return false;
    }


    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {

      return false;
    }


    return user;

  } catch (error) {
    //console.error('Login error:', error);
    return false;
  }
};



exports.signUp = async (userName, email, phoneNumber, password,role) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      userName,
      email,
      phoneNumber,
      password: hashedPassword,
      role
    };

    const userCreated = await User.create(newUser);
    return userCreated;
  } catch (error) {
    //console.error('Error creating user:', error);
    return false;
  }
};
