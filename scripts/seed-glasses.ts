import { getDb } from "@/db";
import { glassesStyles } from "@/db/schema";
import { GLASSES_STYLES } from "@/lib/glasses/catalog";

const db = getDb();

for (const style of GLASSES_STYLES) {
  db.insert(glassesStyles)
    .values({
      id: style.id,
      name: style.name,
      family: style.family,
      fit: style.fit,
      color: style.color,
      material: style.material,
      promptNotes: style.promptNotes,
    })
    .onConflictDoUpdate({
      target: glassesStyles.id,
      set: {
        name: style.name,
        family: style.family,
        fit: style.fit,
        color: style.color,
        material: style.material,
        promptNotes: style.promptNotes,
        isActive: true,
      },
    })
    .run();
}

console.log(`Seeded ${GLASSES_STYLES.length} glasses styles.`);
