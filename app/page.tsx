import Link from "next/link";
import {PageLayout} from "@/components/layout";
import {Button} from "@/components/ui/button";

export default function Home() {
  return (
      <PageLayout>
<h1>progineer website</h1>
          <Button className="max-w-xs"><Link href="/realisations">Realisations</Link></Button>
      </PageLayout>
  );
}
