import React from "react";
import Image from "next/image";

export default async function BookForm() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans baseColour">
      <main
        className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-12 px-8 sm:items-start mainColour">
        <Image src={"/cheese-and-wine-logo.png"} alt={"default logo"} className={"max-w-xs mx-auto p-3"} width={300}
               height={200}/>
        <h1 className="text-3xl font-semibold mb-6">Thank you for your booking request!</h1>
        <p>We have received your request and will review it shortly.
        <br />
        You will receive an email soon when your booking is confirmed.</p>
        <div className={"min-h-8"}></div>
      </main>
    </div>
  );
}
