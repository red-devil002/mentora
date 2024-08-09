'use client'

import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, Form, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { formdescriptionSchema } from "@/helpers/FormDescriptionSchema.z";
import { chapterdescriptionSchema } from "@/helpers/helpers[chapter]/ChapterDescriptionSchema.z";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ChapterDescriptionFormProps {
    initialData: Chapter;
    courseId: String;
    chapterId: String;
}

export const ChapterDescriptionForm = ({
    initialData, 
    courseId,
    chapterId,
}: ChapterDescriptionFormProps) => {

    const [isEditing, setIsEditing] = useState(false)
    const toggleEdit = () => setIsEditing((current) => !current)
    const router = useRouter()

    const form = useForm<z.infer<typeof chapterdescriptionSchema>>({
        resolver: zodResolver(chapterdescriptionSchema),
        defaultValues: {
            description: initialData?.description || ""
        },
    })

    const {isSubmitting, isValid} = form.formState

    const onSubmit = async (values: z.infer<typeof chapterdescriptionSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Chapter updated")
            toggleEdit();
            router.refresh();
        } catch{
            toast.error("Something went wrong")
        }
        
    }
    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-2">
            <div className="font-medium flex items-center justify-between">
                Chapter description
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit description
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.description && "text-slate-500 italic"
                )}>
                    {!initialData.description && "No description"}
                    {initialData.description && (
                        <Preview 
                            value={initialData.description}
                        />
                    )}
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField 
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Editor 
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button 
                                disabled={!isValid || isSubmitting}
                                type = "submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}