"use client"
import { db } from "@/firebase";
import { SignIn, useUser } from "@clerk/nextjs";
import { AppBar, Button, Container, Toolbar, Typography, Paper, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@mui/material";
import Box from '@mui/system/Box';
import { collection, writeBatch, doc, getDoc, setDoc } from "firebase/firestore";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from "@mui/material/CardActionArea";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NextResponse } from "next/server";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

//Takes you back to the homepage
// function LinkButton(){
//     return (
//       <Link href="/" legacyBehavior>
//         <a style={{textDecoration: 'none'}} onClick={(e) => {
//           e.preventDefault(); //should prevent the default action from happening, learning something new :)
//           window.location.href = '/';}}>
//             <Typography variant="h6" style={{flexGrow: 1, color: "white"}}>FlashcardGen</Typography>
//         </a>
//       </Link>
//     );
// }

export default function Generate(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([]) //for flashcards
    const [flipped, setFlipped] = useState([]) //for flipping flashcards
    const [text, setText] = useState("") //for the text of flashcard
    const [name, setName] = useState("") //for the name of flashcard
    const [open, setOpen] = useState(false) //for modals
    const router = useRouter() //to route between pages

    // const handleSubmit = async () => {
    //     fetch('api/generate', {
    //         method: 'POST',
    //         body: text,
    //     }).then((res) => res.json()).then((data) => setFlashcards(data))
    // }

    const parseFlashcards = (text) => {
        if (typeof text !== "string" || text.trim() === "") {
            console.error("Invalid text input to parseFlashcards:", text);
            return [];
        }
    
        // Split the text by newlines to separate flashcards
        const flashcardsSects = text.trim().split('\n');
        console.log("Flashcards Sections:", flashcardsSects);
    
        let flashcards = [];
        flashcards = flashcardsSects.map((section) => {
            // Ensure there's a $ separator for front and back
            if (!section.includes("$")) {
                console.error("Invalid flashcard format, missing $:", section);
                return null;
            }
    
            const [frontPart, backPart] = section.split("$");
            const front = frontPart.replace("Front of card: ", "").trim();
            const back = backPart.replace("Back of card: ", "").trim();
    
            if (front && back) {
                return { front, back };
            } else {
                console.error("Incomplete flashcard:", { front, back });
                return null;
            }
        }).filter(flashcard => flashcard !== null);
    
        console.log("Parsed Flashcards Array:", flashcards);
        return flashcards;
    };
    

    // const parseFlashcards = (text) => {
    //     if (typeof text !== "string" || text.trim() === "") {
    //         console.error("Invalid text input to parseFlashcards:", text);
    //         return [];
    //     }
    
    //     // Split the text by double newlines to separate individual flashcards
    //     const flashcardsSects = text.trim().split('\n');
    //     console.log("ffsects:", flashcardsSects)
    //     let flashcards = []
    //     // Map each section into a flashcard object
    //     flashcards = flashcardsSects.map((section) => {
    //         // Split each section by single newline to separate the front and back of the card
    //         const lines = section.split("$");
            
    //         if (lines){
    //             const front = lines[0].replace("Front of card: ", "").trim();
    //             const back = lines[1].replace("Back of card: ", "").trim();
    //             return { front, back };
    //         } 
            
    //         else{
    //             console.error("Invalid flashcard format:", section);
    //             return null;
    //         }
    //     }).filter(flashcard => flashcard !== null);
    
    //     console.log("Parsed Flashcards Array:", flashcards);
    //     return flashcards;
    // };
    

    // const parseFlashcards = (text) => { //based off of what i get back from gemeni, parsing string to parse each flashcard, then storing into array
    //     if (typeof text !== "string" || text.trim() === ""){
    //         console.error("Invalid text input to parseFlashcards:", text);
    //         return [];
    //     }
        
    //     // const flashcardsSects = text.split("\n\n"); //splitting each question from one another and moving into a new line.
    //     // const flashcards = [];
        
    //     const flashcardsSects = text.trim().split("\n\n");
        
    //     // Map each section into a flashcard object
    //     const flashcards = flashcardsSects.map(section => {
    //         const [frontLine, backLine] = section.split("\n");
                
    //         if (!frontLine || !backLine) {
    //             console.error("Invalid flashcard format:", section);
    //             return null;
    //         }
        
    //         const front = frontLine.replace("Front of card: ", "").trim();
    //         const back = backLine.replace("Back of card: ", "").trim();
        
    //         return { front, back };
    //     }).filter(flashcard => flashcard !== null);
        
    //     console.log("Parsed Flashcards Array:", flashcards); // Debug output
    //     return flashcards;
        

        // const flashcards = text.split("\n").map(line => {
        //     const [front, back] = line.split(" : ");
        //     if (front && back) {
        //         return { front: front.trim(), back: back.trim() };
        //     } else {
        //         return null;
        //     }
        // }).filter(flashcard => flashcard !== null);

        // flashcardsSects.forEach((section) => {
        //     const lines = section.split("\n");
        //     console.log(lines); //debug
        //     if (lines.length >= 2){
        //         const front = lines[0].replace("Front of card: ", "").trim();
        //         const back = lines[1].replace("Back of card: ", "").trim();
        //         flashcards.push({front, back});
        //     }
        // });

        // console.log("flashcards array:", flashcards)
        // return flashcards;
    // };

    const handleSubmit = async () => {
        console.log("Sending prompt to bot...");
        const response = await fetch('api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({content: text}),
        });

        if (response.ok){
            // const responseData = await response.json().catch((error) => {
            //     console.error("Failed to parse JSON:", error);
            //     return {};
            // });
            const responseData = await response.json();
    
            console.log("the data:", responseData.trim());
    
            // const textResponse = responseData.text || "";
            // console.log("the text from data:", textResponse);
    
            // if (textResponse){
            // const sampleData = `Front of card: What is the name of the largest volcano in the solar system, located on Mars?$Back of card: Olympus Mons\nFront of card: What are the two moons of Mars called?$Back of card: Phobos and Deimos\nFront of card: What is the average temperature on Mars?$Back of card: -62°C (-80°F)\nFront of card: What is the average temperature on Mars?$Back of card: -62°C (-80°F)\nFront of card: What is the average temperature on Mars?$Back of card: -62°C (-80°F)\nFront of card: What is the average temperature on Mars?$Back of card: -62°C (-80°F)\nFront of card: What is the average temperature on Mars?$Back of card: -62°C (-80°F)\nFront of card: What is the average temperature on Mars?$Back of card: -62°C (-80°F)\nFront of card: What is the average temperature on Mars?$Back of card: -62°C (-80°F)\nFront of card: What is the average temperature on Mars?$Back of card: -62°C (-80°F)`;
            // const formattedFlashcards = parseFlashcards(sampleData);
            // setFlashcards(formattedFlashcards);
                
            const formattedFlashcards = parseFlashcards(responseData.trim());
            console.log("The formatted flashcards:", formattedFlashcards);

            if (formattedFlashcards.length > 0) {
                setFlashcards(formattedFlashcards);
            } else {
                console.error("No flashcards were parsed.");
            }
            // }

            // else
            //     console.error("No valid text response received from AI.");
        }
        else
            console.error("Failed to fetch the response from the AI bot :(");
    };

    const handleCardClick = (id) => { //gonna handle each card, an id for each card
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }

    const handleOpen = () => { //for opening modal
        setOpen(true);
    }

    const handleClose = () => { //for closing modal
        setOpen(false);
    }

    const saveFlashcards = async() => { //for saving flashcards
        if (!name){
            alert("Please enter a name.")
            return
        }
        try{
            const batch = writeBatch(db); //writing all flashcards at once so making batch
            const userDocRef = doc(collection(db, 'users'), user.id);
            const docSnapshot = await getDoc(userDocRef);

            if (docSnapshot.exists()) {
                const collections = docSnapshot.data().flashcards || [];
                await setDoc(docRef, { quantity: quantity + 1 });

                if (collections.find((f) => f.name === name)){
                    alert("Flashcard set with the same name already exists..");
                }

                else{
                    collections.push({name});
                    batch.set(userDocRef, {flashcards: collections}, {merge: true}); //enabling merge to ensure previous data is not overwritten.
                }
            }  
            
            else 
                batch.set(userDocRef, {flashcards: [{name}]});

            const columnRef = collection(userDocRef, name)
            flashcards.forEach((f) => {
                const cardDocRef = doc(columnRef);
                batch.set(cardDocRef, f)
            })

            await batch.commit()
            handleClose();
            router.push('/flashcards')
        } 
        catch (error){
            console.error("Error adding item:", error);
        }
    }

    return(
    //     <Container maxWidth="100vw" sm={{ maxWidth: "375px" }} style={{ padding: 0 }}>
    //     <Box sx={{ mt: 4, mb: 6, display: "flex", flexDirection: "column", alignItems: "center" }}>
    //         <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ mt: 5 }}>
    //             <Typography variant="h4" sx={{ mb: 5 }}>Generate Flashcards</Typography>
    //         </Box>
    //         <Paper sx={{ p: 4, width: '50vw' }}>
    //             <TextField
    //                 value={text}
    //                 onChange={(e) => setText(e.target.value)}
    //                 label="Enter text here.."
    //                 multiline
    //                 fullWidth
    //                 rows={4}
    //                 variant="outlined"
    //                 sx={{ mb: 2 }}
    //             />
    //         </Paper>
    //         <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 4, width: '50vw' }}>Submit</Button>
    //     </Box>
    //     {Array.isArray(flashcards) && flashcards.length > 0 && (
    //         <Box sx={{ mt: 4, mb: 6, display: "flex", flexDirection: "column", alignItems: "center" }}>
    //             <Typography variant="h5">Your Flashcards</Typography>
    //             <Grid container spacing={3}>
    //                 {flashcards.map((flashcard, index) => (
    //                     <Grid item xs={12} sm={6} md={4} key={index}>
    //                         <Card sx={{ maxWidth: 345, margin: "auto", marginTop: 5 }}>
    //                             <CardActionArea onClick={() => handleCardClick(index)}>
    //                                 <CardContent>
    //                                     <Box
    //                                         sx={{
    //                                             perspective: '1000px',
    //                                             position: 'relative',
    //                                             width: '100%',
    //                                             height: '200px',
    //                                             boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    //                                             transition: 'transform 0.6s',
    //                                             transformStyle: 'preserve-3d',
    //                                             transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
    //                                         }}>
    //                                         <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' }}>
    //                                             <Typography variant="h5" component="div">
    //                                                 {flashcard.front}
    //                                             </Typography>
    //                                         </div>
    //                                         <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
    //                                             <Typography variant="h5" component="div">
    //                                                 {flashcard.back}
    //                                             </Typography>
    //                                         </div>
    //                                     </Box>
    //                                 </CardContent>
    //                             </CardActionArea>
    //                         </Card>
    //                     </Grid>
    //                 ))}
    //             </Grid>
    //             <Box sx={{mt: 4, display: "flex", justifyContent:"center"}}>
    //                 <Button onClick={handleOpen} variant="contained" color="primary">Save</Button>
    //             </Box>
    //         </Box>
    //     )}

    //     <Dialog open={open} onClose={handleClose}>
    //         <DialogTitle>
    //             Save Flashcards
    //         </DialogTitle>
    //         <DialogContent>
    //             <DialogContentText>
    //                 Please enter a name for your set of flashcards.
    //             </DialogContentText>
    //             <TextField 
    //                 type="text"
    //                 value={name}
    //                 onChange={(e) => setName(e.target.value)}
    //                 label="Enter name here.."
    //                 autoFocus
    //                 fullWidth
    //                 margin="dense"
    //                 variant="outlined"
    //                 sx={{mt: 4}}/>
    //         </DialogContent>
    //         <DialogActions>
    //             <Button onClick={handleClose}>Cancel</Button> {/* Cancel button */}
    //             <Button onClick={saveFlashcards}>Save</Button> {/* Save button */}
    //         </DialogActions>
    //     </Dialog>
    // </Container>
        <div className="min-h-screen bg-gray-900 pb-10 flex flex-col items-center">
            <div className="text-white bg-gray-800 mt-10 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Generate Flashcards</h2>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text here..."
                    rows={4}
                    className="w-full border border-gray-300 p-2 rounded-lg mb-4 text-black"
                />
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    className="hover:bg-[#c084fc] text-white px-4 py-2 rounded-lg w-full">
                    Submit
                </Button>
            </div>

            {Array.isArray(flashcards) && flashcards.length > 0 && (
                <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-10 mt-8">
                {/* {flashcards.map((flashcard, index) => (                    
                    <div key={index} className={`justify-center cursor-pointer transform transition-transform duration-500 ease-in-out ${
                        flipped[index] ? "rotate-y-180" : ""}`}
                        onClick={() => handleCardClick(index)}>
                            <CardContainer className="inter-var">
                            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
                                <CardItem
                                    translateZ="50"
                                    className="text-xl font-bold text-neutral-600 dark:text-white">
                                    Make things float in air
                                </CardItem>
                                <CardItem
                                    as="p"
                                    translateZ="60"
                                    className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
                                    Hover over this card to unleash the power of CSS perspective
                                </CardItem>
                                <CardItem translateZ="100" className="w-full mt-4">
                                </CardItem>
                            </CardBody>
                            {/* <div className={`p-5 bg-gray-900 text-white inset-0 flex justify-center items-center ${
                                flipped[index] ? "hidden" : ""
                            }`}>
                                <p className="text-[0.5rem] font-medium text-center md:text-md sm:text-sm">
                                    {flashcard.front}
                                </p>
                            </div>
                            <div className={`p-5 bg-gray-900 text-white inset-0 flex justify-center items-center ${
                                !flipped[index] ? "hidden" : ""
                                } transform rotate-y-180`}>
                                <p className="text-[0.5rem] font-medium text-center md:text-md sm:text-sm">
                                    {flashcard.back}
                                </p>
                            </div>
                            </CardContainer>
                    </div>
                ))} */}

                {flashcards.map((flashcard, index) => (
                    <div key={index} className={`justify-center cursor-pointer transform transition-transform duration-500 ease-in-out ${
                        flipped[index] ? "rotate-y-180" : ""}`}
                        onClick={() => handleCardClick(index)}>
                        <CardContainer className="inter-var">
                            <CardBody className="p-5 bg-blue-500 text-white inset-0 flex justify-center items-center rounded-lg">
                                <CardItem
                                    translateZ="50"
                                    className={`text-[0.5rem] font-medium text-center md:text-md sm:text-sm dark:text-white ${
                                        flipped[index] ? "hidden" : ""}`
                                    }>
                                    {flashcard.front}
                                </CardItem>
                                <CardItem
                                    translateZ="50"
                                    className={`text-[0.5rem] font-medium text-center md:text-md sm:text-sm dark:text-white ${
                                        !flipped[index] ? "hidden" : ""}`
                                    }>
                                    {flashcard.back}
                                </CardItem>
                            </CardBody>
                        </CardContainer>
                    </div>
                ))}
                </div>
            )}
        </div>
    )
}
