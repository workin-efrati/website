import { FilterQuery, PopulateOptions } from "mongoose";
import { readOne, readWithOptions } from "../controllers/shut.controller";
import ShutModel, { IShut } from "../models/shut.model";
import { findNodeKeysByPath, findParentsByKey } from "@/lib/getTags";

export const readAllShutService = async () =>
  await readWithOptions({}, undefined, undefined, { _id: 1 });

export const readAllShutServiceWithSelect = async (select: Record<string, 0 | 1>) =>
  await readWithOptions({}, undefined, undefined, select);

export const readOneShutWithPopulateService = async (filter: FilterQuery<IShut>) =>
  await readOne(filter, { path: 'tags', select: 'name' });

export const readLast3ShutsService = async (populate?: string | PopulateOptions | (string | PopulateOptions)[], select?: Record<string, 0 | 1>): Promise<IShut[]> =>
  await readWithOptions({}, undefined, populate, select, 3);

export const readThreeShutsByParashaService = async (parasha: string, populate?: string | PopulateOptions | (string | PopulateOptions)[], select?: Record<string, 0 | 1>): Promise<IShut[]> =>
  await readWithOptions(
    { $or: [{ question: { $regex: parasha, $options: 'i' } }, { answer: { $regex: parasha, $options: 'i' } }] }
    , undefined, populate, select, 3);

export const readThreeShutsByHolidayService = async (
  holiday: string,
  populate?: string | PopulateOptions | (string | PopulateOptions)[],
  select?: Record<string, 0 | 1>
): Promise<IShut[]> => {
  const parents = findParentsByKey(holiday) || [];
  const children = Array.from(new Set(findNodeKeysByPath([...parents, holiday])));

  if (!children.length) return [];

  const perChildPromises = children.map((child) =>
    readWithOptions({ tag: child }, undefined, populate, select, 3)
  );

  const resultsPerChild = await Promise.all(perChildPromises);

  return resultsPerChild.flat();
};

// TODO - convert to controller and service
export const relatedShuts = async (shut: { _id?: string; tag?: string }) => {
  try {
    let filter = {};
    let related: any[] = [];

    // If there are tags, try to find shuts with at least one matching tag (excluding current one)
    if (shut.tag) {
      filter = {
        tag: shut.tag,
        _id: { $ne: shut._id },
      };

      related = await ShutModel.aggregate([
        { $match: filter },
        { $sample: { size: 3 } },
      ]);
    }

    // If no results (or no tags), fallback to random 3 shuts
    if (!related.length || related.length < 3) {
      related = [...related, ...(await ShutModel.aggregate([{ $sample: { size: 3 } }]))]
        .slice(0, 3);
    }

    return related;
  } catch (error) {
    console.error("Error fetching related shuts:", error);
    return [];
  }
};


