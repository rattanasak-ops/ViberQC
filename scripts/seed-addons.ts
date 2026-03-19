// ============================================================
// ViberQC — Seed Add-on Packages
// Run: npx tsx scripts/seed-addons.ts
// ============================================================

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { addonPackages } from "../src/lib/db/schema";
import { ADDON_PACKAGES } from "../src/data/addon-packages";

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL is not set");
    process.exit(1);
  }

  const client = postgres(connectionString);
  const db = drizzle(client);

  console.log("🌱 Seeding add-on packages...\n");

  for (const pkg of ADDON_PACKAGES) {
    try {
      await db
        .insert(addonPackages)
        .values({
          slug: pkg.slug,
          name: pkg.name,
          description: pkg.description,
          category: pkg.category,
          features: pkg.features,
          pricingMonthly: pkg.pricingMonthly,
          pricingPerUse: pkg.pricingPerUse,
          creditsIncluded: pkg.creditsIncluded,
          sortOrder: pkg.sortOrder,
          isActive: true,
        })
        .onConflictDoUpdate({
          target: addonPackages.slug,
          set: {
            name: pkg.name,
            description: pkg.description,
            category: pkg.category,
            features: pkg.features,
            pricingMonthly: pkg.pricingMonthly,
            pricingPerUse: pkg.pricingPerUse,
            creditsIncluded: pkg.creditsIncluded,
            sortOrder: pkg.sortOrder,
            updatedAt: new Date(),
          },
        });

      console.log(`  ✅ ${pkg.name} (${pkg.slug})`);
    } catch (error) {
      console.error(`  ❌ ${pkg.name}: ${error}`);
    }
  }

  console.log(`\n🎉 Seeded ${ADDON_PACKAGES.length} add-on packages`);
  await client.end();
}

seed().catch(console.error);
