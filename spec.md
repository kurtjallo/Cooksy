# Food Waste Reducer

A web application that helps users reduce food waste by generating recipes from available ingredients using AI analysis.

## Core Functionality

### Ingredient Management
- Users can add ingredients through two methods:
  - Manual text input with ingredient names (supports comma-separated multiple ingredients)
  - Photo upload for automatic ingredient detection
- Manual input allows adding multiple ingredients at once by separating them with commas (e.g., "tomato, cheese, bread" adds three separate ingredients)
- Input processing trims whitespace and ignores empty strings
- Each ingredient is stored with: ID, name, date added, and source (manual or photo)
- Ingredients are persisted in the backend using the `addMultipleIngredients` function
- Success toast notification displays when ingredients are added successfully
- Ingredient list refreshes immediately after successful addition to show newly added items using React Query refetch
- Error handling displays appropriate messages for API failures or UI errors
- Updated ingredient list syncs properly across all pages
- Form validation ensures proper input before submission
- Frontend properly splits comma-separated input into individual ingredients before sending to backend

### AI-Powered Features
The backend provides simulated AI endpoints for:
- **Recipe Generation**: The `analyzeIngredients` function takes all currently saved ingredients from the user's list and returns at least one properly structured recipe with title, ingredients used, missing ingredients, cooking steps, difficulty level, prep time, and cooking tips
- **Photo Analysis**: Extracts ingredient names from uploaded photos
- **Storage Tips**: Provides food storage best practices to reduce spoilage
- **Safety Warnings**: Identifies potential food safety issues and unsafe ingredient combinations

### Recipe Management
- Users can save recipes to favorites
- Saved recipes are stored in the backend and displayed on a dedicated favorites page
- Users can toggle save/unsave status for any recipe

### History Tracking
- All ingredient lists and generated recipes are automatically stored
- History page displays past ingredient entries with timestamps and source information
- Backend maintains persistent history records

## Pages and Navigation

### Home Page
- Introduction to the app's purpose
- Navigation links to main features

### Ingredient Input Page
- Text area for manual ingredient entry (supports comma-separated input)
- Form validation to ensure proper input before submission
- "Add Ingredients" button that correctly calls the backend `addMultipleIngredients` function with proper frontend-to-backend connection
- Photo upload functionality
- Display of current ingredient list that fetches from backend on page load and refreshes after successful additions using React Query
- Display of detected ingredients
- "Generate Recipe" button that correctly triggers the backend `analyzeIngredients` function with all currently saved ingredients
- Frontend logic waits for backend response before updating the UI
- Buttons to trigger AI analysis (storage tips, safety check)
- Success toast confirmation when ingredients are added
- Error messages for failed operations
- Proper comma-separated input parsing before sending to backend

### Recipe Results Page
- Displays generated recipes in styled recipe cards with title, ingredients (including missing ones), and step-by-step cooking instructions
- Recipe cards showing title, difficulty, prep time, ingredients used, and cooking steps
- Missing ingredients are prominently displayed under a "Missing Ingredients" heading with warning styling
- Save/unsave functionality for each recipe
- No longer shows "No recipes found" when recipes are properly generated

### Favorites Page
- List of saved recipes with complete recipe information
- Missing ingredients clearly highlighted with warning styling for each saved recipe
- Remove from favorites option

### History Page
- Table/list of previous ingredient lists with timestamps and source information

## UI Requirements

### Recipe Display Enhancement
- Recipe cards must clearly separate available ingredients from missing ingredients
- Missing ingredients section uses warning colors (red/orange) and warning icons for visual emphasis
- Missing ingredients are displayed under a dedicated "Missing Ingredients" heading
- This enhanced display applies to both newly generated recipes and saved favorites

### Input Enhancement
- Input processing handles comma-separated ingredients with proper parsing
- Form validation before submission
- Success toast notifications confirm successful ingredient addition
- Input validation trims whitespace and filters empty entries
- Error handling with user-friendly messages for API failures
- Immediate UI refresh after successful ingredient addition using React Query refetch
- Proper frontend-to-backend connection for ingredient addition

## Backend Data Storage

The backend persists the following data:
- **Ingredients**: ID, name, date added, source type
- **Recipes**: ID, title, ingredients used, missing ingredients, steps, prep time, difficulty, saved status
- **History Entries**: ID, ingredient list, timestamp

## Backend Functions

The backend must provide:
- `addMultipleIngredients`: Function to add comma-separated ingredients to the user's list with proper API endpoint
- `addIngredient`: Function to add single ingredient (fallback option)
- `analyzeIngredients`: Function to generate recipes from all saved ingredients
- `getIngredients`: Function to fetch current ingredient list
- Proper error handling and response formatting for all functions
- Reliable API endpoints that work with frontend calls

## Technical Requirements

- Frontend built with React and TypeScript
- React Router for navigation
- React Query for data fetching and cache management with proper refetch functionality
- Tailwind CSS for styling
- Toast notifications for user feedback
- Form validation for ingredient input
- Backend built with Motoko
- All data stored using persistent backend structures
- Clean, minimal card-based UI design with enhanced visual feedback for missing ingredients
- Full deployment on Internet Computer
- Proper frontend-to-backend API connection
- App content language: English
