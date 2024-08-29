import React, { useMemo } from "react";
import Image from "next/image";

interface ReactionGridProps {
  numLikes: number;
  numEmpathy: number;
  numInterests: number;
  numAppreciations: number;
  numComments: number;
  numReposts: number;
}

const ReactionGrid: React.FC<ReactionGridProps> = ({
  numLikes,
  numEmpathy,
  numInterests,
  numAppreciations,
  numComments,
  numReposts,
}) => {
  const totalReactions =
    numLikes + numEmpathy + numInterests + numAppreciations;

  const reactionImages = useMemo(() => {
    const images = [
      { alt: "Like", src: "/linkedin/like.svg" },
      { alt: "Love", src: "/linkedin/love.svg" },
      { alt: "Celebrate", src: "/linkedin/celebrate.svg" },
      { alt: "Curious", src: "/linkedin/curious.svg" },
      { alt: "Insightful", src: "/linkedin/insightful.svg" },
      { alt: "Support", src: "/linkedin/support.svg" },
    ];
    return images.sort(() => 0.5 - Math.random()).slice(0, 3);
  }, []);

  return (
    <div className="flex flex-row items-center justify-between px-6 py-2 text-sm text-gray-400">
      <div className="flex items-center">
        <div className="mr-2 flex -space-x-1">
          {reactionImages.map((image, index) => (
            <Image
              key={image.alt}
              alt={image.alt}
              src={image.src}
              width={16}
              height={16}
              className={`z-${30 - index * 10}`}
            />
          ))}
        </div>
        <span className="text-xs font-extralight">
          {totalReactions.toLocaleString()}
        </span>
      </div>
      <div className="text-xs font-extralight">
        {numComments > 0 && `${numComments.toLocaleString()} comments`}
        {numComments > 0 && numReposts > 0 && " • "}
        {numReposts > 0 && `${numReposts.toLocaleString()} reposts`}
      </div>
    </div>
  );
};

export default ReactionGrid;
