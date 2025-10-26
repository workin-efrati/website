import { FilterQuery, PopulateOptions } from "mongoose";
import { readOne, readWithOptions } from "../controllers/shut.controller";
import { IShut } from "../models/shut.model";
import ShutModel from "../models/shut.model";
import { Types } from "mongoose";

export const readAllShutService = async () =>
   await readWithOptions({}, undefined, undefined, { _id: 1 });

export const readOneShutWithPopulateService = async ( filter: FilterQuery<IShut> ) =>
   await readOne(filter, { path: 'tags', select: 'name' });

export const readLast3ShutsService = async (populate?: string | PopulateOptions | (string | PopulateOptions)[], select?: Record<string, 0 | 1>): Promise<IShut[]> =>
   await readWithOptions({}, undefined, populate, select, 3);

// TODO - convert to controller and service
export const relatedShuts = async (shut: { _id?: string; tags?: string[] }) => {
  try {
    let filter = {};
    let related: any[] = [];

    // If there are tags, try to find shuts with at least one matching tag (excluding current one)
    if (shut.tags && shut.tags.length > 0) {
      filter = {
        tags: { $in: shut.tags },
        _id: { $ne: shut._id },
      };

      related = await ShutModel.aggregate([
        { $match: filter },
        { $sample: { size: 3 } },
      ]);
    }

    // If no results (or no tags), fallback to random 3 shuts
    if (!related.length) {
      related = await ShutModel.aggregate([{ $sample: { size: 3 } }]);
    }

    return related;
  } catch (error) {
    console.error("Error fetching related shuts:", error);
    return [];
  }
};


