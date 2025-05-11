
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sparkles, Hand } from "lucide-react";

interface IntroductionPageProps {
  onSubmit: (name: string) => void;
}

export function IntroductionPage({ onSubmit }: IntroductionPageProps): JSX.Element {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl animate-pop-in">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
            <Sparkles className="h-12 w-12 text-primary animate-pulse-glow" />
        </div>
        <CardTitle className="text-3xl font-bold">
          Welcome to StudySmart!
        </CardTitle>
        <CardDescription className="text-lg">
          Your AI-powered learning companion.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-lg flex items-center gap-2">
              <Hand className="h-5 w-5 text-primary" />
              What should we call you?
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg py-6"
              required
              data-ai-hint="user name"
            />
          </div>
          <Button type="submit" className="w-full text-lg py-6 transition-transform hover:scale-105 active:scale-95">
            Get Started
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">
            Tell us your name and let the learning adventure begin!
        </p>
      </CardFooter>
    </Card>
  );
}
