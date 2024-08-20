import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveIdea } from "@/actions/idea";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Plus } from "@phosphor-icons/react";

export function CustomIdeaComponent() {
  const [idea, setIdea] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveIdea = async () => {
    if (!idea.trim()) {
      toast.error("Please enter an idea before saving.");
      return;
    }

    const result = await saveIdea(uuidv4(), idea);
    if (result.success) {
      toast.success("Your idea has been saved successfully!");
      setIdea("");
      setIsOpen(false);
    } else {
      toast.error(result.message || "Failed to save idea.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="group flex select-none items-center justify-center rounded-lg border border-zinc-50 bg-white font-normal leading-8 text-zinc-950 shadow-[0_-1px_0_0px_#d4d4d8_inset,0_0_0_1px_#f4f4f5_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-50 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"
          aria-label="Add LinkedIn Post Idea"
        >
          Save Custom
          <Plus className="ml-1" size={12} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Add LinkedIn Post Idea
          </DialogTitle>
          <DialogDescription className="text-sm">
            Enter an idea below and click save to store it for later use.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <div className="flex flex-row items-center justify-start space-x-2">
            <Input
              id="idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="col-span-3"
              placeholder="Enter your post idea"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="rounded-lg bg-blue-600 hover:bg-blue-700"
            type="submit"
            onClick={handleSaveIdea}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
