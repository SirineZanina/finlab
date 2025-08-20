import { Permission, RoleType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { encryptId } from '@/lib/utils';

async function main() {
  console.log('Start seeding ...');

  await seedRoles();
  await seedPermissions();
  await seedTransactions();
  await seedCurrencies();

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

export async function seedBanks() {
  console.log('Seeding banks...');

  const banks = [
    { name: 'Bank of America', code: 'BOA'},
    { name: 'Chase Bank', code: 'CHASE' },
    { name: 'Wells Fargo', code: 'WELLS' },
    { name: 'Citibank', code: 'CITI' },
    { name: 'PNC Bank', code: 'PNC' },
  ];

  await prisma.bank.createMany({
    data: banks,
    skipDuplicates: true,
  });

  console.log(`✅ Successfully seeded ${banks.length} banks`);
}

async function seedTransactions() {
  console.log('Seeding transactions...');
  const user = await prisma.user.findUnique({
    where: { email: 'testfinlab112@gmail.com' },
    include: { business: true }
  });

  if (!user) {
    throw new Error('User testfinlab112@gmail.com not found!');
  }

  console.log(`Found user: ${user.firstName} ${user.lastName}`);
  console.log(`Business: ${user.business.name}`);

  const businessId = user.businessId;

  // Get or create an account for this business
  let account = await prisma.account.findFirst({
    where: { businessId: businessId }
  });

  const bank = await prisma.bank.findFirst({
    where: { code: 'BOA' }
  });

  if (!bank) {
    throw new Error('Bank BOA not found! Please seed banks first.');
  }

  const defaultCurrency = await getDefaultCurrency();

  if (!defaultCurrency) {
    throw new Error('Default currency USD not found! Please seed currencies first.');
  }

  if (!account) {
    account = await prisma.account.create({
      data: {
        name: 'Main Account',
        businessId: businessId,
        currencyId: defaultCurrency.id,
        bankId: bank.id,
        shareableId: encryptId('Main Account')
      }
    });
    console.log('✅ Created new account: Main Account');
  } else {
    console.log(`Using existing account: ${account.name}`);
  }

  // Get or create income category
  let incomeCategory = await prisma.category.findFirst({
    where: {
      businessId: businessId,
      name: { contains: 'Income', mode: 'insensitive' }
    }
  });

  if (!incomeCategory) {
    incomeCategory = await prisma.category.create({
      data: {
        name: 'Income',
        businessId: businessId
      }
    });
    console.log('✅ Created Income category');
  }

  // Get or create expense categories
  let rentCategory = await prisma.category.findFirst({
    where: {
      businessId: businessId,
      name: { contains: 'Rent', mode: 'insensitive' }
    }
  });

  if (!rentCategory) {
    rentCategory = await prisma.category.create({
      data: {
        name: 'Rent',
        businessId: businessId
      }
    });
    console.log('✅ Created Rent category');
  }

  let groceriesCategory = await prisma.category.findFirst({
    where: {
      businessId: businessId,
      name: { contains: 'Groceries', mode: 'insensitive' }
    }
  });

  if (!groceriesCategory) {
    groceriesCategory = await prisma.category.create({
      data: {
        name: 'Groceries',
        businessId: businessId
      }
    });
    console.log('✅ Created Groceries category');
  }

  let utilitiesCategory = await prisma.category.findFirst({
    where: {
      businessId: businessId,
      name: { contains: 'Utilities', mode: 'insensitive' }
    }
  });

  if (!utilitiesCategory) {
    utilitiesCategory = await prisma.category.create({
      data: {
        name: 'Utilities',
        businessId: businessId
      }
    });
    console.log('✅ Created Utilities category');
  }

  const seedTransactions = [
    // ===== PREVIOUS PERIOD (60-31 days ago) =====
    // Previous Period Income: $1,000 total
    {
      name: 'Previous Salary Payment',
      amount: 500000, // $500.00 in milliunits
      payee: 'Company ABC',
      date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      accountId: account.id,
      categoryId: incomeCategory.id,
    },
    {
      name: 'Previous Freelance Project',
      amount: 300000, // $300.00 in milliunits
      payee: 'Client XYZ',
      date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
      accountId: account.id,
      categoryId: incomeCategory.id,
    },
    {
      name: 'Previous Bonus',
      amount: 200000, // $200.00 in milliunits
      payee: 'Company ABC',
      date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
      accountId: account.id,
      categoryId: incomeCategory.id,
    },

    // Previous Period Expenses: $400 total
    {
      name: 'Previous Month Rent',
      amount: -200000, // -$200.00 in milliunits
      payee: 'Landlord Properties',
      date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000), // 42 days ago
      accountId: account.id,
      categoryId: rentCategory.id,
    },
    {
      name: 'Previous Grocery Shopping',
      amount: -100000, // -$100.00 in milliunits
      payee: 'SuperMarket',
      date: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000), // 38 days ago
      accountId: account.id,
      categoryId: groceriesCategory.id,
    },
    {
      name: 'Previous Utilities Bill',
      amount: -100000, // -$100.00 in milliunits
      payee: 'City Utilities',
      date: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000), // 33 days ago
      accountId: account.id,
      categoryId: utilitiesCategory.id,
    },
    // Previous Remaining: $1,000 - $400 = $600

    // ===== CURRENT PERIOD (last 30 days) =====
    // Current Period Income: $1,500 total
    {
      name: 'Current Salary Payment',
      amount: 800000, // $800.00 in milliunits
      payee: 'Company ABC',
      date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
      accountId: account.id,
      categoryId: incomeCategory.id,
    },
    {
      name: 'Current Freelance Project',
      amount: 400000, // $400.00 in milliunits
      payee: 'Client XYZ',
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      accountId: account.id,
      categoryId: incomeCategory.id,
    },
    {
      name: 'Current Performance Bonus',
      amount: 300000, // $300.00 in milliunits
      payee: 'Company ABC',
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      accountId: account.id,
      categoryId: incomeCategory.id,
    },

    // Current Period Expenses: $800 total
    {
      name: 'Current Month Rent',
      amount: -400000, // -$400.00 in milliunits
      payee: 'Landlord Properties',
      date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000), // 22 days ago
      accountId: account.id,
      categoryId: rentCategory.id,
    },
    {
      name: 'Current Grocery Shopping',
      amount: -200000, // -$200.00 in milliunits
      payee: 'SuperMarket',
      date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
      accountId: account.id,
      categoryId: groceriesCategory.id,
    },
    {
      name: 'Current Utilities Bill',
      amount: -200000, // -$200.00 in milliunits
      payee: 'City Utilities',
      date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
      accountId: account.id,
      categoryId: utilitiesCategory.id,
    }
    // Current Remaining: $1,500 - $800 = $700
  ];

  console.log('🌱 Seeding transactions...');

  // Create transactions
  for (const transaction of seedTransactions) {
    await prisma.transaction.create({
      data: transaction
    });
  }

  console.log(`✅ Created ${seedTransactions.length} transactions for ${user.email}`);
  console.log('📊 Expected API Results:');
  console.log('   Previous Period: $1,000 income, $400 expenses, $600 remaining');
  console.log('   Current Period:  $1,500 income, $800 expenses, $700 remaining');
  console.log('   Expected Changes:');
  console.log('   - Income Change:    50.00% ↑');
  console.log('   - Expenses Change: 100.00% ↑');
  console.log('   - Remaining Change: 16.67% ↑');
}

export async function seedCurrencies() {
  console.log('Starting currency seeding...');

  const CURRENCIES = [
  // Major World Currencies
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound Sterling', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },

    // Middle East & Africa
    { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت' },
    { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },

    // Other Popular Currencies
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
    { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  ];

  try {
    // Use createMany for better performance
    const result = await prisma.currency.createMany({
      data: CURRENCIES,
      skipDuplicates: true, // Skip if currency already exists (based on unique constraint)
    });

    console.log(`✅ Successfully seeded ${result.count} currencies`);

    // Optionally, get all currencies to verify
    const allCurrencies = await prisma.currency.findMany({
      orderBy: { code: 'asc' },
    });

    console.log(`Total currencies in database: ${allCurrencies.length}`);

    return allCurrencies;
  } catch (error) {
    console.error('❌ Error seeding currencies:', error);
    throw error;
  }
}

// Helper function to get currency by code
export async function getCurrencyByCode(code: string) {
  return await prisma.currency.findUnique({
    where: { code },
  });
}

// Helper function to get default currency (USD)
export async function getDefaultCurrency() {
  return await getCurrencyByCode('USD');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
