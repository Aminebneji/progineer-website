"use client";

import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { GenericTable } from "@/components/common/genericTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModalForm } from "@/components/common/modalForm";
import { FieldType } from "@/types/formTypes";

type UserWithFormatted = User & { createdAtFormatted: string };

export default function UsersAdmin() {
    const [users, setUsers] = useState<UserWithFormatted[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const fields = [
        { name: "name", label: "Nom", type: FieldType.Text },
        { name: "email", label: "Email", type: FieldType.Text },
        { name: "telephone", label: "Téléphone", type: FieldType.Text },
        {
            name: "role",
            label: "Rôle",
            type: FieldType.Select,
            options: [
                { label: "Utilisateur", value: "USER" },
                { label: "Admin", value: "ADMIN" },
            ],
        },
        { name: "password", label: "Mot de passe", type: FieldType.Password },
    ];

    const columns = [
        { key: "name" as const, label: "Nom" },
        { key: "email" as const, label: "Email" },
        { key: "telephone" as const, label: "Téléphone" },
        { key: "role" as const, label: "Rôle" },
        { key: "createdAtFormatted" as const, label: "Créé le" },
    ];

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch("/api/users");
            const data = await res.json();
            const formatted = data.map((user: User) => ({
                ...user,
                createdAtFormatted: new Date(user.createdAt).toLocaleDateString("fr-FR"),
            }));
            setUsers(formatted);
        };

        void fetchUsers();
    }, []);

    const handleSave = async (form: Record<string, string>) => {
        setFormError(null);

        const isEditing = Boolean(editingUser);
        const url = isEditing ? `/api/users/${editingUser!.id}` : "/api/users";
        const method = isEditing ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (!res.ok) {
            const data = await res.json();
            setFormError(data.error ?? "Une erreur s'est produite.");
            return;
        }

        const user = await res.json();

        setUsers((prev) =>
            isEditing
                ? prev.map((u) => (u.id === user.id ? { ...user, createdAtFormatted: u.createdAtFormatted } : u))
                : [{ ...user, createdAtFormatted: new Date(user.createdAt).toLocaleDateString("fr-FR") }, ...prev]
        );

        setModalOpen(false);
        setEditingUser(null);
    };


    const handleDelete = async (user: User) => {
        const res = await fetch(`/api/users/${user.id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            setUsers((prev) => prev.filter((u) => u.id !== user.id));
        }
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                    <GenericTable
                        data={users}
                        columns={columns}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            <ModalForm
                title="Modifier l'utilisateur"
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                fields={fields}
                uploadType="user"
                initialData={
                    editingUser
                        ? {
                            name: editingUser.name ?? "",
                            email: editingUser.email,
                            telephone: editingUser.telephone ?? "",
                            role: editingUser.role,
                        }
                        : undefined
                }
            />
            {formError && (
                <p className="text-red-500 text-sm mb-2">{formError}</p>
            )}
        </div>
    );
}
