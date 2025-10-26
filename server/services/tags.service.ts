import { findById, read, readOne } from "../controllers/tags.controller";
import { FilterQuery } from "mongoose";
import { ITag } from "../models/tags.model";

export const getTagsWithNoParent = async () => {
   const tags = await read({
       isActive: true,
       $or: [
           { parent: { $exists: false } },
           { parent: null }
       ]
   });
   return tags
}

export interface CategoryFamilyResult {
  categoryObject: ITag;
  parents: { name: string; _id: string }[];
  children: { name: string; _id: string }[];
}

export const familyOfCategoryService = async (
  filter: FilterQuery<ITag>
): Promise<CategoryFamilyResult> => {
  try {
    const categoryObject = await readOne(filter);
    if (!categoryObject) throw new Error("Category not found");

    // Get all parents
    const getParents = async (tag: ITag) => {
      const parents: { name: string; _id: string }[] = [];
      let currentParent = tag.parent;

      while (currentParent) {
        const parentObject = await findById(currentParent.toString());
        if (!parentObject) break;
        parents.push({ name: parentObject.name, _id: parentObject._id.toString() });
        currentParent = parentObject.parent;
      }

      return parents;
    };

    // Get all children (one level)
    const getChildren = async (tag: ITag) => {
      const children: { name: string; _id: string }[] = [];
      const stack = [...(tag.children || [])];

      while (stack.length) {
        const childId = stack.pop();
        if (!childId) continue;
        const childObject = await findById(childId.toString());
        if (childObject) {
          children.push({ name: childObject.name, _id: childObject._id.toString() });
          // stack.push(...childObject.children); // Uncomment to fetch grandchildren recursively
        }
      }

      return children;
    };

    const parents = await getParents(categoryObject);
    const children = await getChildren(categoryObject);

    return {
      categoryObject,
      parents,
      children,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching category family");
  }
};


