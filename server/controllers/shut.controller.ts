import { FilterQuery, PopulateOptions, UpdateQuery } from "mongoose";
import ShutModel, { IShut } from "../models/shut.model";

/**
 * Create a new Shut document
 */
export const create = (data: Partial<IShut>) => {
   return ShutModel.create(data);
};

/**
 * Read multiple documents by filter
 */
export const read = (filter: FilterQuery<IShut>) => {
   return ShutModel.find(filter);
};

/**
 * Read multiple documents with options (limit, populate, projection)
 */
export const readWithOptions = async (
   filter: FilterQuery<IShut>,
   limit?: number,
   populate?: string | PopulateOptions | (string | PopulateOptions)[],
   projection?: Record<string, 0 | 1>,
   numberOfDocuments?: number
) => {
   let query = ShutModel.find(filter);

   if (limit) query = query.limit(limit);
   // Ensure populate is not a string to fix overload issues (Mongoose 7+ does not accept raw string as populate)
   if (populate) {
      if (typeof populate === "string") {
         query = query.populate({ path: populate });
      } else {
         query = query.populate(populate);
      }
   }
   if (projection) query = query.select(projection);

   if (numberOfDocuments) query = query.limit(numberOfDocuments);

   const result = await query.exec()

   return result;
}
/**
 * Read a single document by filter
 */
export const readOne = (
   filter: FilterQuery<IShut>,
   populate?: string | PopulateOptions | (string | PopulateOptions)[]
) => {
   let query = ShutModel.findOne(filter);
   if (populate) {
      if (typeof populate === "string") {
         query = query.populate({ path: populate });
      } else {
         query = query.populate(populate);
      }
   }
   return query.lean<IShut>();
};

/**
 * Update a document by ID
 */
export const update = (id: string, newData: UpdateQuery<IShut>) => {
   return ShutModel.findByIdAndUpdate(id, newData, { new: true });
}
