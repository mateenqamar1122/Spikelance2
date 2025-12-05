
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ContentGeneration {
  id: string;
  title: string;
  prompt: string;
  content: string;
  content_type: string;
  tone?: string | null;
  tags?: string[] | null;
  is_favorite?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  user_id?: string | null;
}

export interface ContentGenerationRequest {
  prompt: string;
  contentType: string;
  tone?: string;
  instructions?: string;
}

const formatGeneratedContent = (content: string, contentType: string): string => {
  if (!content) return content;

  // Remove any existing HTML tags first
  const cleanContent = content.replace(/<[^>]*>/g, '');

  switch (contentType) {
    case 'follow-up-email':
    case 'welcome-email':
    case 'sales-outreach':
    case 'cold-email':
    case 'newsletter':
      return formatEmailContent(cleanContent);
    
    case 'twitter-post':
    case 'linkedin-post':
    case 'instagram-caption':
    case 'facebook-post':
      return formatSocialContent(cleanContent, contentType);
    
    case 'bullet-points':
      return formatBulletPoints(cleanContent);
    
    case 'blog-outline':
      return formatBlogOutline(cleanContent);
    
    case 'blog-title-ideas':
      return formatBlogTitleIdeas(cleanContent);
    
    default:
      return `<p>${cleanContent.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
  }
};

const formatEmailContent = (content: string): string => {
  const lines = content.split('\n').filter(line => line.trim());
  let formattedContent = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.toLowerCase().startsWith('subject:')) {
      formattedContent += `<h3 style="margin-bottom: 16px; color: #374151;">${line}</h3>`;
    } else if (line.toLowerCase().includes('dear ') || line.toLowerCase().includes('hello ')) {
      formattedContent += `<p style="margin-bottom: 16px;"><strong>${line}</strong></p>`;
    } else if (line.toLowerCase().includes('sincerely') || line.toLowerCase().includes('best regards') || line.toLowerCase().includes('yours truly')) {
      formattedContent += `<p style="margin-top: 24px; margin-bottom: 8px;">${line}</p>`;
    } else if (line.startsWith('[') && line.endsWith(']')) {
      formattedContent += `<p style="margin-bottom: 8px; color: #6B7280; font-style: italic;">${line}</p>`;
    } else if (line.length < 50 && !line.endsWith('.') && !line.endsWith('!') && !line.endsWith('?')) {
      // Likely a signature line
      formattedContent += `<p style="margin-bottom: 4px; font-weight: 500;">${line}</p>`;
    } else {
      formattedContent += `<p style="margin-bottom: 16px; line-height: 1.6;">${line}</p>`;
    }
  }

  return formattedContent;
};

const formatSocialContent = (content: string, platform: string): string => {
  const lines = content.split('\n').filter(line => line.trim());
  let formattedContent = '';

  if (platform === 'twitter-post') {
    // Twitter format with hashtags and mentions
    for (const line of lines) {
      const formattedLine = line
        .replace(/#(\w+)/g, '<span style="color: #1DA1F2; font-weight: 500;">#$1</span>')
        .replace(/@(\w+)/g, '<span style="color: #1DA1F2; font-weight: 500;">@$1</span>');
      formattedContent += `<p style="margin-bottom: 12px; line-height: 1.4;">${formattedLine}</p>`;
    }
  } else if (platform === 'linkedin-post') {
    // LinkedIn professional format
    for (const line of lines) {
      if (line.includes('💼') || line.includes('🚀') || line.includes('💡')) {
        formattedContent += `<p style="margin-bottom: 16px; font-weight: 500; line-height: 1.5;">${line}</p>`;
      } else {
        formattedContent += `<p style="margin-bottom: 12px; line-height: 1.6;">${line}</p>`;
      }
    }
  } else {
    // Instagram/Facebook format
    for (const line of lines) {
      formattedContent += `<p style="margin-bottom: 12px; line-height: 1.5;">${line}</p>`;
    }
  }

  return formattedContent;
};

const formatBulletPoints = (content: string): string => {
  const lines = content.split('\n').filter(line => line.trim());
  let formattedContent = '<ul style="padding-left: 20px; margin-bottom: 16px;">';

  for (const line of lines) {
    const cleanLine = line.replace(/^[-•*]\s*/, '').trim();
    if (cleanLine) {
      formattedContent += `<li style="margin-bottom: 8px; line-height: 1.5;">${cleanLine}</li>`;
    }
  }

  formattedContent += '</ul>';
  return formattedContent;
};

const formatBlogOutline = (content: string): string => {
  const lines = content.split('\n').filter(line => line.trim());
  let formattedContent = '';

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.match(/^(I{1,3}\.|\d+\.)/)) {
      // Main sections
      formattedContent += `<h3 style="margin-top: 24px; margin-bottom: 12px; color: #111827; font-weight: 600;">${trimmedLine}</h3>`;
    } else if (trimmedLine.match(/^[A-Z]\./)) {
      // Sub-sections
      formattedContent += `<h4 style="margin-top: 16px; margin-bottom: 8px; color: #374151; font-weight: 500;">${trimmedLine}</h4>`;
    } else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
      // Bullet points
      const cleanLine = trimmedLine.replace(/^[-•]\s*/, '');
      formattedContent += `<p style="margin-left: 20px; margin-bottom: 6px; line-height: 1.5;">• ${cleanLine}</p>`;
    } else if (trimmedLine) {
      formattedContent += `<p style="margin-bottom: 12px; line-height: 1.6;">${trimmedLine}</p>`;
    }
  }

  return formattedContent;
};

const formatBlogTitleIdeas = (content: string): string => {
  const lines = content.split('\n').filter(line => line.trim());
  let formattedContent = '<div style="space-y: 12px;">';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const cleanLine = line.replace(/^\d+\.\s*/, '').replace(/^[-•*]\s*/, '');
      formattedContent += `<div style="margin-bottom: 12px; padding: 12px; background-color: #F9FAFB; border-left: 4px solid #3B82F6; border-radius: 4px;">
        <h4 style="margin: 0; color: #111827; font-weight: 500; line-height: 1.4;">${cleanLine}</h4>
      </div>`;
    }
  }

  formattedContent += '</div>';
  return formattedContent;
};

export const generateContent = async (request: ContentGenerationRequest): Promise<string | null> => {
  try {
    const combinedPrompt = [
      request.instructions ? `Instructions: ${request.instructions}` : null,
      `Prompt: ${request.prompt}`
    ].filter(Boolean).join("\n\n");

    const { data, error } = await supabase.functions.invoke("generate-content", {
      body: {
        prompt: combinedPrompt,
        contentType: request.contentType,
        tone: request.tone,
      },
    });

    if (error) {
      console.error('Supabase function error:', error);
      toast.error(`Failed to generate content: ${error.message}`);
      return null;
    }

    if (data?.error) {
      const errorMessage =
        typeof data.details === "object" && data.details?.error?.message
          ? data.details.error.message
          : data.error;

      if (errorMessage.includes("API key")) {
        toast.error("API key error - Please check your Gemini API key configuration");
      } else {
        toast.error(`Failed to generate content: ${errorMessage}`);
      }
      return null;
    }

    if (!data?.content) {
      toast.error("No content was generated");
      return null;
    }

    // Format the content based on type
    const formattedContent = formatGeneratedContent(data.content, request.contentType);
    return formattedContent;
  } catch (error: any) {
    console.error("Error generating content:", error);
    toast.error("Failed to generate content");
    return null;
  }
};

export const saveContentGeneration = async (
  generation: Omit<ContentGeneration, "id" | "created_at" | "updated_at">
): Promise<ContentGeneration | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error("Auth error:", userError);
      toast.error("You must be logged in to save content");
      return null;
    }

    const contentData = {
      ...generation,
      user_id: userData.user.id,
    };

    console.log("Saving content data:", contentData);

    const { data, error } = await supabase
      .from("content_generations")
      .insert([contentData])
      .select()
      .single();

    if (error) {
      console.error("Save error:", error);
      toast.error(`Failed to save content: ${error.message}`);
      return null;
    }

    console.log("Content saved successfully:", data);
    toast.success("Content saved successfully");
    return data as ContentGeneration;
  } catch (error: any) {
    console.error("Failed to save content:", error);
    toast.error("Failed to save content");
    return null;
  }
};

export const getContentGenerations = async (): Promise<ContentGeneration[]> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error("Auth error:", userError);
      return [];
    }

    console.log("Fetching content for user:", userData.user.id);

    const { data, error } = await supabase
      .from("content_generations")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      toast.error(`Failed to load saved content: ${error.message}`);
      return [];
    }

    console.log("Fetched content generations:", data);
    return data as ContentGeneration[];
  } catch (error: any) {
    console.error("Failed to load saved content:", error);
    toast.error("Failed to load saved content");
    return [];
  }
};

export const updateContentGeneration = async (
  id: string,
  updates: Partial<ContentGeneration>
): Promise<ContentGeneration | null> => {
  try {
    const { data, error } = await supabase
      .from("content_generations")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      toast.error(`Failed to update content: ${error.message}`);
      return null;
    }

    toast.success("Content updated successfully");
    return data as ContentGeneration;
  } catch (error: any) {
    console.error("Failed to update content:", error);
    toast.error("Failed to update content");
    return null;
  }
};

export const deleteContentGeneration = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("content_generations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      toast.error(`Failed to delete content: ${error.message}`);
      return false;
    }

    toast.success("Content deleted successfully");
    return true;
  } catch (error: any) {
    console.error("Failed to delete content:", error);
    toast.error("Failed to delete content");
    return false;
  }
};

export const toggleFavorite = async (
  id: string,
  isFavorite: boolean
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("content_generations")
      .update({ is_favorite: isFavorite })
      .eq("id", id);

    if (error) {
      console.error("Favorite toggle error:", error);
      toast.error(`Failed to update favorite status: ${error.message}`);
      return false;
    }

    toast.success(isFavorite ? "Added to favorites" : "Removed from favorites");
    return true;
  } catch (error: any) {
    console.error("Failed to update favorite status:", error);
    toast.error("Failed to update favorite status");
    return false;
  }
};