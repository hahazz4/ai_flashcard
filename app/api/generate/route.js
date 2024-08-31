import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// const botPrompt = `
// You are a flashcard creator, your task is to generate effective and concise flashcards on various topics. Follow these guidelines:

// 1. Create clear and concise questions on the front of each flashcard.
// 2. Provide brief, accurate answers on the back of each flashcard.
// 3. Focus on key concepts, definitions, facts, or relationships.
// 4. Use simple language to ensure clarity and ease of understanding.
// 5. Avoid overly complex or lengthy explanations on the back of the card.
// 6. Include mnemonic devices or memory aids when appropriate.
// 7. For language flashcards, include pronunciation guides when necessary.
// 8. For mathematical or scientific concepts, include formulas or equations where relevant.
// 9. Use a consistent format for similar types of information.
// 10. Create sets of related flashcards that build upon each other for comprehensive learning.
// 11. Tailor the difficulty level to the intended audience (e.g., beginner, intermediate, advanced).
// 12. Include visual elements or diagrams when they enhance understanding.
// 13. For historical events, include key dates, figures, and outcomes.
// 14. For vocabulary flashcards, include parts of speech and example sentences.
// 15. Create reverse flashcards when appropriate (e.g., definition to term, as well as term to definition).
// 16. Only generate 10 flashcards.

// You must remember that the goal is to facilitate effective learning and retention of information through these flashcards!

// Return in the following JSON format
// {
//     "flashcards":[{
//         "front" : str,
//         "back" : str
//     }]
// }

// User's input: "${lastMsg?.content || 'No content'}
// `

export async function GET(req){
    return NextResponse.json({ error: "Nice try buddy.." },{status: 405});
}

export async function POST(req){
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    try {
        const model = await genAI.getGenerativeModel({model: "gemini-1.5-flash"});
        // const body = req.body?.content
        const body = await req.json();
        const lastMsg = body.content || "";
        // const result = await model.generateContent({
        //     contents: [
        //         { role: "system", text: botPrompt },
        //         { role: "user", text: body.content}
        //     ]});

        // const candidates = response?.response?.candidates;
        // console.log("Candidates:", JSON.stringify(candidates, null, 2));
        
        const botPrompt = `
        You are a flashcard creator, your task is to generate effective and concise flashcards on various topics. Follow these guidelines:

        1. Create clear and concise questions on the front of each flashcard.
        2. Provide brief, accurate answers on the back of each flashcard.
        3. Focus on key concepts, definitions, facts, or relationships.
        4. Use simple language to ensure clarity and ease of understanding.
        5. Avoid overly complex or lengthy explanations on the back of the card.
        6. Include mnemonic devices or memory aids when appropriate.
        7. For language flashcards, include pronunciation guides when necessary.
        8. For mathematical or scientific concepts, include formulas or equations where relevant.
        9. Use a consistent format for similar types of information.
        10. Create sets of related flashcards that build upon each other for comprehensive learning.
        11. Tailor the difficulty level to the intended audience (e.g., beginner, intermediate, advanced).
        12. Include visual elements or diagrams when they enhance understanding.
        13. For historical events, include key dates, figures, and outcomes.
        14. For vocabulary flashcards, include parts of speech and example sentences.
        15. Create reverse flashcards when appropriate (e.g., definition to term, as well as term to definition).
        16. Only generate 10 flashcards.

        You must remember that the goal is to facilitate effective learning and retention of information through these flashcards!

        Generate flashcards with the following format:
        1. Front of card: [Question]
        2. Back of card: [Answer]

        Ensure that:
        - Each flashcard starts with "Front of card: " followed by the question.
        - After each question, on the same line have a $ right before, "Back of card: " followed by the answer.
        - Separate each flashcard with a newline character right after the answer.
        - Repeat for each question all on one single line.

        Example format for 2 questions:
        Front of card: What is the name of the largest volcano in the solar system, located on Mars?$Back of card: Olympus Mons\nFront of card: What is the average temperature on Mars?$Back of card: -62°C (-80°F)\n

        The user's input of topic: "${lastMsg}"`;


        const response = await model.generateContent(botPrompt);
        // const response = await model.generateContent(botPrompt)
        console.log("Received response from AI:", JSON.stringify(response, null, 2));
        
        const candidates = response?.response?.candidates;
        console.log("Candidates:", JSON.stringify(candidates, null, 2));
        
        const text = candidates?.[0]?.content?.parts?.[0]?.text || "No response...";
        console.log("the text:", JSON.stringify(text, null, 2))
        const result = text.trim();
        // Attempt to parse the response as JSON
        // try {
        //     // const flashcards = JSON.parse(resultText);
        //     return NextResponse.json({ flashcards: resultText }, { status: 200 });
        // } catch (error) {
            // console.error("Failed to parse JSON. Returning as plain text.");
        // return NextResponse.json({ flashcards: [{ front: text, back: "" }] }, { status: 200 });
        return NextResponse.json((result), {status: 200})
        // }
    } catch (error) {
        console.error("Error generating AI response:", error);
        return NextResponse.json({ error: "Failed to generate text", details: error.message }, { status: 500 });
    }
}
