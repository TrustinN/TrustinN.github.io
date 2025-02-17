"use client";

import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MathJaxContext } from "better-react-mathjax";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MathJaxContext>
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <script src="/mathjax/es5/tex-chtml.js" id="MathJax-script" async />
        </head>
        <body>
          <div className="flex flex-col h-screen">
            <Header />
            <div className="flex-grow">{children}</div>
            <Footer />
          </div>
        </body>
      </html>
    </MathJaxContext>
  );
}
