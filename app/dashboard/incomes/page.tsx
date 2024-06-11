'use client';

import { lusitana } from '@/app/ui/fonts';
import { Button } from '@/app/components/ui/button';

export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}></h1>
      nada
      <div><Button variant="link">asasdasd</Button></div>
      <div>
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </main>
  );
}
