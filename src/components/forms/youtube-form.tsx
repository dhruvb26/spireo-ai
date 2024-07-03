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

export const RepurposeFormSchema = z.object({
  url: z.string().url(),
  instructions: z.string().optional(),
  formatTemplate: z.string().optional(),
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
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input
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
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter any custom instructions"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Enter any custom instructions for a more tailored repurpose.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="rounded-full bg-primary-blue hover:bg-darker-blue"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Repurposing..." : "Generate Post"}
        </Button>
      </form>
    </Form>
  );
}
