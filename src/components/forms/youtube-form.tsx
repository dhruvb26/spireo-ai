"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { PostFormatSelector } from "../post-formatter";
import {
  Loader2,
  LightbulbIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CaretDown,
  CaretUp,
  Lightbulb,
  Lightning,
  Minus,
  Plus,
} from "@phosphor-icons/react";

export const RepurposeFormSchema = z.object({
  url: z.string().url(),
  instructions: z.string().optional(),
  formatTemplate: z.string().optional(),
  engagementQuestion: z.string().optional(),
  CTA: z.string().optional(),
});

interface YouTubeFormProps {
  onSubmit: (values: z.infer<typeof RepurposeFormSchema>) => void;
  isLoading: boolean;
}

export function YouTubeForm({ onSubmit, isLoading }: YouTubeFormProps) {
  const form = useForm<z.infer<typeof RepurposeFormSchema>>({
    resolver: zodResolver(RepurposeFormSchema),
    defaultValues: {
      url: "",
      instructions: "",
      formatTemplate: "",
      engagementQuestion: "",
      CTA: "",
    },
  });
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [isGeneratingInstructions, setIsGeneratingInstructions] =
    useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleGenerateInstructions = async () => {
    setIsGeneratingInstructions(true);
    try {
      const response = await fetch("/api/ai/generate-instructions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: form.getValues("url") }),
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 text-sm"
      >
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
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="Enter a YouTube video URL"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Drop in the URL for the YouTube content you want to repurpose.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full max-w-full rounded-lg bg-blue-50"
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between px-4 py-4">
              <h2 className="flex items-center text-sm font-medium text-black">
                <Lightning
                  weight="duotone"
                  className="mr-1 text-blue-500"
                  size={22}
                />
                Add more information
              </h2>

              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                <CaretDown
                  className={`h-4 w-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
                <span className="sr-only">Toggle</span>
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 px-4 pb-4">
            <FormField
              control={form.control}
              name="engagementQuestion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Engagement question</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter your question here"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Ask a question to encourage discussion and comments on your
                    post.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="CTA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call to Action refinement</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Refine your CTA here"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Refine the call to action to be more specific to your
                    audience's needs.
                  </FormDescription>
                </FormItem>
              )}
            />
          </CollapsibleContent>
        </Collapsible>
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
          {isLoading ? (
            <>
              Repurposing
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Generate Post"
          )}
        </Button>
      </form>
    </Form>
  );
}
