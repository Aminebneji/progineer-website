import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { parseParamsUrlFromId } from "@/lib/utils";
import { notFound } from "next/navigation";

type Props = {
    params: { "title-id": string }
};

export default async function RealisationDetailPage(props: Props) {
    const params = await props.params;

    if (!params || !params["title-id"]) return notFound();

    try {
        const { id } = parseParamsUrlFromId(params["title-id"]);
        const realisation = await prisma.realisation.findUnique({
            where: { id },
        });

        if (!realisation) return notFound();

        return (
            <>
                <Card className=" gap-6 mt-7 vh-full">
                    <CardHeader>
                        <h1 className="text-2xl font-bold">{realisation.title}</h1>
                        <p className="text-muted-foreground mb-2">
                            Publié le {realisation.createdAt.toLocaleDateString()}
                        </p>
                    </CardHeader>
                    <CardDescription>
                        <div className="p-4">
                            <h2 className="text-lg font-semibold">Détails de la réalisation</h2>
                            <p>{realisation.description}</p>
                        </div>
                    </CardDescription>
                    <CardContent>
                        <div className="p-4">
                            <h2 className="text-lg font-semibold">Contenu</h2>
                            <img src={realisation.imageUrl ?? ""} alt={"image of " + realisation.title} />
                        </div>
                    </CardContent>
                </Card>
            </>
        );
    } catch (e) {
        console.error("Error parsing param or fetching:", e);
        return notFound();
    }
}