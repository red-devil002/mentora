const { PrismaClient } = require("@prisma/client")

const database = new PrismaClient();

async function main(){
    try {
        await database.category.createMany({
            data: [
                { name: "Computer Science"},
                { name: "Music"},
                { name: "Photography"},
                { name: "Accounting"},
                { name: "Engineering"},
                { name: "Filming"},
                { name: "Fitness"},
                { name: "Dancing"},
                { name: "Medical"},
                { name: "AI and ML"},
            ]
        })

        console.log("Success");
        
    } catch (error) {
        console.log("Error seeding the database categories", error);
        
    } finally{
        await database.$disconnect()
    }
}

main()