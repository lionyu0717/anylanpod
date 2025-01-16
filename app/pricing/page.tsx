"use client";

import React from "react";
import { Header } from "@/components/header";
import { Pricing } from "@/components/pricing";
import { Footer } from "@/components/footer";

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-20">
        <Pricing />
      </div>
      <Footer />
    </main>
  );
} 