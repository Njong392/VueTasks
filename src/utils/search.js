import { computed } from "vue";

export function useSearch(commands, searchQuery, filterSearchQuery, categorySearchQuery, searchableCols, columns){
  const filteredCommands = computed(() => {
    if (
      !searchQuery.value &&
      Object.keys(filterSearchQuery.value).length === 0 &&
      !categorySearchQuery.value
    ) {
      return commands.value;
    }

    // search by text query
    if (searchQuery.value) {
      return commands.value.filter((command) => {
        // some returns true if at least one within first 3 columns is true
        return searchableCols.value.some((column) => {
          const columnConfig = columns.value.find(
            (col) => col.key === column
          );
          if (!columnConfig || columnConfig.type !== "text") {
            return false;
          }

          return String(command[column])
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase().trim());
        });
      });
    }

    // filter search
    if (Object.keys(filterSearchQuery.value).length > 0) {
      return commands.value.filter((command) => {
        // every returns true if all is true
        return Object.entries(filterSearchQuery.value).every(([key, value]) => {
          if (typeof command[key] === "number") {
            return command[key] === Number(value);
          }

          return String(command[key])
            .toLowerCase()
            .includes(String(value).toLowerCase().trim());
        });
      });
    }

    // search by categories
    if (categorySearchQuery.value) {
      const { categories, value } = categorySearchQuery.value;

      return commands.value.filter((command) => {
        // some returns true if at least one is true
        return categories.some((category) => {
          if (typeof command[category] === "number") {
            return command[category] === Number(value);
          }

          return String(command[category])
            .toLowerCase()
            .includes(String(value).toLowerCase().trim());
        });
      });
    }
  });

  return {
    filteredCommands
  }

}