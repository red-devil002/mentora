const { GoogleGenerativeAI } = require("@google/generative-ai")
require('dotenv').config()
const fs = require('fs')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// const model = genAI.getGenerativeModel({ model: "gemini-pro"})
// console.log(model)

async function textGeneration() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"})
    const prompt = "Full form of css?"
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    console.log(text);
}


function genDesc(path, mineType) {
    return{
        inlineData:{
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mineType,
        }
    }
}

async function imageToTextGeneration() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision"})
    const prompt = "Whats is in the images?"
    const imageParts = [
        genDesc("logo.jpeg", "image/jpeg"),
    ]
    const result = await model.generateContent([prompt, ...imageParts])
    const response = await result.response
    const text = response.text()
    console.log(text)
}

async function chatBot(){
    const model = genAI.getGenerativeModel({ model: "gemini-pro"})
    const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Hello" }],
          },
          {
            role: "model",
            parts: [{ text: "Great to meet you. What would you like to know?" }],
          },
        ],
      });
}

// imageToTextGeneration()
// textGeneration()