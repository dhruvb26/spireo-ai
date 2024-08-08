import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface Post {
  urn: string;
  text: string;
  time: string;
  posted: string; // Add this line
  num_likes: number;
  num_comments: number;
  num_reposts: number;
  images?: { url: string }[];
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <p className="text-sm text-gray-500">{post.time}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="mb-4 line-clamp-3">{post.text}</p>
        {post.images && post.images.length > 0 && (
          <img
            src={post.images[0]?.url}
            alt="Post image"
            className="h-40 w-full rounded-md object-cover"
          />
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full justify-between text-sm text-gray-500">
          <span>Likes: {post.num_likes}</span>
          <span>Comments: {post.num_comments}</span>
          <span>Reposts: {post.num_reposts}</span>
        </div>
        <div className="flex w-full justify-between">
          <Button variant="outline" onClick={() => console.log("Save clicked")}>
            Save
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log("Repurpose clicked")}
          >
            Repurpose
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
