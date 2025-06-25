import {ModeToggle} from "@/components/theme-toggle";
import Link from "next/link";
import {PageLayout} from "@/components/layout";
import {Button} from "@/components/ui/button";

export default function Home() {
  return (
      <PageLayout>
<h1>progineer website</h1>
          <Button><Link href="/articles">Realisations</Link></Button>
        <ModeToggle />
      </PageLayout>
  );
}
