import OpenAI from "openai";
import express  from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


app.post('/api/recommend', async (req, res) => {
    const prompt = req.body.prompt || "Recommend a movie";

    const systemPrompt = `You are a movie recommendation system 
    Return exactly 3 movies in this Json format:

    [
        {
            "title": "Movie Name",
            "genre": "Movie Genre",
            "year": 2001,
            "summary": "Short summary of the movie",
        },
        ...
    ]

    Only return Json. Do not inclde explanation
    
    `

    try{
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
            {"role": "user", "content": prompt},
            {"role": "system", "content": systemPrompt}
        ],
      });

      const aiReply = completion.choices[0].message.content;
      res.json({ reply: aiReply });
    } catch (error) {
        console.error("Error generating AI response:", error);
        res.status(500).json({ error: "Failed to generate AI response" });
    }
});


app.get('/', (req, res) => {
    res.send("Hello from the server!, try api/recommend");
  });


app.listen(5001, () => {
    console.log("🚀 Server running on http://localhost:5001");
  });
  