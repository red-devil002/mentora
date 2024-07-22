'use client'

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, Form, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formpriceSchema } from "@/helpers/FormPriceSchema.z";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface PriceFormProps {
    initialData: Course;
    courseId: String;
}

export const PriceForm = ({
    initialData, 
    courseId
}: PriceFormProps) => {

    const [isEditing, setIsEditing] = useState(false)
    const toggleEdit = () => setIsEditing((current) => !current)
    const router = useRouter()

    const form = useForm<z.infer<typeof formpriceSchema>>({
        resolver: zodResolver(formpriceSchema),
        defaultValues: {
            price : initialData?.price || undefined,
        },
    })

    const {isSubmitting, isValid} = form.formState
    // console.log("Form isValid:", isValid);
    // console.log("Form isSubmitting:", isSubmitting);


    const onSubmit = async (values: z.infer<typeof formpriceSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course updated")
            toggleEdit();
            router.refresh();
        } catch{
            toast.error("Something went wrong")
        }
        
    }
    return(
        <div className="mt-6 border bg-slate-100 rounded-md p-2">
            <div className="font-medium flex items-center justify-between">
                Course price
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit price
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
               <p className={cn(
                    "text-sm mt-2",
                    !initialData.price && "text-slate-500 italic"
                )}>
                    {initialData.price ? formatPrice(initialData.price) : "No price"}
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
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input 
                                            disabled={isSubmitting}
                                            type="number"
                                            step="0.01"
                                            placeholder="set price for your course"
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