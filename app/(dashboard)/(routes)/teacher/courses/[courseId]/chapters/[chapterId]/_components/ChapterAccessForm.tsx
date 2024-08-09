'use client'

import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, Form, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { formdescriptionSchema } from "@/helpers/FormDescriptionSchema.z";
import { chapteraccessSchema } from "@/helpers/helpers[chapter]/ChapterAccessSchema.z";
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

interface ChapterAccessFormProps {
    initialData: Chapter;
    courseId: String;
    chapterId: String;
}

export const ChapterAccessForm = ({
    initialData, 
    courseId,
    chapterId,
}: ChapterAccessFormProps) => {

    const [isEditing, setIsEditing] = useState(false)
    const toggleEdit = () => setIsEditing((current) => !current)
    const router = useRouter()

    const form = useForm<z.infer<typeof chapteraccessSchema>>({
        resolver: zodResolver(chapteraccessSchema),
        defaultValues: {
            isFree: !!initialData.isFree
        },
    })

    const {isSubmitting, isValid} = form.formState

    const onSubmit = async (values: z.infer<typeof chapteraccessSchema>) => {
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
                Chapter access
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit access
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.isFree && "text-slate-500 italic"
                )}>
                    {initialData.isFree ? (
                        <>This chapter is free for preview.</>
                    ): (
                        <>This chapter is not free.</>
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
                            name="isFree"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormDescription>
                                            Check this box if you want the chapter free for preview.
                                        </FormDescription>
                                    </div>
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