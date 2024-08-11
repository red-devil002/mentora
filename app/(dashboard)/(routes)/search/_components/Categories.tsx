'use client'

import { Category } from "@prisma/client"
import { IconType } from "react-icons"
import {
    FcMusic,
    FcMultipleDevices,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcSportsMode,
    FcFilmReel,
    FcEngineering,
    FcBiotech,
    FcDataEncryption,
} from "react-icons/fc"
import { CategoryItem } from "./CategoryItem";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Music" : FcMusic,
    "Photography" : FcOldTimeCamera,
    "Fitness" : FcSportsMode,
    "Accounting" : FcSalesPerformance,
    "Computer Science" : FcMultipleDevices,
    "Filming" : FcFilmReel,
    "Engineering" : FcEngineering,
    "AI and ML" : FcDataEncryption,
    "Medical" : FcBiotech,
}

export const Categories = ({
    items,
}: CategoriesProps) => {
    return(
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item) => (
                <CategoryItem 
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    )
}