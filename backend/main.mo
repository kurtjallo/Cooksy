import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Migration "migration";

(with migration = Migration.run)
actor FoodWasteReducer {

  // Types
  public type Ingredient = {
    id : Text;
    name : Text;
    dateAdded : Int;
    source : Text;
  };

  public type Recipe = {
    id : Text;
    title : Text;
    ingredientsUsed : [Text];
    missingIngredients : [Text];
    steps : [Text];
    prepTime : Nat;
    difficulty : Text;
    saved : Bool;
  };

  public type HistoryEntry = {
    id : Text;
    ingredientList : [Ingredient];
    timestamp : Int;
  };

  // OrderedMap operations
  transient let textMap = OrderedMap.Make<Text>(Text.compare);

  // Storage
  var ingredients : OrderedMap.Map<Text, Ingredient> = textMap.empty<Ingredient>();
  var recipes : OrderedMap.Map<Text, Recipe> = textMap.empty<Recipe>();
  var history : OrderedMap.Map<Text, HistoryEntry> = textMap.empty<HistoryEntry>();

  // Ingredient Management
  public func addIngredient(name : Text, source : Text) : async Ingredient {
    let id = Text.concat(name, Int.toText(Time.now()));
    let ingredient : Ingredient = {
      id;
      name;
      dateAdded = Time.now();
      source;
    };
    ingredients := textMap.put(ingredients, id, ingredient);
    ingredient;
  };

  public func addMultipleIngredients(names : [Text], source : Text) : async [Ingredient] {
    var addedIngredients = List.nil<Ingredient>();
    for (name in names.vals()) {
      let trimmedName = Text.trim(name, #char ' ');
      if (trimmedName != "") {
        let id = Text.concat(trimmedName, Int.toText(Time.now()));
        let ingredient : Ingredient = {
          id;
          name = trimmedName;
          dateAdded = Time.now();
          source;
        };
        ingredients := textMap.put(ingredients, id, ingredient);
        addedIngredients := List.push(ingredient, addedIngredients);
      };
    };
    List.toArray(addedIngredients);
  };

  public func getAllIngredients() : async [Ingredient] {
    Iter.toArray(textMap.vals(ingredients));
  };

  // Recipe Management
  public func saveRecipe(recipe : Recipe) : async Recipe {
    recipes := textMap.put(recipes, recipe.id, recipe);
    recipe;
  };

  public func toggleFavorite(recipeId : Text) : async Recipe {
    switch (textMap.get(recipes, recipeId)) {
      case (null) { Debug.trap("Recipe not found") };
      case (?recipe) {
        let updatedRecipe : Recipe = {
          id = recipe.id;
          title = recipe.title;
          ingredientsUsed = recipe.ingredientsUsed;
          missingIngredients = recipe.missingIngredients;
          steps = recipe.steps;
          prepTime = recipe.prepTime;
          difficulty = recipe.difficulty;
          saved = not recipe.saved;
        };
        recipes := textMap.put(recipes, recipeId, updatedRecipe);
        updatedRecipe;
      };
    };
  };

  public func getFavoriteRecipes() : async [Recipe] {
    var favorites = List.nil<Recipe>();
    for (recipe in textMap.vals(recipes)) {
      if (recipe.saved) {
        favorites := List.push(recipe, favorites);
      };
    };
    List.toArray(favorites);
  };

  // History Management
  public func addHistoryEntry(ingredientList : [Ingredient]) : async HistoryEntry {
    let id = Int.toText(Time.now());
    let entry : HistoryEntry = {
      id;
      ingredientList;
      timestamp = Time.now();
    };
    history := textMap.put(history, id, entry);
    entry;
  };

  public func getHistory() : async [HistoryEntry] {
    Iter.toArray(textMap.vals(history));
  };

  // Simulated AI Endpoints
  public func analyzeIngredients(ingredientList : [Text]) : async [Recipe] {
    // Simulate recipe generation
    let recipes = List.tabulate<Recipe>(
      5,
      func(i) {
        {
          id = Int.toText(Time.now() + i);
          title = "Recipe " # Int.toText(i + 1);
          ingredientsUsed = ingredientList;
          missingIngredients = ["Ingredient " # Int.toText(i + 1)];
          steps = ["Step 1", "Step 2", "Step 3"];
          prepTime = 30 + i * 10;
          difficulty = if (i < 2) "Easy" else if (i < 4) "Medium" else "Hard";
          saved = false;
        };
      },
    );
    List.toArray(recipes);
  };

  public func photoToIngredients(_image : Text) : async [Text] {
    // Simulate ingredient extraction from photo
    ["Tomato", "Cheese", "Bread"];
  };

  public func storageTips(_ingredientList : [Text]) : async [Text] {
    // Simulate storage tips generation
    ["Store tomatoes at room temperature", "Keep cheese refrigerated"];
  };

  public func safetyCheck(_ingredientList : [Text]) : async [Text] {
    // Simulate safety warnings
    ["Check expiration dates", "Avoid cross-contamination"];
  };
};

