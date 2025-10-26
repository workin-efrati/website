import TagModel, { ITag } from "../models/tags.model";
import mongoose, { FilterQuery, UpdateQuery, PopulateOptions, ObjectId } from "mongoose";

// Create
export const create = (data: Partial<ITag>) => TagModel.create(data);

// Read (lean)
export const read = (filter: FilterQuery<ITag>) => TagModel.find(filter).lean().exec();

// Read (non-lean)
export const readNoLean = (filter: FilterQuery<ITag>) => TagModel.find(filter).exec();

// Read with populate + select
export const specialRead = (
  filter: FilterQuery<ITag>,
  populate?: string | PopulateOptions | (string | PopulateOptions)[],
  select?: string
) => {
  let query = TagModel.find(filter);
  if (populate) query = query.populate(populate as any);
  if (select) query = query.select(select);
  return query.exec();
};

// Read one
export const readOne = (filter: FilterQuery<ITag>) => TagModel.findOne(filter).exec();

// Update
export const update = (id: string, newData: UpdateQuery<ITag>) =>
  TagModel.findByIdAndUpdate(id, newData, { new: true }).exec();

// Find by ID
export const findById = (id: string) => TagModel.findById(id).exec();

// Soft delete (set isActive = false)
export const del = (id: string) =>
  TagModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();



type MaybeObjectId = string | ObjectId;

export async function getAllChildTagIdsDeep(tagId: MaybeObjectId): Promise<string[]> {
  if (!tagId) throw new Error("tagId is required");

  const id = typeof tagId === "string" ? new mongoose.Types.ObjectId(tagId) : tagId;

  // Preferred: use aggregation with $graphLookup (single DB query, efficient)
  try {
    const collectionName = TagModel.collection.name; // usually 'tags'
    const aggResult = await TagModel.aggregate([
      { $match: { _id: id } },
      {
        $graphLookup: {
          from: collectionName,
          startWith: "$_id",
          connectFromField: "children", // follow 'children' arrays to find descendants
          connectToField: "_id",
          as: "descendants",
          // optional: limit depth if you want: maxDepth: 5
        },
      },
      // Project only ids to reduce payload
      {
        $project: {
          rootId: "$_id",
          descendantIds: { $map: { input: "$descendants", as: "d", in: "$$d._id" } },
        },
      },
    ]).exec();

    if (aggResult.length === 0) return [];

    const { rootId, descendantIds } = aggResult[0] as { rootId: ObjectId; descendantIds: ObjectId[] };

    // convert all ids to strings, include the root id
    const ids = [rootId.toString(), ...(descendantIds || []).map((x) => x.toString())];

    // dedupe just in case (graphLookup shouldn't return dupes, but safe)
    return Array.from(new Set(ids));
  } catch (err) {
    // If aggregation fails for some reason, fallback to recursive populate approach
    // (slower; multiple DB calls)
    console.warn("graphLookup failed, falling back to recursive populate", err);
  }

  // Fallback: populate recursively (original approach, but typed)
  const tag = await TagModel.findById(id)
    .populate({
      path: "children",
      populate: {
        path: "children",
        populate: {
          path: "children",
          populate: {
            path: "children",
            populate: {
              path: "children",
              populate: {
                path: "children",
                populate: {
                  path: "children",
                },
              },
            },
          },
        },
      },
    })
    .exec();

  if (!tag) return [];

  const ids: string[] = [];
  const rootIdStr = tag._id?.toString();
  if (rootIdStr) ids.push(rootIdStr);

  const traverse = (nodes: ITag[] | mongoose.Types.ObjectId[] | undefined) => {
    if (!nodes || nodes.length === 0) return;
    for (const n of nodes as any[]) {
      // each populated child should be a document
      const childId = n._id ? n._id.toString() : (n as ObjectId).toString();
      ids.push(childId);
      // recurse if child has children
      if (n.children && n.children.length > 0) traverse(n.children);
    }
  };

  traverse(tag.children as any[]);
  return Array.from(new Set(ids));
}