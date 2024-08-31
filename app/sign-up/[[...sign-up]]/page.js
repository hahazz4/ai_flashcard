import { SignIn, SignUp } from "@clerk/nextjs";
import { AppBar, Button, Container, Toolbar, Typography} from "@mui/material";
import Box from '@mui/system/Box';
import Link from "next/link";
import { NextResponse } from "next/server";

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

export default function SignUpPage(){
    return( 
        <Container className="text-white bg-gray-900" height="100vh" maxWidth = "100vw" sm={{maxWidth: "375px"}} style={{padding: 0}}>
            <AppBar position="static"> {/* Navbar but its called AppBar lol */}
                <Toolbar style={{justifyContent: "space-between", backgroundColor: "#111827"}}>
                    <Typography variant="h6" style={{flexGrow: 1, color: "white"}}>FlashcardGen</Typography>
                    <Box>
                        <Button color="inherit">
                            <Link href="/sign-in" passHref sx={{color: "white", textDecoration: "none"}}>Login</Link>
                        </Button>
                        <Button color="inherit">
                            <Link href="/sign-up" passHref>Sign Up</Link>
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box height="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingBottom={10}>
                <Typography variant="h4" sx={{mb: 5}}>Sign Up</Typography>
                <SignUp/>
            </Box>
        </Container>
)}
