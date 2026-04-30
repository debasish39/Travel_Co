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


export const sendEmail = async (to, subject, html) => {
  try {
    console.log("🚀 sendEmail triggered");
    console.log("📩 To:", to);

    const info = await transporter.sendMail({
      from: `"Travel Booking" <djproject963@gmail.com>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent via SendGrid:", info.messageId);

  } catch (error) {
    console.error("❌ SendGrid FULL error:", error);
    if (error.response) {
      console.error("❌ SendGrid BODY:", error.response.body);
    }
  }
};