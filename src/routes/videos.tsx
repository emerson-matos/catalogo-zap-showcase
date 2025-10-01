import { createFileRoute } from "@tanstack/react-router";
import { VideoCard } from "@/components/VideoCard";

const videosData = [
  {
    id: "video-1",
    title: "Dicas de Maquiagem",
    description: "Aprenda técnicas essenciais de maquiagem para o dia a dia",
    videoSrc: "/meu-video.mp4",
  },
  {
    id: "video-2",
    title: "Mais Dicas de Beleza",
    description: "Descubra segredos de beleza e cuidados com a pele",
    videoSrc: "/meu-video-2.mp4",
  },
];

function VideosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Vídeos de Beleza</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Assista aos nossos vídeos exclusivos com dicas de maquiagem, cuidados
          com a pele e muito mais. Clique em qualquer vídeo para assistir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {videosData.map((video) => (
          <VideoCard
            key={video.id}
            title={video.title}
            description={video.description}
            videoSrc={video.videoSrc}
          />
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/videos")({
  component: VideosPage,
});

