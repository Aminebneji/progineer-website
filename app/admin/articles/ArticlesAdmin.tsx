"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {Article} from "@prisma/client";

//TODO créer une modale pour l'update
// voir pour créer une page à part pour la création ou une modale a partir d'un bouton " + "

export default function ArticlesAdmin() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch("/api/articles");
                const data = await res.json();
                setArticles(data);
            } catch (error) {
                console.error("Erreur lors du fetch des articles :", error);
            }
        };

        void fetchArticles();
    }, []);



    const createArticle = async () => {
        const response = await fetch("/api/articles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, content, image }),
        });

        if (response.ok) {
            const newArticle = await response.json();
            setArticles([newArticle, ...articles]);
            setTitle("");
            setDescription("");
            setContent("");
            setImage("");
        }
    };

    const deleteArticle = async (id: string) => {
        const res = await fetch(`/api/articles/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            setArticles(articles.filter((a) => a.id !== id));
        }
    };

    return (
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Créer un article</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input placeholder="Titre" value={title} onChange={(event) => setTitle(event.target.value)} />
                        <Textarea placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
                        <Textarea placeholder="Contenu" value={content} onChange={(event) => setContent(event.target.value)} />
                        <Input placeholder="URL de l'image" value={image} onChange={(event) => setImage(event.target.value)} />
                        <Button onClick={createArticle} disabled={!title || !description || !content}>Créer</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Liste des articles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Titre</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Créé le</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {articles.map((article) => (
                                    <TableRow key={article.id}>
                                        <TableCell className="font-medium">{article.title}</TableCell>
                                        <TableCell>{article.description}</TableCell>
                                        <TableCell>{new Date(article.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => deleteArticle(article.id)}
                                            >
                                                Supprimer
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
    );
}
