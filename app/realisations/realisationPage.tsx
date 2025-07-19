import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export default async function RealisationPage() {
    const realisations = await prisma.realisation.findMany();

    return (
        <div className="grid gap-6 mt-4">
            {realisations.map((realisation) => {
                const href = `/realisations/${slugify(realisation.title)}-${realisation.id}`;
                console.log(href)

                return (
                    <Link href={href} key={realisation.id}>
                        <Card className="cursor-pointer hover:shadow-lg transition">
                            <CardHeader>
                                <CardTitle>{realisation.title}</CardTitle>
                                <CardDescription>
                                    {realisation.createdAt.toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>{realisation.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
}
