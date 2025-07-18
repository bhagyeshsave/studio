import { VlogGeneratorClient } from "@/components/features/vlog-generator-client";

export default function VlogsPage() {
  return (
    <div>
       <div className="mb-6">
        <h1 className="text-3xl font-headline font-semibold">Automated Area Vlogs</h1>
        <p className="text-muted-foreground">Use AI to generate a visual and audio summary of any popular or local area.</p>
      </div>
      <VlogGeneratorClient />
    </div>
  );
}
