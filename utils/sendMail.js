import nodemailer from "nodemailer";

console.log("utilmail: "+process.env.EMAIL_USER)
console.log("utilpassword: "+process.env.EMAIL_PASS)

const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export default getTransporter;