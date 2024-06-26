import express from "express";
import mongoose from "mongoose";
import path from "path";
import { v2 } from "cloudinary";
import { translate } from "google-translate-api-x";
import cloudinary from "cloudinary";
import http from "http";
import qs from "querystring";
import fs from "fs/promises";
import { GoogleGenerativeAI } from "@google/generative-ai";
import nodemailer from "nodemailer";
import multer from "multer";
import "dotenv/config";
import cron from "node-cron";
import jwt from "jsonwebtoken";
import cors from "cors";
import User from "./schema/UserSchems.js";
import axios from "axios";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import puppeteer from "puppeteer";
import { AssemblyAI } from "assemblyai";
import Feedback from "./schema/FeedbackSchema.js";
const server = express();

server.use(express.json());
server.use(cors());

const genAI = new GoogleGenerativeAI("AIzaSyCvf6GdLaxRKR8-5RscFksqV1jrKlo-zNc");

let PORT = 8000;

mongoose.connect(
  "mongodb+srv://varad:varad6862@cluster0.0suvvd6.mongodb.net/hacksparrow",
  {
    autoIndex: true,
  }
);

const sendEmail = async function (data, user) {
  console.log("varad");
  const transporter = nodemailer.createTransport({
    // host:process.env.SMPT_HOST,
    // port: process.env.SMPT_PORT,
    host: "smtp.elasticemail.com",
    port: 587,
    secure: false,
    auth: {
      user: "fakeacc6862@gmail.com",

      pass: "47E85993DC7394854F4E87B9F47289D636F1",
    },
  });

  const emailTemplate = `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>News Summary</title>
  <style>
      body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4; /* Light gray background color */
      }
      .container {
          max-width: 800px;
          margin: 20px auto;
          padding: 0 20px;
          background-color: #fff; /* White background color */
          border-radius: 8px; /* Rounded corners for the container */
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Box shadow for a subtle elevation effect */
      }
      h1 {
          text-align: center; /* Center-align the heading */
          margin-top: 20px; /* Add some space above the heading */
          color: #333; /* Dark text color */
      }
      .news-item {
          margin-bottom: 20px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 15px; /* Increased padding for better spacing */
      }
      .news-item h2 {
          margin-top: 0;
          margin-bottom: 10px; /* Add space below the heading */
          color: #333; /* Dark text color */
      }
      .news-item p {
          margin-bottom: 10px; /* Adjust spacing between paragraphs */
          color: #555; /* Medium dark text color */
      }
      .news-item a {
          text-decoration: none;
          color: #007bff; /* Link color */
      }
      .news-item a:hover {
          text-decoration: underline; /* Underline on hover */
      }
  </style>
  </head>
  <body>
  <div class="container">
      <h1>Latest News</h1>
      <div class="news-item">
          <h2>News Title 1</h2>
          <p>${data}</p>      </div>
  </div>
  </body>
  </html>
  
  `;

  await transporter.sendMail({
    // from: process.env.SMPT_FROM_HOST ,
    from: "fakeacc6862@gmail.com",
    to: user,
    subject: "new summmury",
    html: emailTemplate,
  });
};
const sendEmail2 = async function (data, user) {
  console.log("varad");
  const transporter = nodemailer.createTransport({
    // host:process.env.SMPT_HOST,
    // port: process.env.SMPT_PORT,
    host: "smtp.elasticemail.com",
    port: 587,
    secure: false,
    auth: {
      user: "fakeacc6862@gmail.com",

      pass: "47E85993DC7394854F4E87B9F47289D636F1",
    },
  });

  const emailTemplate = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Congratulations!</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f0f0f0;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
              text-align: center;
              margin-bottom: 30px;
          }
          .header h1 {
              color: #333;
          }
          .message {
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 5px;
              text-align: center;
          }
          .message h2 {
              color: #007bff;
              margin-bottom: 10px;
          }
          .signature {
              margin-top: 30px;
              text-align: center;
          }
          .signature p {
              margin: 5px 0;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Congratulations!</h1>
          </div>
          <div class="message">
              <h2>You are hired!</h2>
              <p>We are thrilled to inform you that you have been hired at [Company Name].</p>
              <p>Welcome to the team! We look forward to working with you and achieving great success together.</p>
          </div>
          <div class="signature">
              <p>Best regards,</p>
              <p>${data}</p>
             
          </div>
      </div>
  </body>
  </html>
  `;

  await transporter.sendMail({
    // from: process.env.SMPT_FROM_HOST ,
    from: "fakeacc6862@gmail.com",
    to: user,
    subject: "new placement offer from your college",
    html: emailTemplate,
  });
};

// function myTask() {
//   console.log("Cron job is running...");
// }

// // Schedule a cron job to run myTask every minute
// cron.schedule("* 0 * * * *", myTask);

const formatDataToSend = (user) => {
  const access_token = jwt.sign(
    {
      id: user._id,
    },
    "varad177"
  );

  return {
    access_token,
    email: user.email,
    username: user.username,
    _id: user._id,
    status: user.status,
  };
};

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({
      error: "no access token",
    });
  }

  jwt.verify(token, "varad177", (err, user) => {
    if (err) {
      return res.status(403).json({
        error: "access token invalid",
      });
    }

    req.user = user.id;
    next();
  });
};

// config cloudinary
v2.config({
  cloud_name: "do8ji7uqc",
  api_key: "738935516257416",
  api_secret: "DX5PLGdpT-OBOxYhTlq6l5vCNxY",
});

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 mb in size max limit
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  fileFilter: (_req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".webp" &&
      ext !== ".png" &&
      ext !== ".mp4"
    ) {
      cb(new Error(`Unsupported file type! ${ext}`), false);
      return;
    }

    cb(null, true);
  },
});

//server creates above

//all routes come below

server.post("/signup", async (req, res) => {
  const { username, email, password, country } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create a new user
    const newUser = new User({ username, email, password, country });
    return newUser.save().then((u) => {
      return res.status(200).json(formatDataToSend(u));
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

server.post("/login", async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // Check if the user exists with the provided email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the provided password matches the stored password

    if (user.password != password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    return res.status(200).json(formatDataToSend(user));
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

//compony routes

//gemini

// server.post("/google", async (req, res) => {
//   const { prompt } = req.body;

//   console.log(prompt);

//   const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   const text = response.text();

//   return res.status(200).json(text);
// });

server.post("/news", async (req, res) => {
  const { country = "in", cat, pagesize = 15, page } = req.body;

  let category = cat ? cat : "";
  // const apiKey = "c6016f699894412bbf4a510194f7787b";
  // const apiKey = "720f8330961644819519fcbb2766699a";
  // const apiKey = "0ac62707cf514837b818e1320b5d9635";
  // const apiKey = "d50506d188ea4f8eb2750887160eed27";
  // const apiKey = "bc2fbd3b5e5d4477842cb1e1c2b84704";
  const apiKey = "a799023e7b934f25b8833f3b199058a5";
  const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pagesize}`;

  try {
    const response = await axios.get(url);
    console.log(response.data); // Log the response data

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching news:", error);
    return res.status(500).json({
      error: "Unable to fetch news",
    });
  }
});

