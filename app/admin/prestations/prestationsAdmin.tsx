"use client";

import { useEffect, useState } from "react";
import { Prestation } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { GenericTable } from "@/components/common/genericTable";
import { ModalForm } from "@/components/common/modalForm";
import { FieldType } from "@/types/formTypes";

type PrestationFormatted = Prestation & { createdAtFormatted: string };

export default function PrestationsAdmin() {
    const [prestations, setPrestations] = useState<PrestationFormatted[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPrestation, setEditingPrestation] =
        useState<Prestation | null>(null);

    const fields = [
        { name: "title", label: "Titre", type: FieldType.Text },
        { name: "slug", label: "Slug", type: FieldType.Text },
        { name: "categorie", label: "Catégorie", type: FieldType.Text },
        { name: "description", label: "Description", type: FieldType.Textarea },
        { name: "icon", label: "Icône", type: FieldType.Text },
        { name: "imageUrl", label: "Image", type: FieldType.Image },
        {
            name: "services",
            label: "Services (séparés par virgules)",
            type: FieldType.Textarea,
        },
        { name: "published", label: "Publié", type: FieldType.Checkbox },
        { name: "order", label: "Ordre", type: FieldType.Number },
        { name: "seoTitle", label: "Titre SEO", type: FieldType.Text },
        {
            name: "seoDescription",
            label: "Description SEO",
            type: FieldType.Textarea,
        },
        { name: "seoKeywords", label: "Mots-clés SEO", type: FieldType.Text },
    ];

    const columns: { key: keyof PrestationFormatted; label: string }[] = [
        { key: "title", label: "Titre" },
        { key: "categorie", label: "Catégorie" },
        { key: "slug", label: "Slug" },
        { key: "createdAtFormatted", label: "Créé le" },
        { key: "published", label: "Publié" },
        { key: "order", label: "Ordre" },
    ];

    useEffect(() => {
        async function fetchPrestations() {
            const res = await fetch("/api/prestations");
            const data: Prestation[] = await res.json();
            setPrestations(
                data.map((p) => ({
                    ...p,
                    createdAtFormatted: new Date(p.createdAt).toLocaleDateString("fr-FR"),
                }))
            );
        }
        void fetchPrestations();
    }, []);

    const handleSave = async (form: Record<string, string>) => {
        const isEditing = Boolean(editingPrestation);
        const url = isEditing
            ? `/api/prestations/${editingPrestation!.id}`
            : "/api/prestations";
        const method = isEditing ? "PUT" : "POST";

        const prepared = {
            ...form,
            services: form.services.split(",").map((s) => s.trim()),
            seoKeywords: form.seoKeywords.split(",").map((kw) => kw.trim()),
            published: form.published === "true",
            order: form.order ? Number(form.order) : undefined,
        };

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(prepared),
        });
        if (!res.ok) return;

        const p: Prestation = await res.json();
        const formatted: PrestationFormatted = {
            ...p,
            createdAtFormatted: new Date(p.createdAt).toLocaleDateString("fr-FR"),
        };

        setPrestations((prev) =>
            isEditing
                ? prev.map((x) => (x.id === formatted.id ? formatted : x))
                : [formatted, ...prev]
        );
        setModalOpen(false);
        setEditingPrestation(null);
    };

    const handleDelete = async (p: Prestation) => {
        const res = await fetch(`/api/prestations/${p.id}`, { method: "DELETE" });
        if (res.ok) {
            setPrestations((prev) => prev.filter((x) => x.id !== p.id));
        }
    };

    const initialFormData = editingPrestation
        ? {
            title: editingPrestation.title,
            slug: editingPrestation.slug,
            categorie: editingPrestation.categorie,
            description: editingPrestation.description,
            icon: editingPrestation.icon,
            imageUrl: editingPrestation.imageUrl ?? "",
            services: editingPrestation.services.join(", "),
            published: editingPrestation.published ? "true" : "false",
            order: editingPrestation.order?.toString() ?? "",
            seoTitle: editingPrestation.seoTitle,
            seoDescription: editingPrestation.seoDescription,
            seoKeywords: editingPrestation.seoKeywords.join(", "),
            seoImage: editingPrestation.seoImage ?? "",
        }
        : undefined;

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>Prestations</CardTitle>
                    <Button className="h-12 w-12 rounded-full font-bold text-xl" onClick={() => setModalOpen(true)}>+</Button>
                </CardHeader>
                <CardContent>
                    <GenericTable
                        data={prestations}
                        columns={columns as any}
                        onEdit={(p) => {
                            setEditingPrestation(p);
                            setModalOpen(true);
                        }}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            <ModalForm
                title={editingPrestation ? "Modifier la prestation" : "Créer une prestation"}
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingPrestation(null);
                }}
                onSave={handleSave}
                fields={fields}
                initialData={initialFormData}
                uploadType="prestation"
            />
        </div>
    );
}
