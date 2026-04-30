// import nodemailer from "nodemailer";

// export const sendEmail = async (to, subject, html) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS, // App password
//       },
//     });
//     console.log("EMAIL_USER:", process.env.EMAIL_USER);
//     console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
//     const mailOptions = {
//       from: `"Travel Booking" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     };

//     await transporter.sendMail(mailOptions);

//     console.log("✅ Email sent successfully");
//   } catch (error) {
//     console.error("❌ Email error:", error.message);
//   }
// };



//Mailtrap version (for testing, no real emails sent)
// import nodemailer from "nodemailer";
// import { MailtrapTransport } from "mailtrap";
// const transporter = nodemailer.createTransport(
//   MailtrapTransport({
//     token: process.env.MAILTRAP_TOKEN,
//   })
// );

// export const sendEmail = async (to, subject, html) => {
//   try {
//     await transporter.sendMail({
//       from: {
//         address: "djproject963@gmail.com",
//         name: "Travel Booking",
//       },
//       to: [to],
//       subject,
//       html,
//     });

//     console.log("✅ Mailtrap email sent");
//   } catch (error) {
//     console.error("❌ Mailtrap error:", error);
//   }
// };


import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey", // MUST be exactly this string
    pass: process.env.SENDGRID_API_KEY,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    console.log("SENDGRID_API_KEY exists:", !!process.env.SENDGRID_API_KEY);

    const mailOptions = {
      from: `"Travel Booking" <djproject963@gmail.com>`, // must be verified in SendGrid
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent via SendGrid");
  } catch (error) {
    console.error("❌ SendGrid FULL error:", error);
  }
};