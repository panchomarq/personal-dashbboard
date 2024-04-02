"use client"

import { lusitana } from '@/app/ui/fonts';
import FormComponent from "@/app/ui/components/income-form"

export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}></h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <FormComponent/>
      </div>
    </main>
  );
}
