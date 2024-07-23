"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters.",
  }),
});

interface IdeaFormProps {
  onIdeasGenerated: (ideas: string[]) => void;
  onLoading: (isLoading: boolean) => void;
}

export function IdeaForm({ onIdeasGenerated, onLoading }: IdeaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    onLoading(true);
    try {
      const response = await fetch("/api/ai/generate-ideas", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to generate ideas");
      }
      const data = await response.json();
      onIdeasGenerated(data.ideas);
    } catch (error) {
      console.error("Error generating ideas:", error);
    } finally {
      setIsSubmitting(false);
      onLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="SEO, B2B, Technology, ..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter a topic you want to generate post ideas for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="rounded-lg bg-brand-purple-500 font-light hover:bg-brand-purple-700"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Generating Ideas..." : "Generate Ideas"}
        </Button>
      </form>
    </Form>
  );
}
