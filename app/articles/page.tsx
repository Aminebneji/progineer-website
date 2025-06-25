import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Page() {
    const articles = await prisma.article.findMany();

    return (
        <>
            <Button asChild>
                <Link href="/">HOME</Link>
            </Button>
            <div className="grid gap-6 mt-4">
                {articles.map((article) => (
                    <Card key={article.id}>
                        <CardHeader>
                            <CardTitle>{article.title}</CardTitle>
                            <CardDescription>
                                {article.createdAt.toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>{article.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}
