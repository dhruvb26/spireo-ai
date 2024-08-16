"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getUserOnboardingData } from "@/actions/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  FaUser,
  FaGlobe,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { Check } from "@phosphor-icons/react";
import { completeOnboarding, skipOnboarding } from "@/actions/user";

const formSchema = z.object({
  role: z.string({
    required_error: "Please select your role.",
  }),
  heardFrom: z.string({
    required_error: "Please select how you heard about us.",
  }),
  topics: z.array(z.string()).min(1, {
    message: "Please add at least one topic.",
  }),
});

const roles = [
  "Entrepreneur",
  "Professional",
  "Job Seeker",
  "Student",
  "Other",
];

const heardFromOptions = [
  { value: "friend", label: "Friend/co-worker", icon: FaUser },
  { value: "web", label: "Web Search", icon: FaGlobe },
  { value: "linkedin", label: "LinkedIn", icon: FaLinkedin },
  { value: "twitter", label: "Twitter", icon: FaTwitter },
  { value: "instagram", label: "Instagram", icon: FaInstagram },
  { value: "youtube", label: "Youtube", icon: FaYoutube },
  { value: "other", label: "Other", icon: null },
];

const topicSuggestions = [
  "Technology",
  "Business",
  "Marketing",
  "Finance",
  "Leadership",
  "Entrepreneurship",
  "Personal Development",
  "Career Advice",
  "Industry News",
  "Innovation",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topicInput, setTopicInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      heardFrom: "",
      topics: [] as string[],
    },
  });

  useEffect(() => {
    async function fetchOnboardingData() {
      try {
        const result = await getUserOnboardingData();
        if (result.success && result.data.onboardingCompleted) {
          const backendData = result.data.onboardingData;
          let onboardingData;

          // Check if backendData is a string that needs parsing
          if (typeof backendData === "string") {
            try {
              onboardingData = JSON.parse(backendData);
            } catch (parseError) {
              console.error("Error parsing onboarding data:", parseError);
              toast.error("Failed to parse onboarding data.");
              return;
            }
          } else {
            // If it's not a string, assume it's already an object
            onboardingData = backendData;
          }

          // Now we can safely use onboardingData
          if (onboardingData) {
            form.reset({
              role: onboardingData.role || "",
              heardFrom: onboardingData.heardFrom || "",
              topics: onboardingData.topics || [],
            });
          }
        }
      } catch (error) {
        console.error("Error fetching onboarding data:", error);
        // Don't show an error toast, just log it
      }
    }

    fetchOnboardingData();
  }, [form]);

  useEffect(() => {
    if (topicInput) {
      const lowercaseInput = topicInput.toLowerCase().trim();
      const filtered = topicSuggestions.filter((topic) =>
        topic.toLowerCase().includes(lowercaseInput),
      );

      // Check if the input exactly matches any existing suggestion (case-insensitive)
      const exactMatch = topicSuggestions.find(
        (topic) => topic.toLowerCase() === lowercaseInput,
      );

      // Only add the current input if it's not an exact match and not already in filtered
      if (
        !exactMatch &&
        !filtered.some((topic) => topic.toLowerCase() === lowercaseInput) &&
        lowercaseInput !== ""
      ) {
        filtered.unshift(topicInput.trim());
      }

      setFilteredSuggestions(filtered);
      setSelectedSuggestionIndex(-1);
    } else {
      setFilteredSuggestions([]);
    }
  }, [topicInput]);

  const addTopic = (topic: string) => {
    const currentTopics = form.getValues("topics");
    if (!currentTopics.includes(topic)) {
      form.setValue("topics", [...currentTopics, topic]);
    }
    setTopicInput("");
  };

  const removeTopic = (topicToRemove: string) => {
    const currentTopics = form.getValues("topics");
    form.setValue(
      "topics",
      currentTopics.filter((topic) => topic !== topicToRemove),
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (
        selectedSuggestionIndex >= 0 &&
        selectedSuggestionIndex < filteredSuggestions.length
      ) {
        addTopic(filteredSuggestions[selectedSuggestionIndex] || "");
      } else if (topicInput) {
        addTopic(topicInput);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prevIndex) =>
        Math.min(prevIndex + 1, filteredSuggestions.length - 1),
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prevIndex) => Math.max(prevIndex - 1, -1));
    }
  };

  useEffect(() => {
    if (suggestionsRef.current && selectedSuggestionIndex >= 0) {
      const selectedElement = suggestionsRef.current.children[
        selectedSuggestionIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedSuggestionIndex]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await completeOnboarding(values);

      if (result.success) {
        toast.success("Your preferences have been updated!");
        router.refresh();
      } else {
        throw new Error("Onboarding failed");
      }
    } catch (error) {
      toast.error("An error occurred during onboarding.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <div className="mb-8 text-left">
        <h1 className="text-xl font-semibold tracking-tight text-brand-gray-900">
          Set Account Preferences
        </h1>
        <p className="text-sm text-brand-gray-500">
          Review and update your preferences to help us provide better content
          for you.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-[75%] flex-col justify-start space-y-6"
        >
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What best describes your role?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
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
            name="heardFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where did you hear about us?</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {heardFromOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={
                        field.value === option.value ? "default" : "outline"
                      }
                      className="flex items-center gap-2 rounded-lg"
                      onClick={() => form.setValue("heardFrom", option.value)}
                    >
                      {option.icon && <option.icon />}
                      {option.label}
                    </Button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="topics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What topics do you want to post about?</FormLabel>
                <FormControl>
                  <div className="space-y-1">
                    <Input
                      placeholder="Type a topic and press Enter"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    {filteredSuggestions.length > 0 && (
                      <div className="relative">
                        <ul
                          ref={suggestionsRef}
                          className="absolute z-50 max-h-60 w-full overflow-auto rounded-md border border-input bg-popover p-1 text-popover-foreground shadow-md"
                        >
                          {filteredSuggestions.map((suggestion, index) => (
                            <li
                              key={index}
                              className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none ${
                                index === selectedSuggestionIndex
                                  ? "bg-accent text-accent-foreground"
                                  : "hover:bg-accent hover:text-accent-foreground"
                              }`}
                              onClick={() => addTopic(suggestion)}
                            >
                              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                {form
                                  .getValues("topics")
                                  .includes(suggestion) && (
                                  <Check className="h-4 w-4" />
                                )}
                              </span>
                              {suggestion}
                              {index === 0 &&
                                suggestion.toLowerCase() ===
                                  topicInput.toLowerCase().trim() &&
                                !topicSuggestions.some(
                                  (topic) =>
                                    topic.toLowerCase() ===
                                    suggestion.toLowerCase(),
                                ) &&
                                ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mt-2 flex flex-wrap space-x-1">
                      {field.value.map((topic) => (
                        <span
                          key={topic}
                          className="flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                        >
                          {topic}
                          <button
                            type="button"
                            onClick={() => removeTopic(topic)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col items-start justify-center space-y-3">
            <Button
              type="submit"
              className="rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : form.getValues("role")
                  ? "Update"
                  : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
