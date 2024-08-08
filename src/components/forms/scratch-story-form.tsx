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
  FormDescription,
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
import { Loader2 } from "lucide-react";

export const scratchStoryFormSchema = z.object({
  postContent: z.string().min(20, {
    message: "Content must be at least 20 characters.",
  }),
  tone: z.string().min(1, {
    message: "Please select a tone.",
  }),
  // linkedInPostUrl: z.string().url().optional(),
  instructions: z.string().optional(),
  formatTemplate: z.string().optional(),
});

const tones = [
  { value: "professional", label: "Professional 💼" },
  { value: "informative", label: "Informative 📊" },
  { value: "engaging", label: "Engaging 🤝" },
  { value: "inspiring", label: "Inspiring 🌟" },
  { value: "thought-provoking", label: "Thought-provoking 💭" },
  { value: "authentic", label: "Authentic 🙌" },
  { value: "concise", label: "Concise 📝" },
  { value: "humorous", label: "Humorous 😄" },
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

  const [isGeneratingInstructions, setIsGeneratingInstructions] =
    useState(false);

  const handleGenerateInstructions = async () => {
    setIsGeneratingInstructions(true);
    try {
      const response = await fetch("/api/ai/generate-instructions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate instructions");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let instructions = "";

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        instructions += decoder.decode(value);
        form.setValue("instructions", instructions);
      }
    } catch (error) {
      console.error("Error generating instructions:", error);
    } finally {
      setIsGeneratingInstructions(false);
    }
  };

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
        <div className="flex items-center justify-start space-x-2">
          <PostFormatSelector onSelectFormat={handleSelectFormat} />
        </div>
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
                      className="min-h-[200px] text-sm"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearFormat}
                    className="flex-shrink-0 rounded-lg"
                  >
                    Clear
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
              <FormLabel>What do you want to write about?</FormLabel>
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
              <FormLabel>Select the tone you'd like for your post.</FormLabel>
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
              <FormLabel>Instructions</FormLabel>
              <div className="flex items-start space-x-2">
                <FormControl className="flex-grow">
                  <Textarea
                    className="h-[150px] "
                    autoComplete="off"
                    placeholder="Add any specific instructions or notes for your post."
                    {...field}
                    disabled={isLoading || isGeneratingInstructions}
                  />
                </FormControl>
              </div>
              <FormDescription>
                Enter instructions for a more tailored repurpose or{" "}
                <span
                  onClick={handleGenerateInstructions}
                  className={`cursor-pointer text-brand-purple-600 hover:text-brand-purple-700 ${
                    isLoading || isGeneratingInstructions
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >
                  {isGeneratingInstructions ? (
                    <>
                      generating
                      <Loader2 className="ml-1 inline-block h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "generate some using AI."
                  )}
                </span>
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="linkedInPostUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Make the post sound like any post of your choice.
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the URL to the LinkedIn post"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <Button
          className="rounded-lg bg-brand-purple-600 font-light hover:bg-brand-purple-700"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Generating" : "Generate Post"}
        </Button>
      </form>
    </Form>
  );
}