server.post("/detail-news", async (req, res) => {
  try {
    const { currentUrl } = req.body;
    // Fetch the HTML content of the article using axios
    const articleHtml = await axios.get(currentUrl);

    // Create a DOM object from the article HTML using JSDOM
    const dom = new JSDOM(articleHtml.data, {
      url: "https://sportstar.thehindu.com/", // Provide a valid URL here if needed
    });

    // Parse the article content using Readability
    const article = new Readability(dom.window.document).parse();

    // Send the parsed article content as JSON response
    return res.status(200).json({ article });
  } catch (error) {
    console.error("Error fetching or parsing the article:", error);
    return res.status(500).json({
      error: "Unable to fetch or parse the article",
    });
  }
});

const colorBackgroundMap = {
  red: "#00FFFF", // Cyan (opposite of red)
  blue: "#FFCC00", // Gold (opposite of blue)
  green: "#FF0099", // Magenta (opposite of green)
  yellow: "#6600FF", // Indigo (opposite of yellow)
  orange: "#0066FF", // Cobalt blue (opposite of orange)
  purple: "#FFFF00", // Yellow (opposite of purple)
  pink: "#00FFFF", // Cyan (opposite of pink)
  brown: "#66CCFF", // Light blue (complementary to brown)
  black: "#FFFFFF", // White (for contrast)
  white: "#000000", // Black (for contrast)
};

// Function to get background color based on color name
function getBackgroundColor(colorName) {
  // Lookup color name in the colorBackgroundMap
  return colorBackgroundMap[colorName.toLowerCase()] || "#FFFFFF"; // Default to white if color not found
}

