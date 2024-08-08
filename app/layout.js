// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Crayo AI</title>
                <link rel="icon" type="image/x-icon" href="https://i.ibb.co/xHLX9DL/image-removebg-preview.png" />
                <meta name="description" content="Get Support On Crayo AI"/>
                <meta name="keywords" content="Crayo AI, AI Customer Support"/>
                <meta name="author" content="Tech Titans Go!"/>
            </head>
            <body className={inter.className}>
                {/*<Nav />*/}
                {children}
            </body>
        </html>
    );
}
