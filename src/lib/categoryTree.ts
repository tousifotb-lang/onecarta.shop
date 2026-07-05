// Place this at: src/lib/categoryTree.ts

import Category from "@/models/Category";
import mongoose from "mongoose";

// Walks the category tree downward from `rootId` and returns the root's own
// ObjectId plus every descendant category's ObjectId (children, grandchildren,
// etc., up to 15 levels deep as a safety cap). Used so that filtering products
// by a parent category (e.g. "Electronics") also includes products that were
// tagged under its subcategories (e.g. "Mobile Phones", "Laptops").
export async function getDescendantCategoryIds(
  rootId: string
): Promise<mongoose.Types.ObjectId[]> {
  const rootObjectId = new mongoose.Types.ObjectId(rootId);
  const allIds: mongoose.Types.ObjectId[] = [rootObjectId];

  let frontier: mongoose.Types.ObjectId[] = [rootObjectId];
  let depth = 0;

  while (frontier.length > 0 && depth < 15) {
    const children = await Category.find({ parentId: { $in: frontier } })
      .select("_id")
      .lean();

    const childIds = children.map((c: any) => c._id as mongoose.Types.ObjectId);
    if (childIds.length === 0) break;

    allIds.push(...childIds);
    frontier = childIds;
    depth += 1;
  }

  return allIds;
}