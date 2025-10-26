import mongoose, { Model, PipelineStage } from "mongoose";
import ShutModel, { IShut } from "../models/shut.model";

interface SearchValue {
  field: string;
  fields?: string[];
  value?: string; // Make optional - used for single value searches
  values?: string[]; // Make optional - used for array searches (like $in)
  type?: string;
  searchType?: string;
}

interface IncludeFilter {
  searchValues: SearchValue[];
  searchType: string;
}

interface RegFilter {
  searchType?: "$and" | "$or"; // Add searchType here
  searchValues: {
    fields: string[];
    value: string;
    searchType?: "$and" | "$or";
  }[];
}

interface Sorter extends Array<[string, 1 | -1]> {}

interface Selector extends Array<string> {}

interface Pagination {
  pageLocation: number;
  pageLength: number;
}

interface PopulateOption {
  name: string;
  localField?: string;
  selector?: Record<string, number>;
}

export interface GenericFilterOptions {
  filters?: Record<string, any>;
  regFilter?: RegFilter;
  queryFilterType?: "$and" | "$or";
  includeFilter?: IncludeFilter;
  selector?: Selector;
  sorter?: Sorter;
  pages?: Pagination;
  populate?: PopulateOption[];
}

async function genericFilterWithPagination({
//   filters = { isActive: true },
  filters = {},
  regFilter,
  queryFilterType = "$and",
  includeFilter,
  selector,
  sorter,
  pages,
  populate,
}: GenericFilterOptions): Promise<{ res: IShut[]; totalCount: number }> {
  const modelRead = ShutModel;

  let matchStage: PipelineStage.Match = { $match: { [queryFilterType]: [filters] } };

  // Include filter
  if (includeFilter?.searchValues.length) {
    const inFilters = includeFilter.searchValues.map((searchValue) => ({
      [searchValue.field]: {
        $in:
          searchValue.type !== "_id"
            ? searchValue.values
            : searchValue.values?.map((v) => new mongoose.Types.ObjectId(v)
          ),
      },
    }));
    (matchStage.$match[queryFilterType] as any[]).push({
      [includeFilter.searchType]: inFilters,
    });
  }

  const pipeline: PipelineStage[] = [matchStage];

  // Regex filter
  if (regFilter?.searchValues.length) {
    const searchType = regFilter.searchType || "$and";
    
    if (searchType === "$or") {
      // OR logic: match if ANY word is found in ANY field
      const regexConditions = regFilter.searchValues
        .map((searchValue) => {
          const words = searchValue.value.split(" ");
          return words.map((word) => ({
            $cond: {
              if: {
                $regexMatch: {
                  input: `$${searchValue.fields[0]}`,
                  regex: new RegExp(word, "i"),
                },
              },
              then: 1,
              else: 0,
            },
          }));
        })
        .flat();

      pipeline.push({
        $project: {
          matchCount: { $sum: regexConditions },
          document: "$$ROOT",
        },
      });

      // For OR, we need at least 1 match
      pipeline.push({ $match: { matchCount: { $gte: 1 } } });
      pipeline.push({ $replaceRoot: { newRoot: "$document" } });
    } else {
      // AND logic: require 75% of words to match
      const regexConditions = regFilter.searchValues
        .map((searchValue) => {
          const words = searchValue.value.split(" ");
          return words.map((word) => ({
            $cond: {
              if: {
                $regexMatch: {
                  input: `$${searchValue.fields[0]}`,
                  regex: new RegExp(word, "i"),
                },
              },
              then: 1,
              else: 0,
            },
          }));
        })
        .flat();

      pipeline.push({
        $project: {
          matchCount: { $sum: regexConditions },
          document: "$$ROOT",
        },
      });

      const wordsCount = regFilter.searchValues.reduce(
        (sum, searchValue) => sum + searchValue.value.split(" ").length,
        0
      );
      const requiredMatches = Math.ceil(wordsCount * 0.75);

      pipeline.push({ $match: { matchCount: { $gte: requiredMatches } } });
      pipeline.push({ $replaceRoot: { newRoot: "$document" } });
    }
  }

  // Count
  const countPipeline = [...pipeline, { $count: "totalCount" }];
  const countResult = await modelRead.aggregate<{ totalCount: number }>(countPipeline).exec();
  const totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;

  // Selector
  if (selector?.length) {
    pipeline.push({
      $project: selector.reduce<Record<string, 0 | 1>>((acc, field) => {
        acc[field.startsWith("-") ? field.slice(1) : field] = field.startsWith("-") ? 0 : 1;
        return acc;
      }, {}),
    });
  }

  // Sort
  if (sorter?.length) {
    pipeline.push({
      $sort: sorter.reduce<Record<string, 1 | -1>>((acc, [field, order]) => {
        acc[field] = order;
        return acc;
      }, {}),
    });
  }

  // Pagination
  if (pages && pages.pageLocation !== undefined) {
    pipeline.push({ $skip: pages.pageLocation * pages.pageLength });
    pipeline.push({ $limit: pages.pageLength });
  }

  // Populate
  if (populate?.length) {
    for (const pop of populate) {
      pipeline.push({
        $lookup: {
          from: pop.name,
          let: { localIds: `$${pop.localField || pop.name}` },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$localIds"],
                },
              },
            },
            {
              $project: pop.selector || {},
            },
          ],
          as: pop.name,
        },
      });
    }
  }

  const res = await modelRead.aggregate(pipeline).exec();
  return { res, totalCount };
}

export default genericFilterWithPagination;