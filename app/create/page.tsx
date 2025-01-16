"use client";

import React from "react";
import { Header } from "@/components/header";
import { KeywordSection } from "@/components/keyword-input";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";

export default function CreatePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <KeywordSection />
      <Features />
      <Footer />
    </main>
  );
} 