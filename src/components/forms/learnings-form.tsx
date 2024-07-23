"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PostFormatSelector } from "../post-formatter";
import { Textarea } from "@/components/ui/textarea";

export const learningFormSchema = z.object({
  learning: z.string().min(20, {
    message: "Story content must be at least 20 characters.",
  }),
  how: z.string().min(1, {
    message: "Please select a tone.",
  }),
  takeaways: z.string().min(1, {
    message: "Please select a tone.",
  }),
  instructions: z.string().optional(),
  formatTemplate: z.string().optional(),
});

interface LearningFormProps {
  onSubmit: (data: z.infer<typeof learningFormSchema>) => void;
  isLoading: boolean;
  initialPostContent?: string;
}

export function LearningForm({
  onSubmit,
  isLoading,
  initialPostContent = "",
}: LearningFormProps) {
  const form = useForm<z.infer<typeof learningFormSchema>>({
    resolver: zodResolver(learningFormSchema),
    defaultValues: {
      learning: initialPostContent,
      how: "",
      takeaways: "",
      instructions: "",
    },
  });

  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  useEffect(() => {
    form.setValue("formatTemplate", selectedFormat || "");
  }, [selectedFormat, form]);

  const handleSelectFormat = (format: string) => {
    setSelectedFormat(format);
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSelectedFormat(e.target.value);
  };

  const handleClearFormat = () => {
    setSelectedFormat(null);
    form.setValue("formatTemplate", "");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <PostFormatSelector onSelectFormat={handleSelectFormat} />
        {selectedFormat !== null && (
          <FormField
            control={form.control}
            name="formatTemplate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edit Selected Format</FormLabel>
                <div className="flex items-start space-x-2">
                  <FormControl className="flex-grow">
                    <Textarea
                      {...field}
                      value={selectedFormat}
                      onChange={handleFormatChange}
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearFormat}
                    className="flex-shrink-0 rounded-lg"
                  >
                    Clear Format
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="learning"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What did you learn?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the post you want to create."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="how"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How did you learn it?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the post you want to create."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="takeaways"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What were the key takeaways?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the post you want to create."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Enter any custom instructions for your post generation.
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any specific instructions or notes for your post..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="rounded-lg bg-brand-purple-500 font-light hover:bg-brand-purple-700"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Post"}
        </Button>
      </form>
    </Form>
  );
}
