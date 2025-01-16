"use client"

import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";

export function Hero() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 animated-gradient">
      <div className="container relative px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Might be the only podcast you can understand in English
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Generate AI Podcasts in any language about any topic in any difficulty level.
            </p>
          </div>
          <div className="space-x-4">
            <Link href="/create">
              <Button size="lg">
                Create Podcast
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
