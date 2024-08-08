'use client'

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, Form, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formchapterSchema } from "@/helpers/FormChapterSchema.z";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter, Course } from "@prisma/client";
import axios from "axios";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { ChaptersList } from "./ChaptersList";

interface ChapterFormProps {
    initialData: Course & {chapters: Chapter[]};
    courseId: String;
}

export const ChapterForm = ({
    initialData, 
    courseId
}: ChapterFormProps) => {

    const [isCreating, setIsCreating] = useState(false) 
    const [isUpdating, setisUpdating] = useState(false)
    const toggleCreating = () => {
        setIsCreating((current) => !current)
    }
    const router = useRouter()

    const form = useForm<z.infer<typeof formchapterSchema>>({
        resolver: zodResolver(formchapterSchema),
        defaultValues: {
            title: ""
        },
    })

    const {isSubmitting, isValid} = form.formState

    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
            setisUpdating(true)

            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData
            })
            toast.success("Chapters reordered")
            router.refresh();
        } catch {
            toast.error("Something went wrong")
        } finally{
            setisUpdating(false)
        }
    }

    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`);
    }

    const onSubmit = async (values: z.infer<typeof formchapterSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values)
            toast.success("Chapter created")
            toggleCreating();
            router.refresh();
        } catch{
            toast.error("Something went wrong")
        }
        
    }
    return(
        <div className="relative mt-6 border bg-slate-100 rounded-md p-2">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
                    <Loader2 
                        className="animate-spin h-6 w-6 text-sky-700"
                    />
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Course chapters
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Edit chapters
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4" 
                    >
                        <FormField 
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input 
                                            disabled={isSubmitting}
                                            placeholder="chapters"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                            <Button 
                                disabled={!isValid || isSubmitting}
                                type = "submit"
                            >
                                Create
                            </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.chapters.length && "text-slate-500 italic"
                )}>
                    {!initialData.chapters.length && "No chapters"} 
                    {/* todo add a chapter */}
                    <ChaptersList 
                        onEdit = {onEdit}
                        onReorder = {onReorder}
                        items = {initialData.chapters || []}
                    />
                </div>
            )}
            {!isCreating && (
                <div className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the chapters
                </div>
            )}
        </div>
    )
}