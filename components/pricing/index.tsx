"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      features: [
        "1 podcast per day",
        "Basic language options",
        "Standard quality audio",
        "Community support"
      ]
    },
    {
      name: "Pro",
      price: "$9.99",
      features: [
        "Unlimited podcasts",
        "All languages",
        "HD quality audio",
        "Priority support",
        "Custom topics",
        "Transcript downloads"
      ]
    },
    {
      name: "Team",
      price: "$29.99",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Analytics dashboard",
        "API access",
        "Custom branding",
        "Dedicated account manager"
      ]
    }
  ];

  return (
    <section className="py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your podcast creation needs. No hidden fees.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className="p-8 bg-background rounded-lg shadow-lg border border-border">
              <h3 className="text-xl font-bold mb-2 text-foreground">{plan.name}</h3>
              <p className="text-3xl font-bold mb-6 text-foreground">
                {plan.price}
                <span className="text-sm text-muted-foreground">/month</span>
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-muted-foreground">
                    <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                variant={plan.name === "Pro" ? "default" : "outline"}
                size="lg"
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 