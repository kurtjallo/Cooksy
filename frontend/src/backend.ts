export type Ingredient = {
  id: string;
  name: string;
  dateAdded: bigint;
  source: string;
};

export type Recipe = {
  id: string;
  title: string;
  ingredientsUsed: string[];
  missingIngredients: string[];
  steps: string[];
  prepTime: number;
  difficulty: string;
  saved: boolean;
};

export type HistoryEntry = {
  id: string;
  ingredientList: Ingredient[];
  timestamp: bigint;
};

export type Actor = {
  addIngredient: (name: string, source: string) => Promise<Ingredient>;
  addMultipleIngredients: (names: string[], source: string) => Promise<Ingredient[]>;
  getAllIngredients: () => Promise<Ingredient[]>;
  saveRecipe: (recipe: Recipe) => Promise<Recipe>;
  getAllRecipes: () => Promise<Recipe[]>;
  toggleFavorite: (recipeId: string) => Promise<Recipe>;
  getFavoriteRecipes: () => Promise<Recipe[]>;
  analyzeIngredients: (ingredientList: string[]) => Promise<Recipe[]>;
  photoToIngredients: (_image: string) => Promise<string[]>;
  storageTips: (ingredientList: string[]) => Promise<string[]>;
  safetyCheck: (ingredientList: string[]) => Promise<string[]>;
  addHistoryEntry: (ingredientList: Ingredient[]) => Promise<HistoryEntry>;
  getHistory: () => Promise<HistoryEntry[]>;
};

type SerializableIngredient = Omit<Ingredient, 'dateAdded'> & { dateAdded: number };
type SerializableHistoryEntry = Omit<HistoryEntry, 'ingredientList' | 'timestamp'> & {
  ingredientList: SerializableIngredient[];
  timestamp: number;
};

type SerializableState = {
  ingredients: SerializableIngredient[];
  recipes: Recipe[];
  history: SerializableHistoryEntry[];
};

type State = {
  ingredients: Ingredient[];
  recipes: Recipe[];
  history: HistoryEntry[];
};

const STORAGE_KEY = 'cooksy-local-state';

const DEFAULT_STATE: State = {
  ingredients: [],
  recipes: [],
  history: [],
};

const nowNs = () => BigInt(Date.now()) * 1_000_000n;

const generateId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

