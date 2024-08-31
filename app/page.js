"use client"
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Button, Container, Toolbar, Typography, CardActionArea} from "@mui/material";
import Box from '@mui/system/Box';
import Grid from '@mui/system/Unstable_Grid';
import Head from "next/head";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Link from "next/link";
import { Meteors } from "@/components/ui/meteors";
import { Vortex } from "@/components/ui/vortex";

//Takes you back to the homepage
export function LinkButton(){
  return (
    <Link href="/" passHref style={{color: "white", textDecoration: 'none'}}>
      <Typography variant="h6" style={{flexGrow: 1, color: "white", textDecoration: 'none'}}>FlashcardGen</Typography>
    </Link>
  );
}

//Gotta get that smooth scroll man...
const handleScroll = () => {
  document.getElementById("features")?.scrollIntoView({behavior: "smooth"});
};

const handleScroll2 = () => {
  document.getElementById("pricing")?.scrollIntoView({behavior: "smooth"});
};

const handleScroll3 = () => {
  document.getElementById("demo")?.scrollIntoView({behavior: "smooth"});
};

const handleScroll4 = () => {
  document.getElementById("top")?.scrollIntoView({behavior: "smooth"});
};

export default function Home(){
  return (
      <div className="text-3xl md:text-7xl font-bold dark:text-white bg-gray-900">
        <Container id="top" maxWidth = "100vw" sm={{maxWidth: "375px"}} style={{padding: 0, color:"white"}}>
          <Head> {/* For SEO */}
            <title>Flashcard Generator</title>
            <meta name = "description" content="Generate flashcards from text using the power of AI!"/>
          </Head>

          <Vortex
          backgroundColor="transparent"
          className="">
          <AppBar position="static"> {/* Navbar but its called AppBar lol */}
            <Toolbar style={{justifyContent: "space-between", backgroundColor: "#111827"}}>
              <LinkButton/>
              <Box>
                <SignedOut>
                    <Button color="inherit" href="/sign-in">Login</Button>
                    <Button color="inherit" href="/sign-up">Sign Up</Button>
                </SignedOut> 
                <SignedIn>
                  <UserButton/>
                </SignedIn>
              </Box>
            </Toolbar>
          </AppBar>

          <Box textAlign="center" mt={30}>
            <Typography variant="h2">Welcome to FlashcardGen</Typography>
            <Typography variant="h5">Generate flashcards from your text in seconds.</Typography>
            <Button onClick={handleScroll} variant="contained" color="primary" sx={{mt: 4, backgroundColor: "#c084fc"}}>Get Started!</Button>
          </Box>
          </Vortex>

          <Box id="features" mt={30} mb={30} pt={30}>
            <Box sx={{margin: "auto", textAlign: "center", alignItems: "center", justifySelf: "center"}}>
              <Typography variant="h4">Features</Typography>
              <Grid container spacing={2} sx={{justifyContent: "center", margin: 10}}>
                <div className="w-full relative max-w-xs mx-10">
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-400 to-[#362848] transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
                  <div className="relative shadow-xl border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col">
                    <h1 className="font-bold text-center text-xl text-white mb-4 relative z-50">
                      Simplicity & Speed
                    </h1>
                    <p className="font-normal text-base text-white mb-4 relative z-50">
                      Generate flashcards by entering a prompt based on any appropriate topic and generate a set on a click of a button.
                    </p>
                    <Meteors number={20} />
                  </div>
                </div>

                <div className="w-full relative max-w-xs mx-10">
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-400 to-[#362848] transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
                  <div className="relative shadow-xl border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col">
                    <h1 className="font-bold text-center text-xl text-white mb-4 relative z-50">
                      Artificial Intelligence
                    </h1>
                    <p className="font-normal text-base text-white mb-4 relative z-50">
                      With the power of artificial intelligence, we ensure all questions and answers are factualy correct.
                    </p>
                    <Meteors number={20} />
                  </div>
                </div>

                <div className="w-full relative max-w-xs mx-10">
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-400 to-[#362848] transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
                  <div className="relative shadow-xl border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col">
                    <h1 className="font-bold text-center text-xl text-white mb-4 relative z-50">
                      Safe Storage
                    </h1>
                    <p className="font-normal text-base text-white mb-4 relative z-50">
                      Procastination break?... No problem. We allow users to save their flashcards set to study later safely!
                    </p>
                    <Meteors number={20} />
                  </div>
                </div>
              </Grid>
              <Button onClick={handleScroll2} variant="contained" color="primary" sx={{mt: 4, backgroundColor: "#c084fc"}}>Pricing</Button>
            </Box>
          </Box>

          <Box id="pricing" sx={{justifySelf: "center", justifyContent: "center", alignSelf: "center"}} mt={40} pt={10} pb={60}>
          <div className="relative shadow-lg border border-[#362848] overflow-hidden rounded-2xl flex flex-col">
            <Box sx={{my: 6, textAlign: "center"}}>
              <Typography variant="h4">Pricing</Typography>
              <Card className="text-white bg-gradient-to-r from-purple-400 to-[#362848]" sx={{ maxWidth: 345, margin: "auto", marginTop: 5}}>
                <CardActionArea className="hover:bg-gradient-to-r from-purple-400 to-[#1976d2]">
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Pro Subscription
                    </Typography>
                    <Typography variant="h6"> $5 </Typography>
                    <Typography variant="body2">
                      - Access to <b>premium</b> flashcard features
                    </Typography>
                    <Typography variant="body2">
                      - <b>Unlimited</b> Storage
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>

              <Card className="text-white bg-gradient-to-r from-purple-400 to-[#362848]" sx={{ maxWidth: 345, margin: "auto", marginTop: 5}}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Basic <b>(Current Plan)</b>
                  </Typography>
                  <Typography variant="h6"> Free </Typography>
                  <Typography variant="body2">
                    - Access to <b>basic</b> flashcard features
                  </Typography>
                  <Typography variant="body2">
                    - <b>Limited</b> Storage
                  </Typography>
                </CardContent>
              </Card>
              <Typography variant="h6" mt={5}>Still not sure what to do... </Typography>
              <Typography variant="h6">Here is a quick demo to learn more!</Typography>
              <Button onClick={handleScroll3} variant="contained" color="primary" sx={{mt: 4, backgroundColor: "#c084fc"}}>Demo</Button>
            </Box>
          </div>
          </Box>

          <Box id="demo" sx={{justifyContent: "center", alignSelf: "center", textAlign: "center"}} mt={40} pt={10} pb={60}>
            <Typography variant="h4">YouTube video here...</Typography>
            <Link href="/generate" passHref style={{color: "white", textDecoration: 'none', padding: 0, marginRight: "2rem"}}>
              <Button variant="contained" color="primary" sx={{mt: 4, backgroundColor: "#c084fc"}}>Ready to Begin?</Button>
            </Link>
            <Button onClick={handleScroll4} variant="contained" color="primary" sx={{mt: 4, backgroundColor: "#c084fc"}}>Back to Top</Button>
          </Box>
        </Container>
      </div>
  );
}
