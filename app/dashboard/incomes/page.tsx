"use client"

import { lusitana } from '@/app/ui/fonts';
import { FormComponent } from '@/components/component/form';

export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}></h1>

        <FormComponent/>

    </main>
  );
}
