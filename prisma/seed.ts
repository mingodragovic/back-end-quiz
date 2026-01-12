// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
async function main() {
  console.log('🌱 Starting database seed...');
  console.log('================================');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  
  try {
    // Using TRUNCATE with CASCADE is more efficient
    await prisma.$executeRaw`TRUNCATE TABLE "Answer", "QuizAttempt", "OptionScore", "Option", "Question", "Personality" RESTART IDENTITY CASCADE`;
    console.log('✅ Existing data cleared');
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
    console.log('Trying fallback method...');
    
    // Fallback delete in correct order
    await prisma.answer.deleteMany();
    await prisma.quizAttempt.deleteMany();
    await prisma.optionScore.deleteMany();
    await prisma.option.deleteMany();
    await prisma.question.deleteMany();
    await prisma.personality.deleteMany();
    console.log('✅ Data cleared with fallback method');
  }

  // ============================================
  // 1. CREATE PERSONALITIES
  // ============================================
  console.log('\n👥 Creating personalities...');
  
  const personalities = await prisma.personality.createMany({
    data: [
      {
        name: 'The Adventurer',
        description: 'You thrive on new experiences and spontaneous decisions.',
      },
      {
        name: 'The Analyst',
        description: 'You value logic, data, and careful planning.',
      },
      {
        name: 'The Diplomat',
        description: 'You prioritize harmony, empathy, and relationships.',
      },
      {
        name: 'The Leader',
        description: 'You are decisive, confident, and goal-oriented.',
      },
    ],
  });

  // Get all personalities for reference
  const personalityRecords = await prisma.personality.findMany();
  const adventurer = personalityRecords.find(p => p.name === 'The Adventurer')!;
  const analyst = personalityRecords.find(p => p.name === 'The Analyst')!;
  const diplomat = personalityRecords.find(p => p.name === 'The Diplomat')!;
  const leader = personalityRecords.find(p => p.name === 'The Leader')!;

  console.log(`✅ Created 4 personalities`);

  // ============================================
  // 2. CREATE QUESTIONS
  // ============================================
  console.log('\n❓ Creating questions...');
  
  const questions = await prisma.question.createMany({
    data: [
      { text: 'When facing a new challenge, you:', weight: 1.5, order: 1 },
      { text: 'In group decisions, you usually:', weight: 1.2, order: 2 },
      { text: 'Your ideal weekend involves:', weight: 1.0, order: 3 },
      { text: 'When learning something new, you prefer:', weight: 1.3, order: 4 },
      { text: 'Your approach to problems is typically:', weight: 1.4, order: 5 },
    ],
  });

  const questionRecords = await prisma.question.findMany({ orderBy: { order: 'asc' } });

  // ============================================
  // 3. CREATE OPTIONS
  // ============================================
  console.log('\n📝 Creating options...');
  
  // Question 1 options
  const q1Options = await Promise.all([
    prisma.option.create({ data: { text: 'Jump right in', questionId: questionRecords[0].id } }),
    prisma.option.create({ data: { text: 'Research first', questionId: questionRecords[0].id } }),
    prisma.option.create({ data: { text: 'Ask for advice', questionId: questionRecords[0].id } }),
    prisma.option.create({ data: { text: 'Take charge', questionId: questionRecords[0].id } }),
  ]);

  // Question 2 options
  const q2Options = await Promise.all([
    prisma.option.create({ data: { text: 'Follow consensus', questionId: questionRecords[1].id } }),
    prisma.option.create({ data: { text: 'Analyze thoroughly', questionId: questionRecords[1].id } }),
    prisma.option.create({ data: { text: 'Listen to everyone', questionId: questionRecords[1].id } }),
    prisma.option.create({ data: { text: 'Push my solution', questionId: questionRecords[1].id } }),
  ]);

  // Question 3 options
  const q3Options = await Promise.all([
    prisma.option.create({ data: { text: 'Try new adventures', questionId: questionRecords[2].id } }),
    prisma.option.create({ data: { text: 'Read and learn', questionId: questionRecords[2].id } }),
    prisma.option.create({ data: { text: 'Time with friends', questionId: questionRecords[2].id } }),
    prisma.option.create({ data: { text: 'Plan and organize', questionId: questionRecords[2].id } }),
  ]);

  // Question 4 options
  const q4Options = await Promise.all([
    prisma.option.create({ data: { text: 'Hands-on practice', questionId: questionRecords[3].id } }),
    prisma.option.create({ data: { text: 'Follow instructions', questionId: questionRecords[3].id } }),
    prisma.option.create({ data: { text: 'Learn with others', questionId: questionRecords[3].id } }),
    prisma.option.create({ data: { text: 'Teach someone', questionId: questionRecords[3].id } }),
  ]);

  // Question 5 options
  const q5Options = await Promise.all([
    prisma.option.create({ data: { text: 'Be creative', questionId: questionRecords[4].id } }),
    prisma.option.create({ data: { text: 'Be logical', questionId: questionRecords[4].id } }),
    prisma.option.create({ data: { text: 'Be collaborative', questionId: questionRecords[4].id } }),
    prisma.option.create({ data: { text: 'Be direct', questionId: questionRecords[4].id } }),
  ]);

  const allOptions = [...q1Options, ...q2Options, ...q3Options, ...q4Options, ...q5Options];
  console.log(`✅ Created ${allOptions.length} options`);

  // ============================================
  // 4. CREATE OPTION SCORES (Simplified)
  // ============================================
  console.log('\n🎯 Creating scoring rules...');

  // Create option scores in batches
  const optionScoresData = [
    // Question 1 scores
    { optionId: q1Options[0].id, personalityId: adventurer.id, points: 10 },
    { optionId: q1Options[0].id, personalityId: analyst.id, points: 1 },
    { optionId: q1Options[0].id, personalityId: diplomat.id, points: 2 },
    { optionId: q1Options[0].id, personalityId: leader.id, points: 3 },

    { optionId: q1Options[1].id, personalityId: analyst.id, points: 10 },
    { optionId: q1Options[1].id, personalityId: adventurer.id, points: 2 },
    { optionId: q1Options[1].id, personalityId: diplomat.id, points: 3 },
    { optionId: q1Options[1].id, personalityId: leader.id, points: 4 },

    { optionId: q1Options[2].id, personalityId: diplomat.id, points: 10 },
    { optionId: q1Options[2].id, personalityId: analyst.id, points: 4 },
    { optionId: q1Options[2].id, personalityId: adventurer.id, points: 2 },
    { optionId: q1Options[2].id, personalityId: leader.id, points: 3 },

    { optionId: q1Options[3].id, personalityId: leader.id, points: 10 },
    { optionId: q1Options[3].id, personalityId: analyst.id, points: 4 },
    { optionId: q1Options[3].id, personalityId: diplomat.id, points: 3 },
    { optionId: q1Options[3].id, personalityId: adventurer.id, points: 2 },

    // Question 2 scores (similar pattern, simplified)
    { optionId: q2Options[0].id, personalityId: diplomat.id, points: 9 },
    { optionId: q2Options[1].id, personalityId: analyst.id, points: 10 },
    { optionId: q2Options[2].id, personalityId: diplomat.id, points: 8 },
    { optionId: q2Options[3].id, personalityId: leader.id, points: 10 },

    // Question 3 scores
    { optionId: q3Options[0].id, personalityId: adventurer.id, points: 10 },
    { optionId: q3Options[1].id, personalityId: analyst.id, points: 10 },
    { optionId: q3Options[2].id, personalityId: diplomat.id, points: 9 },
    { optionId: q3Options[3].id, personalityId: leader.id, points: 8 },

    // Question 4 scores
    { optionId: q4Options[0].id, personalityId: adventurer.id, points: 10 },
    { optionId: q4Options[1].id, personalityId: analyst.id, points: 10 },
    { optionId: q4Options[2].id, personalityId: diplomat.id, points: 9 },
    { optionId: q4Options[3].id, personalityId: leader.id, points: 8 },

    // Question 5 scores
    { optionId: q5Options[0].id, personalityId: adventurer.id, points: 10 },
    { optionId: q5Options[1].id, personalityId: analyst.id, points: 10 },
    { optionId: q5Options[2].id, personalityId: diplomat.id, points: 9 },
    { optionId: q5Options[3].id, personalityId: leader.id, points: 10 },
  ];

  // For simplicity, let's just create primary scores (one per option)
  const simplifiedScores = [
    // Each option gives points primarily to one personality
    { optionId: q1Options[0].id, personalityId: adventurer.id, points: 10 },
    { optionId: q1Options[1].id, personalityId: analyst.id, points: 10 },
    { optionId: q1Options[2].id, personalityId: diplomat.id, points: 10 },
    { optionId: q1Options[3].id, personalityId: leader.id, points: 10 },

    { optionId: q2Options[0].id, personalityId: diplomat.id, points: 9 },
    { optionId: q2Options[1].id, personalityId: analyst.id, points: 10 },
    { optionId: q2Options[2].id, personalityId: diplomat.id, points: 8 },
    { optionId: q2Options[3].id, personalityId: leader.id, points: 10 },

    { optionId: q3Options[0].id, personalityId: adventurer.id, points: 10 },
    { optionId: q3Options[1].id, personalityId: analyst.id, points: 10 },
    { optionId: q3Options[2].id, personalityId: diplomat.id, points: 9 },
    { optionId: q3Options[3].id, personalityId: leader.id, points: 8 },

    { optionId: q4Options[0].id, personalityId: adventurer.id, points: 10 },
    { optionId: q4Options[1].id, personalityId: analyst.id, points: 10 },
    { optionId: q4Options[2].id, personalityId: diplomat.id, points: 9 },
    { optionId: q4Options[3].id, personalityId: leader.id, points: 8 },

    { optionId: q5Options[0].id, personalityId: adventurer.id, points: 10 },
    { optionId: q5Options[1].id, personalityId: analyst.id, points: 10 },
    { optionId: q5Options[2].id, personalityId: diplomat.id, points: 9 },
    { optionId: q5Options[3].id, personalityId: leader.id, points: 10 },
  ];

  await prisma.optionScore.createMany({
    data: simplifiedScores,
  });

  console.log(`✅ Created ${simplifiedScores.length} scoring rules`);

  // ============================================
  // 5. CREATE SAMPLE QUIZ ATTEMPT
  // ============================================
  console.log('\n📊 Creating sample quiz attempt...');

  const sampleAttempt = await prisma.quizAttempt.create({
    data: {
      finalPersonalityId: adventurer.id,
      scoreSnapshot: {
        adventurer: 75.5,
        analyst: 32.1,
        diplomat: 28.6,
        leader: 34.8,
      },
      answers: {
        create: [
          { questionId: questionRecords[0].id, optionId: q1Options[0].id },
          { questionId: questionRecords[1].id, optionId: q2Options[2].id },
          { questionId: questionRecords[2].id, optionId: q3Options[0].id },
          { questionId: questionRecords[3].id, optionId: q4Options[0].id },
          { questionId: questionRecords[4].id, optionId: q5Options[0].id },
        ],
      },
    },
  });

  console.log(`✅ Created sample quiz attempt #${sampleAttempt.id}`);

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n================================');
  console.log('✅ DATABASE SEED COMPLETE!');
  console.log('================================');
  console.log(`👥 Personalities: 4`);
  console.log(`❓ Questions: ${questionRecords.length}`);
  console.log(`📝 Options: ${allOptions.length}`);
  console.log(`🎯 Scoring Rules: ${simplifiedScores.length}`);
  console.log(`📊 Sample Quiz Attempt: 1`);
  console.log('================================\n');
}

main()
  .catch((error) => {
    console.error('\n❌ SEED FAILED!');
    console.error('Error:', error.message);
    
    if (error.message.includes('prisma://')) {
      console.error('\n⚠️  Note: Remove accelerateUrl from PrismaClient constructor');
      console.error('Use: const prisma = new PrismaClient();');
    }
    
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('👋 Database connection closed');
  });