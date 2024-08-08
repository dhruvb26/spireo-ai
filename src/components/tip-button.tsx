import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Question, SealQuestion } from "@phosphor-icons/react";

interface TipButtonProps {
  heading: string;
  content: string;
}

const TipButton: React.FC<TipButtonProps> = ({ heading, content }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="  focus:outline-none"
            aria-label="Format selection tip"
          >
            <Question weight="duotone" className="text-blue-600" size={28} />
          </button>
        </TooltipTrigger>
        <TooltipContent className="w-64 p-4" side="right">
          <h3 className="mb-2 text-sm font-semibold">{heading}</h3>
          <p className="text-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TipButton;
