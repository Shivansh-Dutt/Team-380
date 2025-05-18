
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";

interface ImageUploadProps {
  onUploadComplete: (filePath: string) => void;
  existingImage?: string;
}

const ImageUpload = ({ onUploadComplete, existingImage }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(existingImage || null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setIsUploading(true);
      
      // Generate a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from("product_images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload image");
        return;
      }

      // Set the image URL
      const { data: publicUrl } = supabase.storage
        .from("product_images")
        .getPublicUrl(filePath);

      setImageUrl(publicUrl.publicUrl);
      onUploadComplete(filePath);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {imageUrl ? (
        <div className="mb-4 relative">
          <img
            src={imageUrl}
            alt="Product image"
            className="w-full h-64 object-cover rounded-md"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="absolute bottom-2 right-2"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            Change Image
          </Button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center w-full h-64 bg-muted cursor-pointer"
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <>
              <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Click to upload an image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG or GIF up to 5MB</p>
            </>
          )}
        </div>
      )}
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default ImageUpload;
