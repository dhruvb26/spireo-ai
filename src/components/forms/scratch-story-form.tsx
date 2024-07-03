"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostFormatSelector } from "../post-formatter";

export const scratchStoryFormSchema = z.object({
  postContent: z.string().min(20, {
    message: "Story content must be at least 20 characters.",
  }),
  tone: z.string().min(1, {
    message: "Please select a tone.",
  }),
  instructions: z.string().optional(),
  formatTemplate: z.string().optional(),
});

const tones = [
  { value: "positive", label: "Positive 😊" },
  { value: "neutral", label: "Neutral 😐" },
  { value: "negative", label: "Negative 😞" },
  // ... other tones
];

interface ScratchStoryFormProps {
  onSubmit: (data: z.infer<typeof scratchStoryFormSchema>) => void;
  isLoading: boolean;
  initialPostContent?: string;
}

export function ScratchStoryForm({
  onSubmit,
  isLoading,
  initialPostContent = "",
}: ScratchStoryFormProps) {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  const form = useForm<z.infer<typeof scratchStoryFormSchema>>({
    resolver: zodResolver(scratchStoryFormSchema),
    defaultValues: {
      postContent: initialPostContent || "",
      tone: "",
      instructions: "",
      formatTemplate: "",
    },
  });

  useEffect(() => {
    if (initialPostContent) {
      form.setValue("postContent", initialPostContent);
    }
  }, [initialPostContent, form]);

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
                    className="flex-shrink-0 rounded-full"
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
          name="postContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tell us your story</FormLabel>
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
          name="tone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                How did this experience primarily make you feel?
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tones.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          className="rounded-full bg-primary-blue hover:bg-darker-blue"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Post"}
        </Button>
      </form>
    </Form>
  );
}
