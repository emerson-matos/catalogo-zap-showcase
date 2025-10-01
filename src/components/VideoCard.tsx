import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface VideoCardProps {
  title: string;
  description: string;
  videoSrc: string;
}

export const VideoCard = ({ title, description, videoSrc }: VideoCardProps) => {
  return (
    <div className="bg-gradient-card shadow-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer">
            {/* Video Thumbnail */}
            <div className="relative aspect-video bg-muted">
              <video
                className="w-full h-full object-cover"
                muted
                preload="metadata"
              >
                <source src={`${videoSrc}#t=1`} type="video/mp4" />
              </video>
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                <div className="bg-primary/90 rounded-full p-3 hover:bg-primary transition-colors">
                  <Play className="w-6 h-6 text-primary-foreground fill-current" />
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm mb-3">
                {description}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Assistir Vídeo
              </Button>
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-4xl">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <video controls className="w-full rounded-lg" autoPlay>
              <source src={videoSrc} type="video/mp4" />
              <track kind="captions" srcLang="pt" label="Português" />
              Seu navegador não suporta o player de vídeo.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