function reviveState(raw: SerializableState | null): State {
  if (!raw) return { ...DEFAULT_STATE };

  try {
    return {
      ingredients: raw.ingredients.map((item) => ({
        ...item,
        dateAdded: BigInt(item.dateAdded ?? 0),
      })),
      recipes: raw.recipes ?? [],
      history: raw.history.map((entry) => ({
        ...entry,
        timestamp: BigInt(entry.timestamp ?? 0),
        ingredientList: entry.ingredientList.map((item) => ({
          ...item,
          dateAdded: BigInt(item.dateAdded ?? 0),
        })),
      })),
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function serializeState(state: State): SerializableState {
  return {
    ingredients: state.ingredients.map((item) => ({
      ...item,
      dateAdded: Number(item.dateAdded ?? 0n),
    })),
    recipes: state.recipes,
    history: state.history.map((entry) => ({
      ...entry,
      timestamp: Number(entry.timestamp ?? 0n),
      ingredientList: entry.ingredientList.map((item) => ({
        ...item,
        dateAdded: Number(item.dateAdded ?? 0n),
      })),
    })),
  };
}

function readState(): State {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_STATE };
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { ...DEFAULT_STATE };
  try {
    return reviveState(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function writeState(state: State) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeState(state)));
}

export function createMockActor(): Actor {
  let state: State = readState();

  const persist = () => writeState(state);

  return {
    async addIngredient(name: string, source: string): Promise<Ingredient> {
      const trimmed = name.trim();
      if (!trimmed) {
        throw new Error('Ingredient name required');
      }
      const ingredient: Ingredient = {
        id: generateId('ingredient'),
        name: trimmed,
        dateAdded: nowNs(),
        source,
      };
      state = { ...state, ingredients: [...state.ingredients, ingredient] };
      persist();
      return ingredient;
    },

    async addMultipleIngredients(names: string[], source: string): Promise<Ingredient[]> {
      const validNames = names.map((n) => n.trim()).filter((n) => n.length > 0);
      if (validNames.length === 0) {
        return [];
      }
      const newIngredients = validNames.map<Ingredient>((name) => ({
        id: generateId('ingredient'),
        name,
        dateAdded: nowNs(),
        source,
      }));
      state = { ...state, ingredients: [...state.ingredients, ...newIngredients] };
      persist();
      return newIngredients;
    },

    async getAllIngredients(): Promise<Ingredient[]> {
      return state.ingredients;
    },

    async saveRecipe(recipe: Recipe): Promise<Recipe> {
      const existingIndex = state.recipes.findIndex((r) => r.id === recipe.id);
      if (existingIndex >= 0) {
        const updated = [...state.recipes];
        updated[existingIndex] = recipe;
        state = { ...state, recipes: updated };
      } else {
        state = { ...state, recipes: [...state.recipes, recipe] };
      }
      persist();
      return recipe;
    },

    async getAllRecipes(): Promise<Recipe[]> {
      return state.recipes;
    },

    async toggleFavorite(recipeId: string): Promise<Recipe> {
      const recipe = state.recipes.find((r) => r.id === recipeId);
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      const updated: Recipe = { ...recipe, saved: !recipe.saved };
      state = {
        ...state,
        recipes: state.recipes.map((r) => (r.id === recipeId ? updated : r)),
      };
      persist();
      return updated;
    },

    async getFavoriteRecipes(): Promise<Recipe[]> {
      return state.recipes.filter((r) => r.saved);
    },

    async analyzeIngredients(ingredientList: string[]): Promise<Recipe[]> {
      const baseMissing = ['Olive Oil', 'Garlic', 'Onion', 'Basil', 'Pasta', 'Bread'];

      const generated = Array.from({ length: 4 }).map((_, idx) => {
        const missingCount = Math.max(1, (idx % 3) + 1);
        const missing = baseMissing.slice(idx, idx + missingCount);

        return {
          id: generateId('recipe'),
          title: `Chef's Choice ${idx + 1}`,
          ingredientsUsed: ingredientList,
          missingIngredients: missing,
          steps: [
            'Prep your ingredients and preheat the pan.',
            'Cook aromatics until fragrant.',
            'Combine everything and adjust seasoning to taste.',
          ],
          prepTime: 20 + idx * 5,
          difficulty: idx < 2 ? 'Easy' : 'Medium',
          saved: false,
        } satisfies Recipe;
      });

      return generated;
    },

    async photoToIngredients(_image: string): Promise<string[]> {
      return ['Tomato', 'Cheese', 'Bread'];
    },

    async storageTips(ingredientList: string[]): Promise<string[]> {
      if (!ingredientList.length) return ['Keep ingredients dry and sealed.'];
      return ingredientList.map(
        (item) => `Store ${item} in a cool, dry place and use within a week.`
      );
    },

    async safetyCheck(ingredientList: string[]): Promise<string[]> {
      if (!ingredientList.length) return ['Check expiration dates before cooking.'];
      return [
        'Wash fresh produce before use.',
        `Cook ${ingredientList[0]} thoroughly to avoid safety issues.`,
      ];
    },

    async addHistoryEntry(ingredientList: Ingredient[]): Promise<HistoryEntry> {
      const entry: HistoryEntry = {
        id: generateId('history'),
        ingredientList,
        timestamp: nowNs(),
      };
      state = { ...state, history: [entry, ...state.history] };
      persist();
      return entry;
    },

    async getHistory(): Promise<HistoryEntry[]> {
      return state.history;
    },
  };
}
