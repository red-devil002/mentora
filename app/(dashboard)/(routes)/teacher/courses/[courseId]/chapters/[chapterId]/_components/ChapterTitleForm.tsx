'use client'

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, Form, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/helpers/FormSchema.z";
import { chapterformSchema } from "@/helpers/helpers[chapter]/ChapterFormSchema.z";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ChapterTitleFormProps {
    initialData: {
        title: string;
    };
    courseId: String;
    chapterId: String;
}

export const ChapterTitleForm = ({
    initialData,
    courseId, 
    chapterId
}: ChapterTitleFormProps) => {

    const [isEditing, setIsEditing] = useState(false)
    const toggleEdit = () => setIsEditing((current) => !current)
    const router = useRouter()

    const form = useForm<z.infer<typeof chapterformSchema>>({
        resolver: zodResolver(chapterformSchema),
        defaultValues: initialData,
    })

    const {isSubmitting, isValid} = form.formState

    const onSubmit = async (values: z.infer<typeof chapterformSchema>) => {
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
                Chapter title
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit title
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2 font-extrabold">
                    {initialData.title}
                </p>
            )}
            {isEditing && (
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
                                            placeholder="Introduction Chapter"
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