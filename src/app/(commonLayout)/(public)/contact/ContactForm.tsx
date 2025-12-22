"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FormEvent } from "react";

export default function ContactForm() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.success("we will contact with you quickly...");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send us a Message</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <Input id="name" placeholder="Your name" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <Input id="email" type="email" placeholder="Your email" required />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject <span className="text-red-500">*</span>
            </label>
            <Input id="subject" placeholder="How can we help?" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="message"
              placeholder="Tell us more about your inquiry..."
              className="min-h-[150px]"
              required
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
