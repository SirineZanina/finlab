import { PrismaClient, Permission, RoleType, BusinessIndustry } from '@prisma/client';
import { BusinessIndustries } from '../types/businessIndustry';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Seed roles
  await seedRoles();

  // Seed permissions
  await seedPermissions();

  // Seed businesses
  await seedBusinesses();

  console.log('Seeding finished.');
}

async function seedRoles() {
  const roles = Object.values(RoleType).map((role) => ({ roleType: role }));
  await prisma.userRole.createMany({
    data: roles,
    skipDuplicates: true,
  });
  console.log('Roles seeded.');
}

async function seedPermissions() {
  const rolePermissions: Record<RoleType, Permission[]> = {
    OWNER: [
      Permission.VIEW_TRANSACTIONS,
      Permission.CREATE_TRANSACTIONS,
      Permission.EDIT_TRANSACTIONS,
      Permission.DELETE_TRANSACTIONS,
      Permission.EXPORT_REPORTS,
      Permission.MANAGE_USERS,
      Permission.MANAGE_BUDGETS,
    ],
    ACCOUNTANT: [
      Permission.VIEW_TRANSACTIONS,
      Permission.CREATE_TRANSACTIONS,
      Permission.EDIT_TRANSACTIONS,
      Permission.EXPORT_REPORTS,
    ],
    MEMBER: [Permission.VIEW_TRANSACTIONS],
  };

  const roles = await prisma.userRole.findMany();

  for (const role of roles) {
    const permissions = rolePermissions[role.roleType as RoleType] || [];

    if (permissions.length) {
      await prisma.permissionOnRole.createMany({
        data: permissions.map((permission) => ({
          permission,
          roleId: role.id,
        })),
        skipDuplicates: true, // Just in case there's accidental overlap
      });
    }
  }

  console.log('Permissions seeded using createMany.');
}

async function seedBusinesses() {
  console.log('Seeding businesses...');
  const businesses = BusinessIndustries.map((industry) => {
    const formattedIndustry =
      industry.charAt(0).toUpperCase() +
      industry.slice(1).toLowerCase().replace(/_/g, ' ');
    return {
      name: `${formattedIndustry} Business`,
      industry: industry as BusinessIndustry,
    };
  });

  await prisma.business.createMany({
    data: businesses,
    skipDuplicates: true,
  });
  console.log('Businesses seeded.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
