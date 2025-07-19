import { Permission, RoleType } from '@prisma/client';
import { prisma } from '@/lib/prisma';

async function main() {
  console.log('Start seeding ...');

  await seedRoles();
  await seedPermissions();
  await seedCategories();

  console.log('Seeding finished.');
}

async function seedRoles() {
  console.log('Seeding roles...');
  const roles = Object.values(RoleType).map((role) => ({ roleType: role }));
  await prisma.userRole.createMany({
    data: roles,
    skipDuplicates: true,
  });
  console.log('Roles seeded.');
}

async function seedPermissions() {
  console.log('Seeding permissions...');
  const rolePermissions: Record<RoleType, Permission[]> = {
    ADMIN: Object.values(Permission),
    OWNER: Object.values(Permission).filter((p) => p !== 'MANAGE_USERS'),
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
      const existingPermissions = await prisma.permissionOnRole.findMany({
        where: { roleId: role.id },
      });
      const existingPermissionTypes = new Set(existingPermissions.map((p) => p.permission));
      const newPermissions = permissions.filter((p) => !existingPermissionTypes.has(p));

      if (newPermissions.length) {
        await prisma.permissionOnRole.createMany({
          data: newPermissions.map((permission) => ({
            permission,
            roleId: role.id,
          })),
        });
      }
    }
  }
  console.log('Permissions seeded.');
}

async function seedCategories() {
  console.log('Seeding categories...');
  const categories = [
    { name: 'Office' },
    { name: 'Software' },
    { name: 'Travel' },
    { name: 'Food' },
    { name: 'Utilities' },
  ];
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });
  console.log('Categories seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
