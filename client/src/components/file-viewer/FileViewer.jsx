import React, { useState } from "react";
import { useReadFileQuery } from "@/store/fileApi";
import { formatFileSize, getCookie } from "@/services/utils";
import { useToast } from "@/hooks/useToast";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { DownloadIcon } from "lucide-react";

const FileViewer = ({ fileId }) => {
  const { data, error, isLoading } = useReadFileQuery(fileId);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error loading file.</p>;

  const { fileUrl, contentType, size, filename } = data;
  const isImage = contentType && contentType.startsWith("image/");

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const token = getCookie("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/files/${fileId}/download`,
        {
          method: "GET",
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        variant: "success",
        title: `File downloaded successfully`,
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        variant: "destructive",
        title: `Failed to download file`,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      {isImage && (
        <img
          src={fileUrl}
          alt="File"
          className="max-w-full max-h-96 h-auto mb-4"
        />
      )}
      <div className="p-4 bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {filename}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{formatFileSize(size)}</p>
          </div>
          <Button
            onClick={handleDownload}
            className={cn(
              "ml-4",
              "hover:bg-primary/90",
              "active:scale-95 transition-transform"
            )}
            isLoading={isDownloading}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
