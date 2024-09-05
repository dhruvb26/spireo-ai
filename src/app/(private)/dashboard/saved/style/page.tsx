"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ContentStyle } from "@/actions/style";
import { getContentStyles, deleteContentStyle } from "@/actions/style";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import CreateContentStylePage from "../../_components/create-content-style";

const SavedStylesPage = () => {
  const [styles, setStyles] = useState<ContentStyle[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<ContentStyle | null>(null);
  const [isCreatingStyle, setIsCreatingStyle] = useState(false);

  useEffect(() => {
    fetchStyles();
  }, []);

  const fetchStyles = async () => {
    const result = await getContentStyles();
    if (result.success) {
      setStyles(result.data || []);
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteStyle = async (e: React.MouseEvent, styleId: string) => {
    e.stopPropagation();
    const result = await deleteContentStyle(styleId);
    if (result.success) {
      toast.success(result.message);
      fetchStyles();
    } else {
      toast.error(result.message);
    }
  };

  const handleStyleClick = (style: ContentStyle) => {
    setSelectedStyle(style);
    setIsCreatingStyle(true);
  };

  if (isCreatingStyle) {
    return (
      <CreateContentStylePage
        existingStyle={selectedStyle}
        onBack={() => {
          setIsCreatingStyle(false);
          setSelectedStyle(null);
        }}
        onStyleCreated={() => {
          setIsCreatingStyle(false);
          setSelectedStyle(null);
          fetchStyles();
        }}
      />
    );
  }

  return (
    <main>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-brand-gray-900">
            Custom Styles
          </h1>
          <p className="text-sm text-brand-gray-500">
            Manage your custom content styles to better structure your posts.
          </p>
        </div>
        <Button onClick={() => setIsCreatingStyle(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Style
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {styles.map((style) => (
          <Card
            key={style.id}
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => handleStyleClick(style)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{style.name}</span>
                <Button
                  variant="ghost"
                  onClick={(e) => handleDeleteStyle(e, style.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{style.examples.length} examples</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default SavedStylesPage;
