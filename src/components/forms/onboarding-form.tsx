"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

export function OnboardingForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topicInput, setTopicInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      heardFrom: "",
      topics: [] as string[],
    },
  });

  useEffect(() => {
    if (topicInput) {
      setFilteredSuggestions(
        topicSuggestions.filter((topic) =>
          topic.toLowerCase().includes(topicInput.toLowerCase()),
        ),
      );
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
    if (e.key === "Enter" && topicInput) {
      e.preventDefault();
      addTopic(topicInput);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await completeOnboarding(values);

      if (result.success) {
        toast.success("Welcome to Spireo! Your onboarding is complete.");
        router.push("/dashboard/post");
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

  async function handleSkip() {
    setIsSubmitting(true);
    try {
      const result = await skipOnboarding();
      if (result.success) {
        toast.success("Onboarding skipped. You can always complete it later.");
        router.push("/dashboard/getting-started");
        router.refresh();
      } else {
        throw new Error("Failed to skip onboarding");
      }
    } catch (error) {
      toast.error("An error occurred while skipping onboarding.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-4 flex flex-row items-center justify-center space-x-2">
          <Image
            src="/Spireo Logo Symbol Custom.png"
            width={35}
            height={35}
            alt=""
          />
          <span className="text-4xl font-bold tracking-tighter">Spireo</span>
        </div>
        <p className="mb-6 text-center text-sm">
          Thank you for choosing Spireo. Fill out this form and help us
          understand you better.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <div className="space-y-2">
                      <Input
                        placeholder="Type a topic and press Enter"
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      {filteredSuggestions.length > 0 && (
                        <div className="relative">
                          <ul className="absolute z-50 max-h-60 w-full overflow-auto rounded-md border border-input bg-popover p-1 text-popover-foreground shadow-md">
                            {filteredSuggestions.map((suggestion) => (
                              <li
                                key={suggestion}
                                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                onClick={() => addTopic(suggestion)}
                              >
                                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                  {field.value.includes(suggestion) && (
                                    <Check className="h-4 w-4" />
                                  )}
                                </span>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="mt-2 flex flex-wrap space-x-1">
                        {field.value.map((topic) => (
                          <span
                            key={topic}
                            className="mr-2 flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
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
            <div className="flex flex-col items-center justify-center space-y-3">
              <Button
                type="submit"
                className="w-full rounded-lg bg-blue-500 text-white hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Finish"}
              </Button>
              <button
                className="text-sm text-blue-500 hover:text-blue-700 hover:underline"
                onClick={handleSkip}
                disabled={isSubmitting}
              >
                Skip for now
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
