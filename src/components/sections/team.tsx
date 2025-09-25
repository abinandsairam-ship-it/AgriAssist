import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const teamMembers = [
  {
    id: 'team-jane-doe',
    name: 'Jane Doe',
    role: 'CEO',
  },
  {
    id: 'team-john-smith',
    name: 'John Smith',
    role: 'Lead Agronomist',
  },
  {
    id: 'team-emily-moore',
    name: 'Emily Moore',
    role: 'Head of AI',
  },
  {
    id: 'team-chris-brown',
    name: 'Chris Brown',
    role: 'Product Manager',
  },
];

export function TeamSection() {
  return (
    <section id="team" className="w-full py-16 md:py-24 lg:py-32 bg-card">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            Meet Our Team
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            The experts behind our innovative agricultural solutions.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map(member => {
            const image = PlaceHolderImages.find(img => img.id === member.id);
            return (
              <Card key={member.id} className="text-center">
                <CardContent className="flex flex-col items-center p-6">
                  <Avatar className="w-24 h-24 mb-4">
                    {image && (
                      <AvatarImage
                        src={image.imageUrl}
                        alt={image.description}
                        data-ai-hint={image.imageHint}
                      />
                    )}
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
