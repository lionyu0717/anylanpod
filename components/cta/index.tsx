"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Start Your Language Learning Journey Today
          </h2>
          <p className="mx-auto max-w-[700px] text-primary-foreground/90 md:text-xl">
            Join thousands of learners who are already improving their language skills with AI-powered podcasts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/create">
              <Button size="lg" variant="secondary" className="min-w-[150px]">
                Get Started Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary min-w-[150px]">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 