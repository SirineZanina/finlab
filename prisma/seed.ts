import { Permission, RoleType, BusinessIndustry, Category, Account } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { convertAmountToMiliunits } from '@/lib/utils';
import { subMonths } from 'date-fns';

async function main() {
  console.log('Start seeding ...');

  await seedRoles();
  await seedPermissions();
  await seedTransactionsAccountsAndCategories();

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
    GUEST: [Permission.VIEW_TRANSACTIONS], // Assuming GUEST has no permissions
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

async function seedTransactionsAccountsAndCategories() {
  console.log('Seeding transactions, accounts, and categories for existing user...');

  // Find the existing user
  const existingUser = await prisma.user.findUnique({
    where: { email: 'testuser2@gmail.com' },
    include: {
      business: {
        include: {
          accounts: true,
          category: true,
        }
      }
    }
  });

  if (!existingUser) {
    console.error('User with email testuser2@gmail.com not found!');
    return;
  }

  if (!existingUser.business) {
    console.error('User does not have an associated business!');
    return;
  }

  console.log(`Found user: ${existingUser.firstName} ${existingUser.lastName} (${existingUser.email})`);
  console.log(`Business: ${existingUser.business.name}`);

  // Ensure the business has categories and accounts
  if (existingUser.business.category.length === 0) {
    await seedCategoriesForBusiness(existingUser.business.id);
  }

  if (existingUser.business.accounts.length === 0) {
    await seedAccountsForBusiness(existingUser.business.id, existingUser.id);
  }

  // Refresh business data with accounts and categories
  const businessWithData = await prisma.business.findUnique({
    where: { id: existingUser.business.id },
    include: {
      accounts: true,
      category: true,
    }
  });

  if (businessWithData) {
    await seedTransactionsForBusiness(businessWithData);
  }

  await printSeedingSummaryForUser(existingUser.email);
}

async function seedCategoriesForBusiness(businessId: string) {
  console.log('Creating categories for business...');

  const categoryData = [
    { name: 'Office Supplies', plaidId: 'plaid-office-supplies' },
    { name: 'Software & Technology', plaidId: 'plaid-software' },
    { name: 'Marketing & Advertising', plaidId: 'plaid-marketing' },
    { name: 'Travel & Transportation', plaidId: 'plaid-travel' },
    { name: 'Meals & Entertainment', plaidId: 'plaid-meals' },
    { name: 'Utilities', plaidId: 'plaid-utilities' },
    { name: 'Revenue', plaidId: 'plaid-revenue' },
    { name: 'Professional Services', plaidId: 'plaid-professional' },
    { name: 'Insurance', plaidId: 'plaid-insurance' },
    { name: 'Equipment & Supplies', plaidId: 'plaid-equipment' },
    { name: 'Rent & Facilities', plaidId: 'plaid-rent' },
    { name: 'Training & Development', plaidId: 'plaid-training' },
  ];

  for (const category of categoryData) {
    await prisma.category.upsert({
      where: {
        id: `${category.name.toLowerCase().replace(/\s+/g, '-')}-${businessId}`
      },
      update: {},
      create: {
        id: `${category.name.toLowerCase().replace(/\s+/g, '-')}-${businessId}`,
        name: category.name,
        plaidId: `${category.plaidId}-${businessId}`,
        businessId: businessId,
      },
    });
  }

  console.log('✅ Categories created for business');
}

async function seedAccountsForBusiness(businessId: string, userId: string) {
  console.log('Creating bank and accounts for business...');

  // Create a bank for the business
  const bank = await prisma.bank.upsert({
    where: { shareableId: `bank-${businessId}` },
    update: {},
    create: {
      userId: userId,
      businessId: businessId,
      plaidId: `plaid-bank-${businessId}`,
      plaidBankId: `plaid-bank-id-${businessId}`,
      accessToken: `access-token-${businessId}`,
      fundingSourceUrl: `https://api.dwolla.com/funding-sources/${businessId}`,
      shareableId: `bank-${businessId}`,
    },
  });

  // Create accounts for the business
  const accountTypes = [
    { name: 'Business Checking', suffix: 'checking' },
    { name: 'Business Savings', suffix: 'savings' },
    { name: 'Business Credit Card', suffix: 'credit' },
  ];

  for (const accountType of accountTypes) {
    await prisma.account.upsert({
      where: { plaidId: `${accountType.suffix}-${businessId}` },
      update: {},
      create: {
        name: accountType.name,
        businessId: businessId,
        bankId: bank.id,
        plaidId: `${accountType.suffix}-${businessId}`,
      },
    });
  }

  console.log('✅ Bank and accounts created for business');
}

async function seedTransactionsForBusiness(business: any) {
  console.log('Seeding transactions for business...');

  if (business.accounts.length === 0 || business.category.length === 0) {
    console.log(`Skipping ${business.name} - no accounts or categories`);
    return;
  }

  const transactionTemplates = getTransactionTemplates(business);

  // Generate transactions for the last 6 months
  const transactions = [];
  const startDate = subMonths(new Date(), 6);
  const endDate = new Date();

  // Generate 2-3 transactions per day on average
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const targetTransactions = Math.floor(totalDays * 2.5); // 2.5 per day average

  for (let i = 0; i < targetTransactions; i++) {
    const template = transactionTemplates[Math.floor(Math.random() * transactionTemplates.length)];
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

    // Add some variation to amounts (±25%)
    const variation = 0.75 + Math.random() * 0.5; // 0.75 to 1.25
    const finalAmount = Math.round(template.amount * variation);

    transactions.push({
      ...template,
      amount: convertAmountToMiliunits(finalAmount), // Convert to miliunits using your util
      date: randomDate,
      paymentChannel: finalAmount > 0 ? 'ach' : (Math.random() > 0.5 ? 'card' : 'online'),
      pending: Math.random() < 0.05, // 5% chance of being pending
      notes: Math.random() < 0.2 ? 'Generated seed data' : null,
    });
  }

  // Sort by date
  transactions.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Create in batches
  const batchSize = 50;
  let createdCount = 0;

  for (let i = 0; i < transactions.length; i += batchSize) {
    const batch = transactions.slice(i, i + batchSize);

    const batchWithUniqueTimestamps = batch.map((transaction, index) => ({
      ...transaction,
      createdAt: new Date(Date.now() + (i + index) * 5),
      updatedAt: new Date(Date.now() + (i + index) * 5),
    }));

    try {
      const result = await prisma.transaction.createMany({
        data: batchWithUniqueTimestamps,
        skipDuplicates: true,
      });
      createdCount += result.count;
    } catch (error) {
      console.error(`Error creating batch for ${business.name}:`, error);
    }
  }

  console.log(`✅ Created ${createdCount} transactions for: ${business.name}`);
}

function getTransactionTemplates(business: any) {
  const accounts = business.accounts;
  const categories = business.category;

  // Helper functions to find categories and accounts
  const findCategory = (name: string) => categories.find((c: Category)=> c.name.includes(name));
  const findAccount = (type: 'checking' | 'savings' | 'credit') => accounts.find((a: Account) => a.plaidId?.includes(type));

  const checkingAccount = findAccount('checking');
  const creditAccount = findAccount('credit');

  const revenueCategory = findCategory('Revenue');
  const softwareCategory = findCategory('Software');
  const marketingCategory = findCategory('Marketing');
  const travelCategory = findCategory('Travel');
  const mealsCategory = findCategory('Meals');
  const utilitiesCategory = findCategory('Utilities');
  const professionalCategory = findCategory('Professional');
  const officeCategory = findCategory('Office');
  const insuranceCategory = findCategory('Insurance');
  const equipmentCategory = findCategory('Equipment');

  return [
    // Revenue transactions (positive)
    { name: 'Client Payment - Monthly Retainer', payee: 'ABC Corporation', amount: 15000, categoryId: revenueCategory?.id, accountId: checkingAccount?.id },
    { name: 'Project Payment', payee: 'XYZ Industries', amount: 25000, categoryId: revenueCategory?.id, accountId: checkingAccount?.id },
    { name: 'Consulting Services', payee: 'Tech Solutions Inc', amount: 8500, categoryId: revenueCategory?.id, accountId: checkingAccount?.id },
    { name: 'Software License Sales', payee: 'Enterprise Client', amount: 12000, categoryId: revenueCategory?.id, accountId: checkingAccount?.id },

    // Expenses (negative)
    { name: 'SaaS Subscription', payee: 'Software Provider', amount: -299, categoryId: softwareCategory?.id, accountId: creditAccount?.id },
    { name: 'Cloud Services', payee: 'AWS', amount: -850, categoryId: softwareCategory?.id, accountId: checkingAccount?.id },
    { name: 'Adobe Creative Suite', payee: 'Adobe', amount: -79, categoryId: softwareCategory?.id, accountId: creditAccount?.id },

    { name: 'Google Ads', payee: 'Google', amount: -1200, categoryId: marketingCategory?.id, accountId: creditAccount?.id },
    { name: 'Social Media Advertising', payee: 'Meta', amount: -800, categoryId: marketingCategory?.id, accountId: creditAccount?.id },

    { name: 'Business Flight', payee: 'Airlines', amount: -650, categoryId: travelCategory?.id, accountId: creditAccount?.id },
    { name: 'Hotel Stay', payee: 'Hotel Chain', amount: -280, categoryId: travelCategory?.id, accountId: creditAccount?.id },
    { name: 'Ground Transportation', payee: 'Uber', amount: -45, categoryId: travelCategory?.id, accountId: creditAccount?.id },

    { name: 'Team Lunch', payee: 'Restaurant', amount: -120, categoryId: mealsCategory?.id, accountId: creditAccount?.id },
    { name: 'Client Dinner', payee: 'Fine Dining', amount: -280, categoryId: mealsCategory?.id, accountId: creditAccount?.id },

    { name: 'Internet Service', payee: 'ISP Provider', amount: -180, categoryId: utilitiesCategory?.id, accountId: checkingAccount?.id },
    { name: 'Electricity', payee: 'Power Company', amount: -240, categoryId: utilitiesCategory?.id, accountId: checkingAccount?.id },
    { name: 'Phone Service', payee: 'Telecom', amount: -95, categoryId: utilitiesCategory?.id, accountId: checkingAccount?.id },

    { name: 'Legal Services', payee: 'Law Firm', amount: -1500, categoryId: professionalCategory?.id, accountId: checkingAccount?.id },
    { name: 'Accounting Services', payee: 'CPA Firm', amount: -600, categoryId: professionalCategory?.id, accountId: checkingAccount?.id },

    { name: 'Office Supplies', payee: 'Staples', amount: -85, categoryId: officeCategory?.id, accountId: creditAccount?.id },
    { name: 'Printer Paper', payee: 'Office Depot', amount: -45, categoryId: officeCategory?.id, accountId: creditAccount?.id },

    { name: 'Business Insurance', payee: 'Insurance Co', amount: -450, categoryId: insuranceCategory?.id, accountId: checkingAccount?.id },
    { name: 'Equipment Purchase', payee: 'Tech Retailer', amount: -1200, categoryId: equipmentCategory?.id, accountId: creditAccount?.id },
  ].filter(t => t.categoryId && t.accountId); // Only include transactions with valid category and account
}

async function printSeedingSummaryForUser(userEmail: string) {
  console.log('\n SEEDING SUMMARY FOR USER');
  console.log('==========================================');

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      business: {
        include: {
          _count: {
            select: {
              user: true,
              accounts: true,
              category: true,
            }
          }
        }
      }
    }
  });

  if (!user || !user.business) return;

  const business = user.business;

  const transactionCount = await prisma.transaction.count({
    where: { account: { businessId: business.id } }
  });

  const revenue = await prisma.transaction.aggregate({
    where: {
      account: { businessId: business.id },
      amount: { gt: 0 }
    },
    _sum: { amount: true }
  });

  const expenses = await prisma.transaction.aggregate({
    where: {
      account: { businessId: business.id },
      amount: { lt: 0 }
    },
    _sum: { amount: true }
  });

  const totalRevenue = revenue._sum.amount || 0;
  const totalExpenses = Math.abs(expenses._sum.amount || 0);
  const netIncome = totalRevenue - totalExpenses;

  console.log(`\n User: ${user.firstName} ${user.lastName} (${user.email})`);
  console.log(`Business: ${business.name} (${business.industry})`);
  console.log(`Total Users: ${business._count.user}`);
  console.log(`Accounts: ${business._count.accounts}`);
  console.log(`Categories: ${business._count.category}`);
  console.log(`Transactions: ${transactionCount}`);
  console.log(`Revenue: $${(totalRevenue / 100000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  console.log(`Expenses: $${(totalExpenses / 100000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  console.log(`Net Income: $${(netIncome / 100000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  console.log('');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
