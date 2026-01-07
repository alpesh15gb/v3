import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Create Default Company
    const company = await prisma.company.upsert({
        where: { code: 'COMP01' },
        update: {},
        create: {
            name: 'Acme Corp',
            code: 'COMP01',
            address: '123 Business St'
        }
    });

    // 2. Create Default Branch
    const branch = await prisma.branch.upsert({
        where: { code: 'BR001' },
        update: {},
        create: {
            name: 'Headquarters',
            code: 'BR001',
            companyId: company.id
        }
    });

    // 3. Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.employee.upsert({
        where: { employeeCode: 'ADMIN' },
        update: {
            password: adminPassword,
            role: 'ADMIN' // Ensure role is updated if exists
        },
        create: {
            firstName: 'System',
            lastName: 'Admin',
            employeeCode: 'ADMIN',
            email: 'admin@example.com',
            phone: '1234567890',
            dateOfJoining: new Date(),
            password: adminPassword,
            role: 'ADMIN',
            companyId: company.id,
            branchId: branch.id
        }
    });

    console.log({ admin });
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
