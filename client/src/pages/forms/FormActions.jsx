import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { CopyIcon, ExternalLinkIcon, EyeIcon, PencilIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function FormActions({ publicId, id, onEditClick, hideView }) {
  const { toast } = useToast();
  const formUrl = `${location.origin}/public/forms/${publicId}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(formUrl).then(() => {
      toast({
        title: "Copied to clipboard",
      });
    });
  };

  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" onClick={handleCopy}>
        <CopyIcon className="h-4 w-4" />
      </Button>
      <a href={formUrl} target="_blank">
        <Button variant="primary" size="sm">
          <ExternalLinkIcon className="h-4 w-4" />
        </Button>
      </a>
      {!hideView && (
        <Link to={`/forms/${id}`}>
          <Button variant="outline" size="sm">
            <EyeIcon className="h-4 w-4" />
          </Button>
        </Link>
      )}
      {onEditClick && (
        <Button variant="outline" size="sm" onClick={onEditClick}>
          <PencilIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
