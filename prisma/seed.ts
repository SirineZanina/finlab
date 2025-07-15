import { PrismaClient, Permission, RoleType, BusinessIndustry, AccountType, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  await seedRoles();
  await seedPermissions();
  await seedBusinesses();
  await seedAccounts();
  await seedTransactions();

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
    OWNER: Object.values(Permission).filter(p => p !== 'MANAGE_USERS'),
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
      const existingPermissionTypes = new Set(existingPermissions.map(p => p.permission));
      const newPermissions = permissions.filter(p => !existingPermissionTypes.has(p));

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

async function seedBusinesses() {
  console.log('Seeding businesses...');
  const businessesData = [
    { name: 'Tech Solutions Inc.', industry: BusinessIndustry.TECHNOLOGY },
    { name: 'GreenLeaf Organics', industry: BusinessIndustry.RETAIL },
    { name: 'BuildRight Construction', industry: BusinessIndustry.MANUFACTURING },
    { name: 'HealWell Clinic', industry: BusinessIndustry.HEALTHCARE },
  ];

  for (const businessData of businessesData) {
    await prisma.business.upsert({
      where: { name: businessData.name },
      update: { industry: businessData.industry },
      create: businessData,
    });
  }
  console.log('Businesses seeded.');
}

async function seedAccounts() {
  console.log('Seeding accounts...');
  const businesses = await prisma.business.findMany();

  for (const business of businesses) {
    const accountsData = [
      { name: 'Main Checking Account', type: AccountType.BANK, balance: 15000.00, businessId: business.id },
      { name: 'Business Credit Card', type: AccountType.CREDIT, balance: -2500.50, businessId: business.id },
      { name: 'Petty Cash', type: AccountType.CASH, balance: 500.00, businessId: business.id },
    ];

    for (const accountData of accountsData) {
      await prisma.account.upsert({
        where: { name_businessId: { name: accountData.name, businessId: business.id } },
        update: { type: accountData.type, balance: accountData.balance },
        create: accountData,
      });
    }
  }
  console.log('Accounts seeded.');
}

async function seedTransactions() {
  console.log('Seeding transactions...');

  const seedDate = new Date('2025-07-14T10:00:00Z');

  const businesses = await prisma.business.findMany({ include: { accounts: true } });

  for (const business of businesses) {
    if (business.accounts.length > 0) {
      const transactionsData = [
        {
          description: 'Office Supplies',
          amount: 150.75,
          date: seedDate,
          type: TransactionType.EXPENSE,
          businessId: business.id,
          accountId: business.accounts[0].id,
        },
        {
          description: 'Software Subscription',
          amount: 49.99,
          date: seedDate,
          type: TransactionType.EXPENSE,
          businessId: business.id,
          accountId: business.accounts[1].id,
        },
        {
          description: 'Client Lunch',
          amount: 85.50,
          date: seedDate,
          type: TransactionType.EXPENSE,
          businessId: business.id,
          accountId: business.accounts[2].id,
        },
        {
          description: 'Internet Bill',
          amount: 99.00,
          date: seedDate,
          type: TransactionType.EXPENSE,
          businessId: business.id,
          accountId: business.accounts[0].id,
        },
      ];

      for (const tx of transactionsData) {
        await prisma.transaction.upsert({
          where: {
            transaction_unique: {
              description: tx.description,
              date: tx.date,
              accountId: tx.accountId,
              businessId: tx.businessId,
            },
          },
          update: {
            amount: tx.amount,
            type: tx.type,
          },
          create: tx,
        });
      }
    }
  }

  console.log('Transactions seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
