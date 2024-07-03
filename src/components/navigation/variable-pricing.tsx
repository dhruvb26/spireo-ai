"use client";
import React, { useState } from "react";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";

const VariablePricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Personal",
      description: "All the basic features to boost your freelance career",
      monthlyPrice: 39,
      yearlyPrice: 390,
      features: [
        "1 Domain License",
        "Full Celebration Library",
        "120+ Coded Blocks",
        "Design Files Included",
        "Premium Support",
      ],
    },
    {
      name: "Agency",
      description: "All the extended features to boost your agency career",
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        "100 Domain License",
        "Full Celebration Library",
        "120+ Coded Blocks",
        "Design Files Included",
        "Premium Support",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold leading-tight text-black sm:text-4xl lg:text-5xl">
          Pricing & Plans
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-gray-600">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint. Velit officia consequat duis.
        </p>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-center space-x-2.5">
          <span className="text-base font-medium text-gray-900">Monthly</span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className="text-base font-medium text-gray-900">Yearly</span>
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 md:gap-9">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={index === 1 ? "bg-white" : "bg-transparent"}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-5 flex items-end">
                <div className="flex items-start">
                  <span className="text-xl font-medium text-black">$</span>
                  <p className="text-6xl font-medium tracking-tight">
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </p>
                </div>
                <span className="ml-0.5 text-lg text-gray-600">
                  / {isYearly ? "year" : "month"}
                </span>
              </div>
              <Button
                className="mt-6 w-full"
                variant={index === 1 ? "default" : "outline"}
              >
                Start 14 Days Free Trial
              </Button>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckIcon className="mr-2 h-5 w-5 text-gray-400" />
                    <span className="text-base font-medium text-gray-900">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VariablePricing;
