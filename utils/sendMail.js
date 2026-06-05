// import nodemailer from "nodemailer";



// const getTransporter = () => {
//   console.log("utilmail: "+process.env.EMAIL_USER)
//   console.log("utilpassword: "+process.env.EMAIL_PASS)
//   return nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
// };

// export default getTransporter;

import nodemailer from "nodemailer";

const getTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export default getTransporter;