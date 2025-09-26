
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageSquare, PlayCircle, Send, Video } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const videoData = [
  {
    id: 1,
    title: 'Mastering Drip Irrigation for Higher Yields',
    thumbnailUrl: 'https://picsum.photos/seed/drip-irrigation/800/450',
    videoUrl: 'https://www.youtube.com/embed/QHXYs-2s5-s',
    likes: 125,
    comments: [
      { id: 1, user: 'FarmerJoe', text: 'This was incredibly helpful!' },
      { id: 2, user: 'AgriPro', text: 'Great tips on pressure regulation.' },
    ],
  },
  {
    id: 2,
    title: 'A Guide to Organic Pest Control',
    thumbnailUrl: 'https://picsum.photos/seed/organic-pests/800/450',
    videoUrl: 'https://www.youtube.com/embed/s-r-p2m-s-s',
    likes: 340,
    comments: [
      { id: 1, user: 'EcoFarms', text: 'Neem oil is a lifesaver.' },
    ],
  },
  {
    id: 3,
    title: 'Soil Health 101: The Foundation of Your Farm',
    thumbnailUrl: 'https://picsum.photos/seed/soil-health/800/450',
    videoUrl: 'https://www.youtube.com/embed/s-k-d-2-s',
    likes: 56,
    comments: [],
  },
];

export default function AgriVideosPage() {
  const [videos, setVideos] = useState(videoData);

  const handleLike = (videoId: number) => {
    setVideos(prevVideos =>
      prevVideos.map(video =>
        video.id === videoId ? { ...video, likes: video.likes + 1 } : video
      )
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Video className="h-8 w-8" />
          Agri Videos
        </h1>
        <p className="text-muted-foreground">
          Watch tutorials, tips, and success stories from the farming community.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map(video => (
          <Card key={video.id} className="flex flex-col">
            <CardHeader className="p-0">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative aspect-video rounded-t-lg overflow-hidden cursor-pointer group">
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <PlayCircle className="h-16 w-16 text-white/80 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-0">
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={video.videoUrl}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle className="text-lg mb-2">{video.title}</CardTitle>
              <div className="flex items-center gap-4 text-muted-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleLike(video.id)}
                >
                  <Heart className="h-4 w-4" /> {video.likes}
                </Button>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" /> {video.comments.length}
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t flex flex-col items-start gap-4">
              <h4 className="font-semibold text-sm">Comments</h4>
              <div className="w-full space-y-3 max-h-32 overflow-y-auto">
                {video.comments.length > 0 ? (
                  video.comments.map(comment => (
                    <div key={comment.id} className="text-sm">
                      <span className="font-bold">{comment.user}:</span>{' '}
                      <span className="text-muted-foreground">
                        {comment.text}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No comments yet.
                  </p>
                )}
              </div>
              <div className="w-full flex items-center gap-2">
                <Textarea placeholder="Add a comment..." rows={1} className="flex-grow resize-none" />
                <Button size="icon" variant="ghost">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
