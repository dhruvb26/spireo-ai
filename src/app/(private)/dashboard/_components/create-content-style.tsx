"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { saveContentStyle } from "@/actions/style";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus } from "lucide-react";
import { ContentStyle } from "@/actions/style";

interface CreateContentStylePageProps {
  existingStyle?: ContentStyle | null;
  onBack: () => void;
  onStyleCreated: () => void;
}

const CreateContentStylePage: React.FC<CreateContentStylePageProps> = ({
  existingStyle,
  onBack,
  onStyleCreated,
}) => {
  const [styleName, setStyleName] = useState(existingStyle?.name || "");
  const [posts, setPosts] = useState<string[]>(existingStyle?.examples || [""]);

  useEffect(() => {
    if (existingStyle) {
      setStyleName(existingStyle.name);
      setPosts(existingStyle.examples);
    }
  }, [existingStyle]);

  const handleAddPost = () => {
    setPosts([...posts, ""]);
  };

  const handlePostChange = (index: number, value: string) => {
    const newPosts = [...posts];
    newPosts[index] = value;
    setPosts(newPosts);
  };

  const handleSaveStyle = async () => {
    if (styleName && posts.filter((post) => post.trim() !== "").length > 0) {
      const result = await saveContentStyle(
        styleName,
        posts.filter((post) => post.trim() !== ""),
      );
      if (result.success) {
        toast.success(
          existingStyle
            ? "Style updated successfully"
            : "New style added successfully",
        );
        onStyleCreated();
      } else {
        toast.error(result.message);
      }
    } else {
      toast.error("Please provide a style name and at least one post");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="p-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold">
          {existingStyle ? "Edit Content Style" : "Create Content Style"}
        </h1>
        <Button onClick={handleSaveStyle}>
          {existingStyle ? "Update Style" : "Save Style"}
        </Button>
      </div>

      <div>
        <label htmlFor="styleName" className="mb-2 block text-sm font-medium">
          Name
        </label>
        <Input
          id="styleName"
          placeholder="Add name to your style"
          value={styleName}
          onChange={(e) => setStyleName(e.target.value)}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium">Add posts</label>
          <Button variant="outline" onClick={handleAddPost}>
            <Plus className="mr-2 h-4 w-4" />
            Add posts
          </Button>
        </div>
        <p className="mb-4 text-sm text-gray-500">
          Note: At least add 10 posts to get desired results.
        </p>
        {posts.map((post, index) => (
          <Textarea
            key={index}
            placeholder={`Post ${index + 1}`}
            value={post}
            onChange={(e) => handlePostChange(index, e.target.value)}
            className="mb-4"
          />
        ))}
      </div>
    </div>
  );
};

export default CreateContentStylePage;
