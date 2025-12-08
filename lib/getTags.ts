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

export const findDirectChildrenByPath = (path: string[]): string[] => {
  let currentLevel: any[] = tagsHierarchyFull;

  for (const key of path) {
    const node = currentLevel.find(obj => key in obj);
    if (!node) return [];
    currentLevel = node[key];
  }

  // currentLevel is now the array under the final node
  // Each item is an object like { childName: [...] }
  return currentLevel.map(obj => Object.keys(obj)[0]);
};


type TagNode = { [key: string]: TagNode[] };

export const findParentsByKey = (
  keyToFind: string,
  data: TagNode[] = tagsHierarchyFull as unknown as TagNode[]
): string[] | null => {
  for (const obj of data) {
    const [key, children] = Object.entries(obj)[0] as [string, TagNode[]];

    if (key === keyToFind) {
      // Found the key itself → no parents to add here
      return [];
    }

    const foundPath = findParentsByKey(keyToFind, children);
    if (foundPath) {
      // Only add current key if something was found deeper
      return [key, ...foundPath];
    }
  }

  return null; // Not found anywhere
};
