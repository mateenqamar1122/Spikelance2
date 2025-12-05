
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Wand2, 
  Copy, 
  Download, 
  Bookmark, 
  Star, 
  Clock, 
  Search, 
  Trash2, 
  Save, 
  Loader2,
  ListFilter,
  Tag,
  Pencil,
  BookmarkCheck,
  RotateCcw,
  File,
  FileText,
  History,
  Archive
} from "lucide-react";
import { 
  generateContent, 
  saveContentGeneration, 
  getContentGenerations,
  updateContentGeneration,
  deleteContentGeneration,
  toggleFavorite,
  ContentGeneration 
} from "@/services/contentGenerationService";
import { toast } from "sonner";
import RichTextEditor from "@/components/project/RichTextEditor";

const ContentGenerator = () => {
  // States for the form
  const [activeTab, setActiveTab] = useState("generator");
  const [contentType, setContentType] = useState("paragraph");
  const [tone, setTone] = useState("professional");
  const [keywords, setKeywords] = useState("");
  const [instructions, setInstructions] = useState("");
  const [title, setTitle] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Query for fetching saved content generations
  const { data: savedGenerations = [], isLoading } = useQuery({
    queryKey: ['contentGenerations'],
    queryFn: getContentGenerations,
  });

  // Mutations for content operations
  const generateMutation = useMutation({
    mutationFn: generateContent,
    onSuccess: (data) => {
      if (data) {
        setGeneratedContent(data);
        // Generate a title from keywords if not provided
        if (!title) {
          let generatedTitle = keywords.split(' ').slice(0, 5).join(' ');
          if (generatedTitle.length > 30) {
            generatedTitle = generatedTitle.substring(0, 30) + '...';
          }
          setTitle(generatedTitle || 'Generated Content');
        }
      }
    },
    onError: (error) => {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content. Please try again.");
    },
  });

  const saveMutation = useMutation({
    mutationFn: saveContentGeneration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentGenerations'] });
      toast.success("Content saved successfully");
      // Reset form after saving
      resetForm();
    },
    onError: (error) => {
      console.error("Error saving content:", error);
      toast.error("Failed to save content. Please try again.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ContentGeneration> }) =>
      updateContentGeneration(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentGenerations'] });
      toast.success("Content updated successfully");
    },
    onError: (error) => {
      console.error("Error updating content:", error);
      toast.error("Failed to update content. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContentGeneration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentGenerations'] });
      toast.success("Content deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content. Please try again.");
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      toggleFavorite(id, isFavorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentGenerations'] });
    },
    onError: (error) => {
      console.error("Error updating favorite status:", error);
      toast.error("Failed to update favorite status. Please try again.");
    },
  });

  // Function to handle content generation
  const handleGenerateContent = async () => {
    if (!keywords.trim()) {
      toast.error("Please enter keywords or a topic");
      return;
    }

    setIsGenerating(true);
    try {
      await generateMutation.mutateAsync({
        prompt: keywords,
        contentType,
        tone,
        instructions
      });
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to save generated content
  const handleSaveContent = async () => {
    if (!generatedContent || !title.trim()) {
      toast.error("Content and title are required");
      return;
    }

    try {
      await saveMutation.mutateAsync({
        title: title.trim(),
        prompt: keywords,
        content: generatedContent,
        content_type: contentType,
        tone,
        tags: selectedTags.length > 0 ? selectedTags : null,
      });
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  // Function to update content
  const handleUpdateContent = async (id: string) => {
    if (editingId === id) {
      if (!generatedContent || !title.trim()) {
        toast.error("Content and title are required");
        return;
      }

      try {
        await updateMutation.mutateAsync({
          id,
          updates: {
            title: title.trim(),
            content: generatedContent,
            tags: selectedTags.length > 0 ? selectedTags : null,
          },
        });
        setEditingId(null);
      } catch (error) {
        console.error("Error updating content:", error);
      }
    } else {
      const item = savedGenerations.find(gen => gen.id === id);
      if (item) {
        setTitle(item.title);
        setGeneratedContent(item.content);
        setKeywords(item.prompt);
        setContentType(item.content_type);
        setTone(item.tone || "professional");
        setSelectedTags(item.tags || []);
        setEditingId(id);
        setActiveTab("generator");
      }
    }
  };

  // Function to add a tag
  const addTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag("");
    }
  };

  // Function to remove a tag
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  // Function to copy content to clipboard
  const copyToClipboard = (content: string) => {
    // Strip HTML tags for plain text copy
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    navigator.clipboard.writeText(plainText);
    toast.success("Content copied to clipboard");
  };

  // Function to download content
  const downloadContent = (content: string, fileName: string) => {
    // Strip HTML tags for plain text download
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    
    const element = document.createElement("a");
    const file = new Blob([plainText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName || "generated-content"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Content downloaded");
  };

  // Function to reset the form
  const resetForm = () => {
    setTitle("");
    setKeywords("");
    setInstructions("");
    setGeneratedContent("");
    setSelectedTags([]);
    setEditingId(null);
  };

  // Filter saved generations based on search term and selected tags
  const filteredGenerations = savedGenerations.filter((gen) => {
    const matchesSearch = !searchTerm || 
      gen.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gen.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gen.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      (gen.tags && selectedTags.every(tag => gen.tags?.includes(tag)));
    
    return matchesSearch && matchesTags;
  });

  // Get all unique tags from saved generations
  const allTags = Array.from(
    new Set(
      savedGenerations
        .flatMap(gen => gen.tags || [])
        .filter(Boolean)
    )
  );

  // Handle tags input with Enter key
  const handleTagsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Generator</h1>
        <p className="text-muted-foreground">
          Generate professional content for various purposes with AI assistance.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="saved">
            <Archive className="h-4 w-4 mr-1" />
            Saved Content ({savedGenerations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-4">
          <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>Generate Content</CardTitle>
              <CardDescription>
                Create professional content with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paragraph">Paragraph</SelectItem>
                        <SelectItem value="bullet-points">Bullet Points</SelectItem>
                        <SelectItem value="headline">Headlines</SelectItem>
                        <SelectItem value="slogan">Slogan/Tagline</SelectItem>
                        <SelectItem value="twitter-post">Twitter/X Post</SelectItem>
                        <SelectItem value="linkedin-post">LinkedIn Post</SelectItem>
                        <SelectItem value="instagram-caption">Instagram Caption</SelectItem>
                        <SelectItem value="facebook-post">Facebook Post</SelectItem>
                        <SelectItem value="follow-up-email">Follow-up Email</SelectItem>
                        <SelectItem value="welcome-email">Welcome Email</SelectItem>
                        <SelectItem value="sales-outreach">Sales Outreach</SelectItem>
                        <SelectItem value="cold-email">Cold Email</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                        <SelectItem value="blog-outline">Blog Outline</SelectItem>
                        <SelectItem value="blog-intro">Blog Introduction</SelectItem>
                        <SelectItem value="blog-title-ideas">Blog Title Ideas</SelectItem>
                        <SelectItem value="blog-conclusion">Blog Conclusion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                        <SelectItem value="authoritative">Authoritative</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="persuasive">Persuasive</SelectItem>
                        <SelectItem value="informative">Informative</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                        <SelectItem value="conversational">Conversational</SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Topic or Keywords</Label>
                  <Input 
                    placeholder="Enter topic or keywords (e.g., digital marketing, productivity tips)" 
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Additional Instructions (Optional)</Label>
                  <Textarea 
                    placeholder="Add any specific requirements or context..." 
                    className="resize-none" 
                    rows={3}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-blue/90 hover:to-brand-cyan/90 text-white"
                  onClick={handleGenerateContent}
                  disabled={isGenerating || !keywords.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>
                
                {generatedContent && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input 
                        placeholder="Enter a title for this content" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tags (Optional)</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedTags.map(tag => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button 
                              onClick={() => removeTag(tag)}
                              className="hover:text-destructive ml-1"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={handleTagsKeyDown}
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={addTag}
                          disabled={!newTag.trim()}
                        >
                          <Tag className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Generated Content</Label>
                        <div className="flex gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8" 
                            onClick={() => copyToClipboard(generatedContent)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8" 
                            onClick={() => downloadContent(generatedContent, title)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {!editingId ? (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8" 
                              onClick={handleSaveContent}
                              disabled={saveMutation.isPending}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8" 
                              onClick={() => handleUpdateContent(editingId)}
                              disabled={updateMutation.isPending}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <RichTextEditor
                        content={generatedContent}
                        onChange={setGeneratedContent}
                        placeholder="Your generated content will appear here..."
                        editable={true}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      {editingId ? (
                        <>
                          <Button variant="outline" onClick={resetForm}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={() => handleUpdateContent(editingId)}
                            disabled={updateMutation.isPending || !title.trim() || !generatedContent}
                          >
                            {updateMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              "Update Content"
                            )}
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={handleSaveContent} 
                          disabled={saveMutation.isPending || !title.trim() || !generatedContent}
                        >
                          {saveMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Content"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>Saved Content</CardTitle>
              <CardDescription>
                Browse, edit, and manage your saved content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search saved content..." 
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex gap-2 whitespace-nowrap">
                        <ListFilter className="h-4 w-4" />
                        Filter by Tags
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Filter by Tags</DialogTitle>
                        <DialogDescription>
                          Select tags to filter your saved content
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {allTags.length > 0 ? (
                            allTags.map(tag => (
                              <Badge 
                                key={tag} 
                                variant={selectedTags.includes(tag) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => {
                                  if (selectedTags.includes(tag)) {
                                    setSelectedTags(selectedTags.filter(t => t !== tag));
                                  } else {
                                    setSelectedTags([...selectedTags, tag]);
                                  }
                                }}
                              >
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No tags found</p>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedTags([])}
                        >
                          Clear All
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredGenerations.length > 0 ? (
                  <div className="space-y-4">
                    {filteredGenerations.map((gen) => (
                      <Card key={gen.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{gen.title}</CardTitle>
                              <CardDescription className="flex flex-wrap gap-2 items-center mt-1">
                                <Badge variant="outline">{gen.content_type}</Badge>
                                {gen.tone && <Badge variant="outline">{gen.tone}</Badge>}
                                <span className="text-xs flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(gen.created_at || "").toLocaleDateString()}
                                </span>
                              </CardDescription>
                              {gen.tags && gen.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {gen.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8"
                                onClick={() => favoriteMutation.mutate({ 
                                  id: gen.id, 
                                  isFavorite: !(gen.is_favorite || false) 
                                })}
                              >
                                {gen.is_favorite ? (
                                  <BookmarkCheck className="h-4 w-4 text-yellow-500" />
                                ) : (
                                  <Bookmark className="h-4 w-4" />
                                )}
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8"
                                onClick={() => handleUpdateContent(gen.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Confirm Deletion</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to delete "{gen.title}"? This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button 
                                      variant="destructive" 
                                      onClick={() => deleteMutation.mutate(gen.id)}
                                    >
                                      Delete
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: gen.content }} />
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <span className="text-xs text-muted-foreground">
                            Keywords: {gen.prompt}
                          </span>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => copyToClipboard(gen.content)}
                            >
                              <Copy className="h-4 w-4 mr-1" /> Copy
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <FileText className="h-4 w-4 mr-1" /> View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh]">
                                <DialogHeader>
                                  <DialogTitle>{gen.title}</DialogTitle>
                                  <DialogDescription className="flex flex-wrap gap-2 items-center mt-1">
                                    <Badge variant="outline">{gen.content_type}</Badge>
                                    {gen.tone && <Badge variant="outline">{gen.tone}</Badge>}
                                    <span className="text-xs flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {new Date(gen.created_at || "").toLocaleDateString()}
                                    </span>
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="my-4 max-h-[50vh] overflow-auto">
                                  <RichTextEditor
                                    content={gen.content}
                                    onChange={() => {}} // Read-only in view mode
                                    placeholder="Content will appear here..."
                                    editable={false}
                                  />
                                </div>
                                <DialogFooter>
                                  <Button 
                                    variant="outline" 
                                    className="mr-auto"
                                    onClick={() => downloadContent(gen.content, gen.title)}
                                  >
                                    <Download className="h-4 w-4 mr-1" /> Download
                                  </Button>
                                  <Button onClick={() => handleUpdateContent(gen.id)}>
                                    <Pencil className="h-4 w-4 mr-1" /> Edit
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
                    <h3 className="text-lg font-medium">No content found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || selectedTags.length > 0 
                        ? "Try adjusting your search or filters" 
                        : "Generate and save some content to see it here"}
                    </p>
                    {(searchTerm || selectedTags.length > 0) && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedTags([]);
                        }}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" /> Clear Filters
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentGenerator;