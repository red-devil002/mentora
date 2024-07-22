'use client'

import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { formattachmentSchema } from "@/helpers/FormAttachmentsSchema.z";
import { formimageSchema } from "@/helpers/FormImageSchema.z";
import { Attachment, Course } from "@prisma/client";
import axios from "axios";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: String;
}

export const AttachmentForm = ({
    initialData, 
    courseId
}: AttachmentFormProps) => {

    const [isEditing, setIsEditing] = useState(false)
    const toggleEdit = () => setIsEditing((current) => !current)
    const router = useRouter()
    const [deletingId,  setDeletingId] = useState<string | null>(null);

    const onSubmit = async (values: z.infer<typeof formattachmentSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values)
            toast.success("Course updated")
            toggleEdit();
            router.refresh();
        } catch{
            toast.error("Something went wrong")
        }
        
    }

    const onDelete = async  (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment Deleted");
            router.refresh();
        } catch {
            toast.error("Something went wrong")
        }finally{
            setDeletingId(null);
        }
    }
    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-2">
            <div className="font-medium flex items-center justify-between">
                Course attachments
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )} 
                    {!isEditing && (
                        <>
                            <PlusCircle 
                                className="h-4 w-4 mr-2"
                            />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                    <>
                        {initialData.attachments.length === 0 && (
                            <p className="text-sm mt-2 text-slate-500 italic">
                                No attachments yet
                            </p>
                        )}
                        {initialData.attachments.length > 0 && (
                            <div className="space-y-2">
                                {initialData.attachments.map((attachment) => (
                                    <div 
                                        className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                        key={attachment.id}
                                    >
                                        <File 
                                            className="h-4 w-4 mr-2 flex-shrink-0"
                                        />
                                        <p className="text-xs line-clamp-1">
                                            {attachment.name}
                                        </p>
                                        {deletingId === attachment.id && (
                                            <div>
                                                <Loader2 
                                                    className="h-4 w-4 animate-spin"
                                                />
                                            </div>
                                        )}
                                        {deletingId !== attachment.id && (
                                                <Button 
                                                    onClick={() => onDelete(attachment.id)}
                                                    className="ml-auto hover:opacity-75 transition">
                                                    <X 
                                                        className="h-4 w-4"
                                                    />
                                                </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </> 
            )}
            {isEditing && (
                <div>
                    <FileUpload 
                        endpoint="courseAttachments"
                        onChange={(url) => {
                            if(url) {
                                onSubmit({ url: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add anything that students need to complete the course...!!!
                    </div>
                </div>
            )}
        </div>
    )
}