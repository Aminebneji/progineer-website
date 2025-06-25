import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {PageLayout} from "@/components/layout";

export default function Page(){
    return <PageLayout>
        <Card>
            <CardHeader>
                <CardTitle>Realisation</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Link href="/realisations/real1" className="text-blue-500">Première Real</Link>
                <Link href="/realisations/real2" className="text-blue-500">Seconde Real</Link>
                <Link href="/realisations/real3" className="text-blue-500">Troisieme Real</Link>
            </CardContent>
        </Card>
    </PageLayout>
}