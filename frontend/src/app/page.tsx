"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import MainContent from "@/components/MainContent";

export default function Page() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <MainContent key={activeTab}  activeTab={activeTab} />
      </main>
    </>
  );
}

