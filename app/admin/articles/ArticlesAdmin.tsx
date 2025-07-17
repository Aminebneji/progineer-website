"use client";

import { useEffect, useState } from "react";
import { Article } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GenericTable } from "@/components/common/genericTable";
import { ModalForm } from "@/components/common/modalForm";
import { FieldType } from "@/types/formTypes";

type ArticleWithFormattedDate = Article & { createdAtFormatted: string };


export default function ArticlesAdmin() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<ArticleWithFormattedDate[]>([]);

  const fields = [
    { name: "title", label: "Titre", type: FieldType.Text },
    { name: "description", label: "Description", type: FieldType.Textarea },
    { name: "content", label: "Contenu", type: FieldType.Textarea },
    { name: "seoTitle", label: "Titre SEO", type: FieldType.Text },
    { name: "seoDescription", label: "Description SEO", type: FieldType.Textarea },
    { name: "seoKeywords", label: "Mots-clés SEO", type: FieldType.Textarea },
    { name: "seoImage", label: "Image SEO", type: FieldType.Image },
  ];

  const columns = [
    { key: "title" as const, label: "Titre" },
    { key: "description" as const, label: "Description" },
    { key: "createdAtFormatted" as const, label: "Créé le" },
    { key: "content" as const, label: "Contenu" },
    { key: "seoTitle" as const, label: "Titre SEO" },
    { key: "seoDescription" as const, label: "Description SEO" },
    { key: "seoKeywords" as const, label: "Mots-clés SEO" },
  ];


  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles");
        const data: Article[] = await response.json();
        const formattedArticles = data.map(article => ({
          ...article,
          createdAtFormatted: new Date(article.createdAt).toLocaleDateString("fr-FR"),
        }));

        setArticles(formattedArticles);
      } catch (error) {
        console.error("Erreur lors du fetch des articles :", error);
      }
    };

    void fetchArticles();
  }, []);


  const handleSave = async (form: Record<string, string>) => {
    const isEditing = Boolean(editingArticle);
    const url = isEditing ? `/api/articles/${editingArticle!.id}` : "/api/articles";
    const method = isEditing ? "PUT" : "POST";
    const preparedForm = {
      ...form,
      seoKeywords: form.seoKeywords?.split(",").map((kw) => kw.trim()) ?? [],
    };

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preparedForm),
    });

    if (!response.ok) return;

    const article = await response.json();

    setArticles((prev) =>
      isEditing ? prev.map((a) => (a.id === article.id ? article : a)) : [article, ...prev]
    );

    setModalOpen(false);
    setEditingArticle(null);
  };

  const handleDelete = async (article: Article) => {
    const response = await fetch(`/api/articles/${article.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setArticles((prev) => prev.filter((a) => a.id !== article.id));
    }
  };

  const openCreateModal = () => {
    setEditingArticle(null);
    setModalOpen(true);
  };

  const openEditModal = (article: Article) => {
    setEditingArticle(article);
    setModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Articles</CardTitle>
          <Button className="h-12 w-12 rounded-full font-bold text-xl" onClick={openCreateModal}>+</Button>
        </CardHeader>
        <CardContent>
          <GenericTable
            data={articles}
            columns={columns}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <ModalForm
        title={editingArticle ? "Modifier l'article" : "Créer un article"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        fields={fields}
        uploadType="article"
        initialData={
          editingArticle
            ? {
              title: editingArticle.title,
              description: editingArticle.description,
              content: editingArticle.content,
              image: editingArticle.imageUrl ?? "",
              seoTitle: editingArticle.seoTitle,
              seoDescription: editingArticle.seoDescription,
              seoKeywords: editingArticle.seoKeywords?.join(", ") ?? "",
            }
            : undefined
        }

      />
    </div>
  );
}
