"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { PostFormat } from "@/actions/formats";
import {
  getPostFormats,
  deletePostFormat,
  savePostFormat,
} from "@/actions/formats";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SavedFormatsPage = () => {
  const [privateFormats, setPrivateFormats] = useState<PostFormat[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [newTemplate, setNewTemplate] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchPrivateFormats();
  }, []);

  const fetchPrivateFormats = async () => {
    const result = await getPostFormats(false);
    if (result.success) {
      setPrivateFormats(result.data || []);
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteFormat = async (formatId: string) => {
    const result = await deletePostFormat(formatId);
    if (result.success) {
      toast.success(result.message);
      fetchPrivateFormats();
    } else {
      toast.error(result.message);
    }
  };

  const handleAddFormat = async () => {
    if (newCategory && newTemplate) {
      const result = await savePostFormat(newTemplate, newCategory, false);
      if (result.success) {
        toast.success("New format added successfully");
        fetchPrivateFormats();
        setIsAddDialogOpen(false);
        setNewCategory("");
        setNewTemplate("");
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleAddTemplateToCategory = async () => {
    if (selectedCategory && newTemplate) {
      const result = await savePostFormat(newTemplate, selectedCategory, false);
      if (result.success) {
        toast.success("New template added to category");
        fetchPrivateFormats();
        setNewTemplate("");
      } else {
        toast.error(result.message);
      }
    }
  };

  const categories = Array.from(
    new Set(privateFormats.map((format) => format.category)),
  );

  const [editingFormat, setEditingFormat] = useState<PostFormat | null>(null);

  return (
    <main>
      <div className="mb-6 text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-brand-gray-900">
          Custom Formats
        </h1>
        <p className="mx-auto text-sm text-brand-gray-500">
          Manage your custom post formats to better structure your posts.
        </p>
      </div>

      {selectedCategory ? (
        <div>
          <div className="mb-4 flex justify-between">
            <Button onClick={() => setSelectedCategory(null)}>
              Back to Categories
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Add Template to {selectedCategory}
            </Button>
          </div>
          <h2 className="mb-4 text-xl font-semibold">{selectedCategory}</h2>
          {privateFormats
            .filter((format) => format.category === selectedCategory)
            .map((format, index) => (
              <Card key={format.id} className="mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Format #{index + 1}</span>
                    <div>
                      <Button
                        variant="ghost"
                        onClick={() => setEditingFormat(format)}
                        className="mr-2"
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteFormat(format.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {format.templates.map((template, tIndex) => (
                    <p key={tIndex} className="mb-2">
                      {template}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card
              key={category}
              className="cursor-pointer transition-shadow hover:shadow-lg"
              onClick={() => setSelectedCategory(category)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {
                    privateFormats.filter(
                      (format) => format.category === category,
                    ).length
                  }{" "}
                  formats
                </p>
              </CardContent>
            </Card>
          ))}
          <Card
            className="flex cursor-pointer items-center justify-center transition-shadow hover:shadow-lg"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <CardContent className="flex h-full w-full flex-row items-center justify-center">
              <p className="mt-2">Add </p>
              <Plus className="ml-2 inline" size={12} />
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCategory
                ? `Add Template to ${selectedCategory}`
                : "Add New Category and Template"}
            </DialogTitle>
          </DialogHeader>
          {!selectedCategory && (
            <Input
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="mb-4"
            />
          )}
          <Textarea
            placeholder="Template"
            value={newTemplate}
            onChange={(e) => setNewTemplate(e.target.value)}
            className="mb-4"
          />
          <Button
            onClick={
              selectedCategory ? handleAddTemplateToCategory : handleAddFormat
            }
          >
            {selectedCategory ? "Add Template" : "Add Category and Template"}
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingFormat}
        onOpenChange={() => setEditingFormat(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Format</DialogTitle>
          </DialogHeader>
          {editingFormat && (
            <>
              <Input
                placeholder="Category Name"
                value={editingFormat.category}
                onChange={(e) =>
                  setEditingFormat({
                    ...editingFormat,
                    category: e.target.value,
                  })
                }
                className="mb-4"
              />
              {editingFormat.templates.map((template, index) => (
                <Textarea
                  key={index}
                  placeholder={`Template ${index + 1}`}
                  value={template}
                  onChange={(e) => {
                    const newTemplates = [...editingFormat.templates];
                    newTemplates[index] = e.target.value;
                    setEditingFormat({
                      ...editingFormat,
                      templates: newTemplates,
                    });
                  }}
                  className="mb-4"
                />
              ))}
              <Button
                onClick={() => {
                  // Implement save changes functionality
                  // This should update the format in the database
                  // and then refresh the list of formats
                  setEditingFormat(null);
                }}
              >
                Save Changes
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default SavedFormatsPage;
