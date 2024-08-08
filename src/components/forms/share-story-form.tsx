"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { z } from "zod";
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
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostFormatSelector } from "../post-formatter";

export const shareStoryFormSchema = z.object({
  formatTemplate: z.string().optional(),
  storyType: z.enum(["challenge", "success", "general"]),
  storyContent: z.string().min(20, {
    message: "Story content must be at least 20 characters.",
  }),
  outcome: z.string().min(10, {
    message: "Outcome must be at least 10 characters.",
  }),
  feeling: z.string().min(1, {
    message: "Please select a feeling.",
  }),
  lesson: z.string().min(10, {
    message: "Lesson or advice must be at least 10 characters.",
  }),
  instructions: z.string().optional(),
});

const storyTypes = [
  { value: "challenge", label: "A challenge I overcame" },
  { value: "success", label: "A success I achieved" },
  { value: "general", label: "A general experience or insight" },
];

const feelings = [
  { value: "proud", label: "😊 Proud" },
  { value: "excited", label: "😃 Excited" },
  { value: "relieved", label: "😌 Relieved" },
  { value: "challenged", label: "🤔 Challenged" },
  { value: "frustrated", label: "😤 Frustrated" },
  { value: "grateful", label: "🙏 Grateful" },
];

interface ShareStoryFormProps {
  onSubmit: (data: z.infer<typeof shareStoryFormSchema>) => void;
  isLoading: boolean;
}

export function ShareStoryForm({ onSubmit, isLoading }: ShareStoryFormProps) {
  const form = useForm<z.infer<typeof shareStoryFormSchema>>({
    resolver: zodResolver(shareStoryFormSchema),
    defaultValues: {
      storyType: "general",
      storyContent: "",
      outcome: "",
      feeling: "",
      lesson: "",
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
                      className="min-h-[200px]  text-sm"
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
          name="storyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What type of story would you like to share?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a story type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {storyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
          name="storyContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tell us your story</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your experience, challenge, or success..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="outcome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What was the outcome?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the result or how the situation concluded..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="feeling"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                How did this experience primarily make you feel?
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a feeling" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {feelings.map((feeling) => (
                    <SelectItem key={feeling.value} value={feeling.value}>
                      {feeling.label}
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
          name="lesson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What lesson or advice would you like to share?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share the key takeaway or advice from this experience..."
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
