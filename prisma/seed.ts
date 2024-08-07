import path from "path";
import fs from "fs/promises";
import { prisma } from "../src/app";
import bcrypt from "bcrypt";
import { Role } from ".prisma/client";

async function seed(dirPath: string, modelName: string) {
    const filePath = path.resolve(__dirname, dirPath);
    const data = await fs.readFile(filePath, 'utf-8');
    const items = JSON.parse(data);

    for (const item of items) {
        switch (modelName) {
            case "Category":
                await prisma.category.create({
                    data: item,
                });
                break;
            case "User":
                const password = await bcrypt.hash(item.password, 10);
                const role = Role[item.role as keyof typeof Role];
                await prisma.user.create({
                    data: {...item, password:password, role:role},
                });
                break;
            default:
                throw new Error(`Model ${modelName} not recognized`);
        }
    }
}

async function main() {
    try {
        await seed("categorySeed.json", "Category");
        // await seed("userSeed.json", "User");
        console.log("Seeded successfully.");
    } catch (error) {
        console.error("Error while seeding:", error);
    } finally {
        await prisma.$disconnect();
    }
}

export default main();
