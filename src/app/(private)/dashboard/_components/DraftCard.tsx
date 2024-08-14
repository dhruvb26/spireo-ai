"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Draft } from "@/actions/draft";
import { Badge } from "@/components/ui/badge";
import { CalendarBlank, Circle } from "@phosphor-icons/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import dynamic from "next/dynamic";
import { getUser } from "@/actions/user";
import { getDownloadUrl } from "@/actions/draft";
import {
  ChatCircleText,
  GlobeHemisphereWest,
  PaperPlaneTilt,
  Repeat,
  ThumbsUp,
} from "@phosphor-icons/react";
import { Loader2 } from "lucide-react";

const PdfViewerComponent = dynamic(() => import("./PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center">
      <Loader2 className="mb-2 h-4 w-4 animate-spin text-blue-600" />
    </div>
  ),
});

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface DraftCardProps {
  draft: Draft;
}

const DraftCard: React.FC<DraftCardProps> = ({ draft }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);

  const renderContent = (content: any) => {
    const maxLength = 10;
    let totalLength = 0;
    let truncatedContent = [];

    for (let node of content) {
      if (node.type === "paragraph") {
        for (let child of node.children) {
          if (totalLength + child.text.length <= maxLength) {
            truncatedContent.push(child.text);
            totalLength += child.text.length;
          } else {
            const remainingSpace = maxLength - totalLength;
            truncatedContent.push(child.text.slice(0, remainingSpace));
            truncatedContent.push("...");
            return truncatedContent.join(" ");
          }
        }
      }
    }

    return truncatedContent.join(" ");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser();
        setUser(userData as User);

        const result = await getDownloadUrl(draft.id);

        if (result.success) {
          setDownloadUrl(result.data as string);

          const response = await fetch(result.data as string, {
            method: "GET",
          });
          const type = response.headers.get("Content-Type");
          if (type) {
            setContentType(type);
          } else {
            setContentType("unknown");
          }
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("An error occurred while fetching data");
        console.error(err);
      }
    };

    fetchData();
  }, [draft.id]);

  const renderPreviewContent = () => {
    if (!downloadUrl) return null;

    if (contentType?.startsWith("image/")) {
      return (
        <div className="relative h-full w-full">
          <Image
            src={downloadUrl}
            alt="Content"
            layout="responsive"
            width={100}
            height={100}
            objectFit="contain"
          />
        </div>
      );
    } else if (contentType === "application/pdf") {
      return <PdfViewerComponent file={downloadUrl} device="mobile" />;
    } else {
      return null;
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <div className="relative max-w-sm cursor-pointer rounded-lg border border-brand-gray-200 bg-white shadow transition-all duration-300 ease-in-out hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          {draft.downloadUrl &&
            (draft.documentUrn?.includes("document") ? (
              <div className="relative flex h-[50px] w-full items-center justify-center overflow-hidden rounded-t-lg bg-gray-200">
                <iframe
                  src={draft.downloadUrl}
                  title="PDF Preview"
                  className="h-full w-full"
                />
              </div>
            ) : (
              <div className="relative h-[50px] w-full overflow-hidden rounded-t-lg">
                <Image
                  src={draft.downloadUrl || ""}
                  alt="Draft Image"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="top"
                />
              </div>
            ))}

          <div className="p-4">
            <h5 className="mb-2 text-sm font-semibold tracking-tight text-brand-gray-900 transition-colors duration-300 ease-in-out group-hover:text-brand-gray-700 dark:text-white dark:group-hover:text-gray-300">
              {draft.name || "Untitled Post"}
            </h5>
            <p className="mb-3 text-xs text-brand-gray-500 transition-colors duration-300 ease-in-out group-hover:text-brand-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300">
              {renderContent(JSON.parse(draft.content))}
            </p>
            <div className="flex items-center space-x-2">
              <Circle
                weight="fill"
                size={12}
                className="text-green-600 transition-colors duration-300 ease-in-out group-hover:text-green-500"
              />
              <p className="text-xs font-normal text-brand-gray-500 transition-colors duration-300 ease-in-out group-hover:text-brand-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300">
                {draft.scheduledFor?.toLocaleString(undefined, {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center justify-start space-x-2 text-lg font-semibold tracking-tight">
            <span>{draft.name || "Untitled Post"}</span>
            <Badge className="space-x-1 bg-green-50 font-normal text-green-600 hover:bg-green-100">
              <span>Scheduled</span>
              <CalendarBlank weight="duotone" size={16} />
            </Badge>
          </SheetTitle>
        </SheetHeader>
        <SheetDescription className="mt-6">
          <div className="flex w-full flex-col items-center justify-center shadow">
            <div className="w-full rounded bg-white shadow">
              <div className="mb-2 flex items-center p-3">
                <div className="relative mr-2 h-10 w-10">
                  <img
                    src={user?.image || "https://i.pravatar.cc/300"}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="text-sm font-semibold text-black">
                    {user?.name || "..."}
                  </p>
                  <p className="flex items-center text-xs text-gray-500">
                    Now •
                    <span className="ml-1">
                      <GlobeHemisphereWest weight="fill" size={12} />
                    </span>
                  </p>
                </div>
              </div>

              <div className="px-3 text-sm">
                <p>{renderContent(JSON.parse(draft.content))}</p>
              </div>

              {downloadUrl && (
                <div className="mt-2 w-full">{renderPreviewContent()}</div>
              )}

              <div className=" border-t border-brand-gray-200 p-3">
                <div className="flex items-center justify-between">
                  {[
                    {
                      name: "Like",
                      icon: (
                        <ThumbsUp
                          className="scale-x-[-1] transform"
                          weight="fill"
                          size={16}
                        />
                      ),
                    },
                    {
                      name: "Comment",
                      icon: <ChatCircleText weight="fill" size={16} />,
                    },
                    {
                      name: "Repost",
                      icon: <Repeat weight="bold" size={16} />,
                    },
                    {
                      name: "Send",
                      icon: <PaperPlaneTilt weight="fill" size={16} />,
                    },
                  ].map((action) => (
                    <Button
                      size="sm"
                      key={action.name}
                      className="flex flex-1 flex-row items-center justify-center space-x-1 rounded-lg bg-white px-1 py-1 transition-colors duration-200 ease-in-out hover:bg-gray-100"
                    >
                      <span className="text-brand-gray-500">{action.icon}</span>
                      <span className="text-xs font-medium text-brand-gray-500">
                        {action.name}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="my-4 w-full space-y-2 text-xs text-gray-600">
            <p>
              <span className="font-medium">Scheduled for:</span>{" "}
              {draft.scheduledFor?.toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Created:</span>{" "}
              {draft.createdAt.toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Updated:</span>{" "}
              {draft.updatedAt.toLocaleString()}
            </p>
          </div>
          <Link href={`/dashboard/draft/${draft.id}`} passHref>
            <Button className="mt-2 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Edit Draft
            </Button>
          </Link>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
};

export default DraftCard;
