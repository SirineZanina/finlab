import { PrismaClient, Permission, RoleType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Seed roles
  await seedRoles();

  // Seed permissions
  await seedPermissions();

  console.log('Seeding finished.');
}

async function seedRoles() {
  const roles = Object.values(RoleType).map((role) => ({ roleType: role }));
  await prisma.userRole.createMany({
    data: roles,
    skipDuplicates: true,
  });
  console.log('✅ Roles seeded.');
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

  console.log('✅ Permissions seeded using createMany.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
