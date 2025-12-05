
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Strike from '@tiptap/extension-strike';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Link as LinkIcon,
  Strikethrough,
  Highlighter,
  Code,
  Plus,
  Eraser,
  MessageSquare,
  Calculator,
  Unlink,
  Copy,
  Scissors,
  Clipboard,
  Search,
  MousePointer
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { uploadFile } from '@/services/fileUploadService';
import { toast } from 'sonner';
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
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Import lowlight for syntax highlighting
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = "Start typing...",
  editable = true 
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [mathExpression, setMathExpression] = useState('');
  const [isMathDialogOpen, setIsMathDialogOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      Underline,
      Strike,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-100 dark:bg-gray-800 p-3 rounded-md',
        },
      }),
    ],
    content: content,
    editable: editable,
    onUpdate: ({ editor }) => {
      if (editable) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base max-w-none focus:outline-none min-h-[150px] p-4 border-0',
        'data-placeholder': placeholder,
      },
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  // Update editor editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      toast.info('Uploading image...');
      
      // Upload to Supabase storage
      const imageUrl = await uploadFile(file, 'content-images', 'rich-text-editor');
      
      if (imageUrl) {
        // Insert image into editor
        editor.chain().focus().setImage({ src: imageUrl }).run();
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const addImageByUrl = () => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);

    if (selectedText) {
      setIsLinkDialogOpen(true);
    } else {
      toast.error('Please select some text first');
    }
  };

  const addExternalLink = () => {
    if (!editor) return;
    
    const url = window.prompt('Enter URL:');
    if (url) {
      const linkText = window.prompt('Enter link text:') || url;
      editor.chain().focus().insertContent(`<a href="${url}" target="_blank" rel="noopener">${linkText}</a>`).run();
    }
  };

  const applyLink = () => {
    if (!editor || !linkUrl.trim()) return;

    editor.chain().focus().setLink({ href: linkUrl }).run();
    setLinkUrl('');
    setIsLinkDialogOpen(false);
    toast.success('Link added successfully');
  };

  const removeLink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  };

  const addMath = () => {
    if (!editor || !mathExpression.trim()) return;

    // Insert math as code with special formatting
    editor.chain().focus().insertContent(`<code class="math-expression bg-blue-100 px-2 py-1 rounded">${mathExpression}</code>`).run();
    setMathExpression('');
    setIsMathDialogOpen(false);
    toast.success('Math expression added');
  };

  const addComment = () => {
    if (!editor || !comment.trim()) return;

    // Insert comment as highlighted text with special styling
    editor.chain().focus().insertContent(`<mark class="comment bg-yellow-200 px-2 py-1 rounded" title="Comment">${comment}</mark>`).run();
    setComment('');
    setIsCommentDialogOpen(false);
    toast.success('Comment added');
  };

  const clearFormatting = () => {
    if (!editor) return;
    
    editor.chain().focus()
      .clearNodes()
      .unsetAllMarks()
      .run();
    
    toast.success('Formatting cleared');
  };

  const cutText = () => {
    if (!editor) return;
    
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
      editor.chain().focus().deleteSelection().run();
      toast.success('Text cut to clipboard');
    }
  };

  const copyText = () => {
    if (!editor) return;
    
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
      toast.success('Text copied to clipboard');
    }
  };

  const pasteText = async () => {
    if (!editor) return;
    
    try {
      const text = await navigator.clipboard.readText();
      editor.chain().focus().insertContent(text).run();
      toast.success('Text pasted');
    } catch (error) {
      toast.error('Failed to paste text');
    }
  };

  const pasteAsPlainText = async () => {
    if (!editor) return;
    
    try {
      const text = await navigator.clipboard.readText();
      // Strip any HTML tags and insert as plain text
      const plainText = text.replace(/<[^>]*>/g, '');
      editor.chain().focus().insertContent(plainText).run();
      toast.success('Text pasted as plain text');
    } catch (error) {
      toast.error('Failed to paste text');
    }
  };

  const selectAll = () => {
    if (!editor) return;
    editor.chain().focus().selectAll().run();
  };

  const extractCurrentSelection = () => {
    if (!editor) return;
    
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    
    if (selectedText) {
      // Create a new document or window with just the selected content
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>Extracted Content</title></head>
            <body><div>${selectedText}</div></body>
          </html>
        `);
        newWindow.document.close();
      }
    } else {
      toast.error('Please select some text first');
    }
  };

  const searchInContent = () => {
    if (!editor || !searchTerm.trim()) return;
    
    const content = editor.getHTML();
    if (content.toLowerCase().includes(searchTerm.toLowerCase())) {
      toast.success('Search term found in content');
      // Note: Full text search and highlighting would require additional extension
    } else {
      toast.error('Search term not found');
    }
  };

  if (!editor) return null;

  return (
    <div className="border rounded-lg overflow-hidden">
      {editable && (
        <div className="border-b bg-muted/50 p-2 flex flex-wrap gap-1">
          {/* Basic formatting */}
          <Toggle
            size="sm"
            pressed={editor.isActive('bold')}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            aria-label="Bold"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('italic')}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            aria-label="Italic"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('underline')}
            onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            aria-label="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('strike')}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            aria-label="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Toggle>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Highlight and Code */}
          <Toggle
            size="sm"
            pressed={editor.isActive('highlight')}
            onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
            disabled={!editor.can().chain().focus().toggleHighlight().run()}
            aria-label="Highlight"
          >
            <Highlighter className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('code')}
            onPressedChange={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            aria-label="Code"
          >
            <Code className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('codeBlock')}
            onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
            aria-label="Code Block"
          >
            <Code className="h-4 w-4" />
          </Toggle>

          <div className="w-px h-6 bg-border mx-1" />
          
          {/* Text alignment */}
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: 'left' })}
            onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
            aria-label="Align left"
          >
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: 'center' })}
            onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
            aria-label="Align center"
          >
            <AlignCenter className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: 'right' })}
            onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
            aria-label="Align right"
          >
            <AlignRight className="h-4 w-4" />
          </Toggle>

          <div className="w-px h-6 bg-border mx-1" />
          
          {/* Lists and quotes */}
          <Toggle
            size="sm"
            pressed={editor.isActive('bulletList')}
            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            disabled={!editor.can().chain().focus().toggleBulletList().run()}
            aria-label="Bullet list"
          >
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('orderedList')}
            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={!editor.can().chain().focus().toggleOrderedList().run()}
            aria-label="Numbered list"
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('blockquote')}
            onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={!editor.can().chain().focus().toggleBlockquote().run()}
            aria-label="Quote"
          >
            <Quote className="h-4 w-4" />
          </Toggle>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Links */}
          <Button
            size="sm"
            variant="ghost"
            onClick={setLink}
            aria-label="Add link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={removeLink}
            disabled={!editor.isActive('link')}
            aria-label="Remove link"
          >
            <Unlink className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Images */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleImageButtonClick}
            aria-label="Upload image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={addImageByUrl}
            aria-label="Add image by URL"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Math and Comments */}
          <Dialog open={isMathDialogOpen} onOpenChange={setIsMathDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                aria-label="Add math expression"
              >
                <Calculator className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Math Expression</DialogTitle>
                <DialogDescription>
                  Enter a mathematical expression or formula
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="math">Math Expression</Label>
                  <Input
                    id="math"
                    value={mathExpression}
                    onChange={(e) => setMathExpression(e.target.value)}
                    placeholder="e.g., x² + y² = z²"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsMathDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addMath} disabled={!mathExpression.trim()}>
                  Add Math
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                aria-label="Add comment"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Comment</DialogTitle>
                <DialogDescription>
                  Add a comment or note to your content
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter your comment here..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCommentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addComment} disabled={!comment.trim()}>
                  Add Comment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Search */}
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                aria-label="Search in content"
              >
                <Search className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Search Content</DialogTitle>
                <DialogDescription>
                  Search for text within the editor content
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search">Search Term</Label>
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter text to search..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSearchOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={searchInContent} disabled={!searchTerm.trim()}>
                  Search
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Clear formatting */}
          <Button
            size="sm"
            variant="ghost"
            onClick={clearFormatting}
            aria-label="Clear formatting"
          >
            <Eraser className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Undo/Redo */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            aria-label="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            aria-label="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="min-h-[200px]">
        <ContextMenu>
          <ContextMenuTrigger>
            <EditorContent editor={editor} />
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            <ContextMenuItem onClick={setLink} disabled={!editable}>
              <LinkIcon className="h-4 w-4 mr-2" />
              Add link
            </ContextMenuItem>
            <ContextMenuItem onClick={addExternalLink} disabled={!editable}>
              <LinkIcon className="h-4 w-4 mr-2" />
              Add external link
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <MousePointer className="h-4 w-4 mr-2" />
                Format
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem 
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  disabled={!editable}
                >
                  <Bold className="h-4 w-4 mr-2" />
                  Bold
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  disabled={!editable}
                >
                  <Italic className="h-4 w-4 mr-2" />
                  Italic
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  disabled={!editable}
                >
                  <Strikethrough className="h-4 w-4 mr-2" />
                  Strikethrough
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => editor?.chain().focus().toggleHighlight().run()}
                  disabled={!editable}
                >
                  <Highlighter className="h-4 w-4 mr-2" />
                  Highlight
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => editor?.chain().focus().toggleCode().run()}
                  disabled={!editable}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Code
                  {editor?.isActive('code') && <span className="ml-auto">✓</span>}
                </ContextMenuItem>
                <ContextMenuItem onClick={() => setIsMathDialogOpen(true)} disabled={!editable}>
                  <Calculator className="h-4 w-4 mr-2" />
                  Math
                </ContextMenuItem>
                <ContextMenuItem onClick={() => setIsCommentDialogOpen(true)} disabled={!editable}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Comment
                </ContextMenuItem>
                <ContextMenuItem onClick={clearFormatting} disabled={!editable}>
                  <Eraser className="h-4 w-4 mr-2" />
                  Clear formatting
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <MousePointer className="h-4 w-4 mr-2" />
                Paragraph
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem 
                  onClick={() => editor?.chain().focus().setParagraph().run()}
                  disabled={!editable}
                >
                  Normal text
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                  disabled={!editable}
                >
                  Heading 1
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  disabled={!editable}
                >
                  Heading 2
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                  disabled={!editable}
                >
                  Heading 3
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Plus className="h-4 w-4 mr-2" />
                Insert
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem onClick={handleImageButtonClick} disabled={!editable}>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Image
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  disabled={!editable}
                >
                  <List className="h-4 w-4 mr-2" />
                  Bullet List
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  disabled={!editable}
                >
                  <ListOrdered className="h-4 w-4 mr-2" />
                  Numbered List
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  disabled={!editable}
                >
                  <Quote className="h-4 w-4 mr-2" />
                  Quote
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuItem onClick={extractCurrentSelection}>
              <MousePointer className="h-4 w-4 mr-2" />
              Extract current selection...
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={cutText} disabled={!editable}>
              <Scissors className="h-4 w-4 mr-2" />
              Cut
            </ContextMenuItem>
            <ContextMenuItem onClick={copyText}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </ContextMenuItem>
            <ContextMenuItem onClick={pasteText} disabled={!editable}>
              <Clipboard className="h-4 w-4 mr-2" />
              Paste
            </ContextMenuItem>
            <ContextMenuItem onClick={pasteAsPlainText} disabled={!editable}>
              <Clipboard className="h-4 w-4 mr-2" />
              Paste as plain text
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={selectAll}>
              <MousePointer className="h-4 w-4 mr-2" />
              Select all
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setIsSearchOpen(true)}>
              <Search className="h-4 w-4 mr-2" />
              Search for "{searchTerm || 'text'}"
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
            <DialogDescription>
              Enter the URL for the selected text
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                type="url"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyLink} disabled={!linkUrl.trim()}>
              Add Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}