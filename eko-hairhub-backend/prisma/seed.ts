import { PrismaClient, UserRole, StylistStatus, BookingStatus, ServiceLocationType, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from backend root regardless of where ts-node is called from
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Use DIRECT_URL for seed — bypasses pooler which can timeout on scripts
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ No DATABASE_URL or DIRECT_URL found in .env');
  process.exit(1);
}

const hostPart = dbUrl.split('@')[1]?.split('/')[0] ?? 'unknown';
console.log(`🔌 Connecting to: ${hostPart}`);

const prisma = new PrismaClient({
  datasources: { db: { url: dbUrl } },
});

async function main() {
  console.log('🌱 Seeding Eko HairHub database...');

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ekohairhub.com' },
    update: {},
    create: {
      email: 'admin@ekohairhub.com',
      password: await bcrypt.hash('Admin@2024!', 12),
      fullName: 'Eko HairHub Admin',
      role: UserRole.ADMIN,
    },
  });
  console.log('✅ Admin user created');

  const customer1 = await prisma.user.upsert({
    where: { email: 'customer@demo.com' },
    update: {},
    create: {
      email: 'customer@demo.com',
      password: await bcrypt.hash('demo123', 12),
      fullName: 'Kemi Adeleke',
      phone: '+2348012345678',
      role: UserRole.CUSTOMER,
    },
  });

  await prisma.user.upsert({
    where: { email: 'tolu@demo.com' },
    update: {},
    create: {
      email: 'tolu@demo.com',
      password: await bcrypt.hash('demo123', 12),
      fullName: 'Tolu Babatunde',
      phone: '+2348098765432',
      role: UserRole.CUSTOMER,
    },
  });
  console.log('✅ Customer users created');

  const stylistUser1 = await prisma.user.upsert({
    where: { email: 'amaka@demo.com' },
    update: {},
    create: {
      email: 'amaka@demo.com',
      password: await bcrypt.hash('demo123', 12),
      fullName: 'Amaka Okonkwo',
      phone: '+2348023456789',
      role: UserRole.STYLIST,
    },
  });

  const stylistUser2 = await prisma.user.upsert({
    where: { email: 'tunde@demo.com' },
    update: {},
    create: {
      email: 'tunde@demo.com',
      password: await bcrypt.hash('demo123', 12),
      fullName: 'Tunde Adeyemi',
      phone: '+2348034567890',
      role: UserRole.STYLIST,
    },
  });

  await prisma.user.upsert({
    where: { email: 'chisom@demo.com' },
    update: {},
    create: {
      email: 'chisom@demo.com',
      password: await bcrypt.hash('demo123', 12),
      fullName: 'Chisom Eze',
      phone: '+2348045678901',
      role: UserRole.STYLIST,
    },
  });
  console.log('✅ Stylist users created');

  const profile1 = await prisma.stylistProfile.upsert({
    where: { userId: stylistUser1.id },
    update: {},
    create: {
      userId: stylistUser1.id,
      bio: 'Award-winning hair artist with 8 years of experience. Specializing in protective styles and natural hair care. Your hair is my canvas.',
      specialties: ['Braids', 'Natural Hair', 'Locs'],
      location: 'Victoria Island, Lagos',
      area: 'Victoria Island',
      status: StylistStatus.VERIFIED,
      offersHomeService: true,
      homeServiceFee: 3000,
      yearsExperience: 8,
      rating: 4.9,
      reviewCount: 247,
      availability: {
        create: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 5, startTime: '09:00', endTime: '16:00', isAvailable: true },
          { dayOfWeek: 6, startTime: '10:00', endTime: '14:00', isAvailable: true },
        ],
      },
      portfolioImages: {
        create: [
          { url: 'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=600&q=80', publicId: 'ekohair/p1', hairstyleName: 'Box Braids', order: 1 },
          { url: 'https://images.unsplash.com/photo-1601379760883-1bb497c558d1?w=600&q=80', publicId: 'ekohair/p2', hairstyleName: 'Knotless Braids', order: 2 },
          { url: 'https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?w=600&q=80', publicId: 'ekohair/p3', hairstyleName: 'Cornrows', order: 3 },
        ],
      },
      services: {
        create: [
          { name: 'Box Braids (Medium)', price: 15000, duration: 180, category: 'Braids' },
          { name: 'Knotless Braids', price: 22000, duration: 240, category: 'Braids' },
          { name: 'Cornrows (Simple)', price: 8000, duration: 90, category: 'Braids' },
          { name: 'Natural Hair Treatment', price: 12000, duration: 120, category: 'Natural' },
        ],
      },
    },
  });

  await prisma.stylistProfile.upsert({
    where: { userId: stylistUser2.id },
    update: {},
    create: {
      userId: stylistUser2.id,
      bio: 'Master barber trained in London. Bringing world-class precision cuts to Lagos. Every fade tells a story.',
      specialties: ['Barbering', 'Fade', 'Beard Grooming'],
      location: 'Lekki Phase 1, Lagos',
      area: 'Lekki',
      status: StylistStatus.VERIFIED,
      offersHomeService: false,
      yearsExperience: 10,
      rating: 4.8,
      reviewCount: 312,
      availability: {
        create: [
          { dayOfWeek: 2, startTime: '08:00', endTime: '19:00', isAvailable: true },
          { dayOfWeek: 3, startTime: '08:00', endTime: '19:00', isAvailable: true },
          { dayOfWeek: 4, startTime: '08:00', endTime: '19:00', isAvailable: true },
          { dayOfWeek: 5, startTime: '08:00', endTime: '19:00', isAvailable: true },
          { dayOfWeek: 6, startTime: '08:00', endTime: '19:00', isAvailable: true },
          { dayOfWeek: 0, startTime: '10:00', endTime: '16:00', isAvailable: true },
        ],
      },
      portfolioImages: {
        create: [
          { url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80', publicId: 'ekohair/p5', hairstyleName: 'Fade & Taper', order: 1 },
          { url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80', publicId: 'ekohair/p6', hairstyleName: 'Low Skin Fade', order: 2 },
        ],
      },
      services: {
        create: [
          { name: 'Haircut & Fade', price: 5000, duration: 45, category: 'Barbering' },
          { name: 'Skin Fade', price: 7000, duration: 60, category: 'Barbering' },
          { name: 'Beard Trim & Shape', price: 3000, duration: 30, category: 'Grooming' },
          { name: 'Full Groom Package', price: 12000, duration: 90, category: 'Barbering' },
        ],
      },
    },
  });
  console.log('✅ Stylist profiles created');

  const hairstyles = [
    { name: 'Box Braids', description: 'Classic protective style with square-shaped sections.', imageUrl: 'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=600&q=80', category: 'Braids', tags: ['protective', 'long-lasting', 'versatile'], popularityScore: 95 },
    { name: 'Knotless Braids', description: 'Feed-in braids that start naturally without a knot.', imageUrl: 'https://images.unsplash.com/photo-1601379760883-1bb497c558d1?w=600&q=80', category: 'Braids', tags: ['natural', 'protective', 'trendy'], popularityScore: 98 },
    { name: 'Locs / Dreadlocks', description: 'Natural locking of hair strands into rope-like sections.', imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80', category: 'Natural', tags: ['natural', 'cultural', 'low-maintenance'], popularityScore: 88 },
    { name: 'Cornrows', description: 'Rows of tight braids worked very close to the scalp.', imageUrl: 'https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?w=600&q=80', category: 'Braids', tags: ['scalp', 'neat', 'geometric'], popularityScore: 91 },
    { name: 'Afro', description: 'Natural round shape celebrating the full texture of natural hair.', imageUrl: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=600&q=80', category: 'Natural', tags: ['natural', 'bold', 'volume'], popularityScore: 87 },
    { name: 'Fade & Taper', description: 'Precision cut with graduating length from short to shorter.', imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80', category: 'Barbering', tags: ['precision', 'clean', 'masculine'], popularityScore: 96 },
    { name: 'Senegalese Twist', description: 'Rope-like twists using synthetic hair for an elegant look.', imageUrl: 'https://images.unsplash.com/photo-1499557354967-2b2d8910bcca?w=600&q=80', category: 'Braids', tags: ['elegant', 'protective', 'length'], popularityScore: 89 },
    { name: 'Goddess Locs', description: 'Distressed faux locs with loose wavy ends for a boho-chic aesthetic.', imageUrl: 'https://images.unsplash.com/photo-1570158268183-d296b2892211?w=600&q=80', category: 'Locs', tags: ['boho', 'feminine', 'protective'], popularityScore: 93 },
    { name: 'Crochet Braids', description: 'Hair extensions attached to cornrows using a crochet needle.', imageUrl: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600&q=80', category: 'Extensions', tags: ['versatile', 'protective', 'quick'], popularityScore: 86 },
    { name: 'Low Skin Fade', description: 'Ultra-clean fade starting from the skin at the bottom.', imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80', category: 'Barbering', tags: ['precision', 'premium', 'masculine'], popularityScore: 97 },
    { name: 'Ghana Braids', description: 'Feed-in braids that start small at the hairline and increase in size.', imageUrl: 'https://images.unsplash.com/photo-1590577976322-3d2d6e2130d5?w=600&q=80', category: 'Braids', tags: ['cultural', 'scalp', 'statement'], popularityScore: 90 },
    { name: 'TWA', description: 'Teeny Weeny Afro — short natural cut celebrating close-cropped texture.', imageUrl: 'https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=600&q=80', category: 'Natural', tags: ['short', 'bold', 'low-maintenance'], popularityScore: 82 },
  ];

  for (const style of hairstyles) {
    await prisma.hairstyle.upsert({
      where: { id: style.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: { id: style.name.toLowerCase().replace(/\s+/g, '-'), ...style },
    });
  }
  console.log('✅ Hairstyles seeded');

  const services = await prisma.service.findMany({ where: { stylistProfileId: profile1.id }, take: 1 });
  if (services.length > 0) {
    const existingBooking = await prisma.booking.findFirst({ where: { customerId: customer1.id } });
    if (!existingBooking) {
      await prisma.booking.create({
        data: {
          customerId: customer1.id,
          stylistProfileId: profile1.id,
          serviceId: services[0].id,
          status: BookingStatus.COMPLETED,
          locationType: ServiceLocationType.SALON,
          scheduledAt: new Date('2024-12-15T10:00:00Z'),
          totalAmount: services[0].price,
          completedAt: new Date('2024-12-15T13:00:00Z'),
          payment: {
            create: {
              amount: services[0].price,
              status: PaymentStatus.COMPLETED,
              reference: `EKO-DEMO-${Date.now()}`,
              currency: 'NGN',
              paidAt: new Date('2024-12-15T09:30:00Z'),
            },
          },
          review: {
            create: {
              customerId: customer1.id,
              stylistProfileId: profile1.id,
              rating: 5,
              comment: "Absolutely amazing! Best braids I've ever had. Professional, punctual, and stunning results!",
            },
          },
        },
      });
      console.log('✅ Demo booking created');
    }
  }

  console.log('\n🎉 Seeding complete!');
  console.log('\n📋 Demo Credentials:');
  console.log('  Admin:    admin@ekohairhub.com / Admin@2024!');
  console.log('  Customer: customer@demo.com / demo123');
  console.log('  Stylist:  amaka@demo.com / demo123');
}

main()
  .catch(e => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
