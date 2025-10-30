import tagsHierarchyFull from "@/lib/tags_hierarchy_full.json";


// Recursive helper to extract all key names from a nested array of objects
function getAllKeys(data: any[]): string[] {
  const result: string[] = [];

  for (const item of data) {
    for (const key in item) {
      result.push(key);
      result.push(...getAllKeys(item[key]));
    }
  }

  return result;
}

// Main function — find the node by path, then get all keys under it
export function findNodeKeysByPath(path: string[]): string[] {
  let currentLevel: any[] = tagsHierarchyFull;

  for (const key of path) {
    const node = currentLevel.find(obj => key in obj);
    if (!node) return []; // path not found
    currentLevel = node[key];
  }

  // Now currentLevel is the array of children under the final path
  return getAllKeys(currentLevel);
}