// Example usage in your server endpoint
server.post("/speech-to-text", async (req, res) => {
  const { transcription } = req.body; // Assuming the transcribed text is sent in the request body

  // Extract color name from the transcription
  const colorName = extractColorName(transcription);

  if (!colorName) {
    return res
      .status(400)
      .json({ error: "No color name found in the transcription" });
  }

  // Get the corresponding background color
  const backgroundColor = getBackgroundColor(colorName);

  console.log(colorName, backgroundColor);
  return res.status(200).json({ colorName, backgroundColor });
});

function extractColorName(text) {
  // Logic to extract color name from the text (you can use regex or any other method)
  const colorNames = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
    "pink",
    "brown",
    "black",
    "white",
  ];
  const words = text.toLowerCase().split(" ");
  for (const word of words) {
    if (colorNames.includes(word)) {
      return word;
    }
  }
  return null; // Return null if no color name is found
}

const client = new AssemblyAI({
  apiKey: "255d5603d3394e408f18ab3b618920e5",
});

const audioUrl =
  "https://storage.googleapis.com/aai-web-samples/5_common_sports_injuries.mp3";

// Assuming you have an Express app instance
server.post("/update-cats", async (req, res) => {
  const { cats, _id: userId } = req.body;

  try {
    // Find the user by userId and update the 'cats' field with the new categories
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { cats: cats } }, // Using $set to replace existing categories with new categories
      { new: true }
    );

    if (!updatedUser) {
      // Handle case where user is not found
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user categories:", error);
    res.status(500).json({ error: "Could not update user categories" });
  }
});

server.post("/get-cats", async (req, res) => {
  try {
    const { _id } = req.body;

    const users = await User.findById(_id);

    return res.status(200).json(users.cats);
  } catch (error) {
    console.log(error.message);
  }
});

//   const textToTranslate = "hii , how are u ";

//   const translateOptions = { ...options };
//   translateOptions.path = "/language/translate/v2";

//   const translateReq = http.request(translateOptions, (translateRes) => {
//     const chunks = [];

//     translateRes.on("data", (chunk) => {
//       chunks.push(chunk);
//     });

//     translateRes.on("end", () => {
//       const body = Buffer.concat(chunks);
//       const translatedText = JSON.parse(body.toString());
//       res.json({ translatedText });
//     });
//   });

//   translateReq.write(
//     qs.stringify({
//       q: textToTranslate,
//       target: "hi", // Change 'fr' to the desired target language code
//     })
//   );
//   res.send({translatedText });
//   translateReq.end();
// });

server.post("/feedback", async (req, res) => {
  try {
    // Extract rating, feedbackText, and _id from the request body
    const { rating, feedbackText, _id } = req.body.feedbackData;

    // Assuming User is a Mongoose model, retrieve user data based on _id
    const user = await User.findById(_id);

    // Create a new instance of Feedback using the extracted data
    const newFeedback = new Feedback({
      rating,
      feedbackText,
      name: user ? user.username : "Anonymous", // Set name based on user existence
    });

    // Save the feedback to the database
    const savedFeedback = await newFeedback.save();

    // Send the updated feedback in the response
    res.status(200).json({
      message: "Feedback submitted successfully",
      feedback: savedFeedback, // Include the saved feedback in the response
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res
      .status(500)
      .json({ error: "An error occurred while submitting feedback" });
  }
});

server.get("/all-feedback", async (req, res) => {
  try {
    const feedback = await Feedback.find({});

    return res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

server.post("/translate", async (req, res) => {
  const { text } = req.body; // Extract text to translate and target language from request body

  try {
    // Perform translation using google-translate-api-x
    const translation = await translate(text, { to: "hi" });

    // Send the translated text in the response
    res.json({
      translatedText: translation.text,
      fromLanguage: translation.from.language.iso,
    });
  } catch (error) {
    console.error("Error during translation:", error);
    res.status(500).json({ error: "Translation failed" }); // Send an error response
  }
});

server.post("/send-sum-mail", async (req, res) => {
  try {
    const { sum, _id } = req.body;
    const user = await User.findById(_id);
    await sendEmail(sum, user.email);
    return res.status(200).json({ message: "email send successfully.." });
  } catch (error) {
    res.status(500).json({ error: error.message }); // Send an error response
  }
});

server.post("/google", async (req, res) => {
  const { prompt } = req.body;

  console.log(prompt);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return res.status(200).json(text);
});


server.listen(PORT, () => {
  console.log(`listing on ${PORT}`);
});

// https://newsapi.org/v2/everything?q=tesla&from=2024-02-22&sortBy=publishedAt&apiKey=API_KEY

// https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=API_KEY
