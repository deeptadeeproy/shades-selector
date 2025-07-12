/**
 * Fuzzy search utility for project names
 * Implements a simple fuzzy matching algorithm that finds projects
 * where the search query characters appear in order in the project name
 */

export function fuzzySearch(query: string, items: string[]): string[] {
  if (!query.trim()) {
    return items;
  }

  const searchQuery = query.toLowerCase();
  
  return items.filter(item => {
    const itemLower = item.toLowerCase();
    let queryIndex = 0;
    
    for (let i = 0; i < itemLower.length && queryIndex < searchQuery.length; i++) {
      if (itemLower[i] === searchQuery[queryIndex]) {
        queryIndex++;
      }
    }
    
    return queryIndex === searchQuery.length;
  });
}

/**
 * Enhanced fuzzy search that returns items with their match score
 * Higher scores indicate better matches
 */
export function fuzzySearchWithScore(query: string, items: string[]): Array<{ item: string; score: number }> {
  if (!query.trim()) {
    return items.map(item => ({ item, score: 0 }));
  }

  const searchQuery = query.toLowerCase();
  
  return items
    .map(item => {
      const itemLower = item.toLowerCase();
      let queryIndex = 0;
      let consecutiveMatches = 0;
      let totalMatches = 0;
      let lastMatchIndex = -1;
      
      for (let i = 0; i < itemLower.length && queryIndex < searchQuery.length; i++) {
        if (itemLower[i] === searchQuery[queryIndex]) {
          totalMatches++;
          
          // Bonus for consecutive matches
          if (lastMatchIndex === i - 1) {
            consecutiveMatches++;
          }
          
          lastMatchIndex = i;
          queryIndex++;
        }
      }
      
      if (queryIndex === searchQuery.length) {
        // Calculate score based on:
        // - Total matches (higher is better)
        // - Consecutive matches (bonus)
        // - Position of first match (earlier is better)
        const firstMatchIndex = itemLower.indexOf(searchQuery[0]);
        const positionScore = Math.max(0, 10 - firstMatchIndex);
        const score = totalMatches + consecutiveMatches + positionScore;
        
        return { item, score };
      }
      
      return { item, score: -1 }; // No match
    })
    .filter(result => result.score >= 0)
    .sort((a, b) => b.score - a.score);
} 