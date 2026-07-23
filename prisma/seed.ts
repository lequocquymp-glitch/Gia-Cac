import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.knowledge.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  // Create projects
  const restaurant = await prisma.project.create({
    data: {
      name: "Restaurant Startup",
      description: "Launch new restaurant with focus on quality and service",
      status: "active",
    },
  });

  const dinh = await prisma.project.create({
    data: {
      name: "Đinh Bộ Lĩnh Project",
      description: "Development and expansion project",
      status: "active",
    },
  });

  const badminton = await prisma.project.create({
    data: {
      name: "AB Badminton",
      description: "Badminton club management",
      status: "active",
    },
  });

  // Create tasks for Restaurant
  await prisma.task.create({
    data: {
      projectId: restaurant.id,
      title: "SOP Đồng phục",
      description: "Create standard operating procedure for uniforms",
      importance: "high",
      status: "todo",
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    },
  });

  await prisma.task.create({
    data: {
      projectId: restaurant.id,
      title: "Menu design",
      importance: "high",
      status: "doing",
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    },
  });

  await prisma.task.create({
    data: {
      projectId: restaurant.id,
      title: "Staff training schedule",
      importance: "medium",
      status: "todo",
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
    },
  });

  await prisma.task.create({
    data: {
      projectId: restaurant.id,
      title: "Audit CN03",
      importance: "high",
      status: "waiting",
      deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago - overdue
    },
  });

  // Create tasks for Dinh
  await prisma.task.create({
    data: {
      projectId: dinh.id,
      title: "Phase 1 planning",
      importance: "high",
      status: "todo",
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  });

  // Create personal tasks (no project)
  await prisma.task.create({
    data: {
      title: "Review quarterly results",
      importance: "high",
      status: "todo",
      deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // today
    },
  });

  await prisma.task.create({
    data: {
      title: "Update project documentation",
      importance: "medium",
      status: "todo",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Create knowledge for Restaurant
  await prisma.knowledge.create({
    data: {
      projectId: restaurant.id,
      title: "Restaurant Operations SOP",
      type: "sop",
      content: `# Daily Operations
1. Open at 11:00 AM
2. Staff briefing at 10:45 AM
3. Check inventory
4. Prepare stations
5. Customer service standards`,
      tags: "operations,daily",
    },
  });

  await prisma.knowledge.create({
    data: {
      projectId: restaurant.id,
      title: "Food Safety Policy",
      type: "policy",
      content: `# Food Safety Guidelines
- All food must be stored at proper temperature
- Expiration dates must be checked daily
- Cross-contamination prevention is critical
- Staff must wash hands regularly`,
      tags: "food-safety,compliance",
    },
  });

  await prisma.knowledge.create({
    data: {
      projectId: restaurant.id,
      title: "Customer Service Checklist",
      type: "checklist",
      content: `- Greet customer within 2 minutes
- Take drink order first
- Recommend specials
- Check in after 5 minutes
- Offer dessert menu
- Thank you and invite back`,
      tags: "service,customer",
    },
  });

  // Create knowledge for Dinh
  await prisma.knowledge.create({
    data: {
      projectId: dinh.id,
      title: "Project Charter",
      type: "document",
      content: `Project Objective: Develop and expand Đinh Bộ Lĩnh operations
Timeline: Q3 2024 - Q4 2025
Budget: $500,000
Key stakeholders: Management team, investors`,
      tags: "charter,planning",
    },
  });

  console.log("✅ Seed data created successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
