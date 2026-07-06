const recipes = [
	{
		name: "Apple Crisp",
		category: "Dessert",
		description: "Tender baked apples with a buttery oat topping and warm cinnamon flavor.",
		tags: ["apple", "cinnamon", "baked", "comfort"],
		rating: "★★★★☆",
		image: "./assets/apple-crisp.jpg",
		alt: "Apple crisp served in a dish",
	},
	{
		name: "Black Beans and Rice",
		category: "Dinner",
		description: "A hearty, budget-friendly bowl with smoky seasoning and bright lime finish.",
		tags: ["beans", "rice", "vegetarian", "weeknight"],
		rating: "★★★★☆",
		image: "https://wddbyui.github.io/wdd131/images/recipe2/black-beans-and-rice.jpg",
		alt: "A bowl of black beans and rice",
	},
	{
		name: "Chicken Curry",
		category: "Dinner",
		description: "A rich curry with tender chicken, fragrant spices, and a creamy sauce.",
		tags: ["chicken", "curry", "spicy", "rice"],
		rating: "★★★★★",
		image: "https://wddbyui.github.io/wdd131/images/recipe2/chicken-curry.webp",
		alt: "Chicken curry served in a bowl",
	},
	{
		name: "Chocolate Chip Cookies",
		category: "Dessert",
		description: "Soft centers, crisp edges, and plenty of melty chocolate chips.",
		tags: ["cookies", "chocolate", "snack", "baking"],
		rating: "★★★★★",
		image: "https://wddbyui.github.io/wdd131/images/recipe2/chocolate-chip-cookies.jpg",
		alt: "Stack of chocolate chip cookies",
	},
	{
		name: "Escalopes de Poulet a la Creme",
		category: "Dinner",
		description: "A classic creamy chicken dish with mushrooms and a delicate pan sauce.",
		tags: ["french", "chicken", "cream", "mushrooms"],
		rating: "★★★★☆",
		image: "https://wddbyui.github.io/wdd131/images/recipe2/escalopes-de-poulet-a-la-creme.webp",
		alt: "Chicken escalopes in a creamy sauce",
	},
	{
		name: "German Gooseberry Cake",
		category: "Dessert",
		description: "A tender cake topped with tart gooseberries and a lightly sweet crumb.",
		tags: ["cake", "berries", "fruit", "tea time"],
		rating: "★★★★☆",
		image: "https://wddbyui.github.io/wdd131/images/recipe2/german-gooseberry-cake.jpg",
		alt: "A slice of gooseberry cake",
	},
	{
		name: "Roasted Potatoes",
		category: "Side Dish",
		description: "Golden potatoes roasted until crisp with garlic, herbs, and olive oil.",
		tags: ["potatoes", "roasted", "garlic", "side dish"],
		rating: "★★★★☆",
		image: "https://wddbyui.github.io/wdd131/images/recipe2/roasted-potatoes.webp",
		alt: "Roasted potatoes in a bowl",
	},
	{
		name: "Sweet Potato Waffles",
		category: "Breakfast",
		description: "Fluffy waffles with sweet potato flavor and a hint of warm spice.",
		tags: ["breakfast", "waffles", "sweet potato", "brunch"],
		rating: "★★★★☆",
		image: "https://wddbyui.github.io/wdd131/images/recipe2/sweet-potato-waffle-md.jpg",
		alt: "Sweet potato waffles with syrup",
	},
];

const resultsContainer = document.querySelector("#recipe-results");
const summaryElement = document.querySelector("#results-summary");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#recipe-search");

const collator = new Intl.Collator(undefined, { sensitivity: "base" });

function getSearchableText(recipe) {
	return [recipe.name, recipe.category, recipe.description, ...recipe.tags].join(" ").toLowerCase();
}

function sortRecipes(recipeList) {
	return [...recipeList].sort((left, right) => collator.compare(left.name, right.name));
}

function recipeMarkup(recipe) {
	const tagMarkup = recipe.tags.map((tag) => `<li>${tag}</li>`).join("");

	return `
		<article class="recipe-card">
			<img class="recipe-card__image" src="${recipe.image}" alt="${recipe.alt}">
			<div class="recipe-card__content">
				<div class="recipe-meta">
					<span>${recipe.category}</span>
				</div>
				<div>
					<h2>${recipe.name}</h2>
					<p class="recipe-rating" aria-label="${recipe.rating.length} out of 5 stars">${recipe.rating}</p>
				</div>
				<p class="recipe-description">${recipe.description}</p>
				<ul class="tag-list">${tagMarkup}</ul>
			</div>
		</article>
	`;
}

function renderRecipes(recipeList, summaryText) {
	resultsContainer.innerHTML = "";
	summaryElement.textContent = summaryText;

	if (recipeList.length === 0) {
		resultsContainer.innerHTML = '<p class="empty-state">No recipes matched that search.</p>';
		return;
	}

	resultsContainer.innerHTML = sortRecipes(recipeList).map(recipeMarkup).join("");
}

function showRandomRecipe() {
	const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
	renderRecipes([randomRecipe], `Random recipe: ${randomRecipe.name}`);
}

function filterRecipes(query) {
	const terms = query
		.trim()
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean);

	if (terms.length === 0) {
		showRandomRecipe();
		return;
	}

	const matches = recipes.filter((recipe) => {
		const searchableText = getSearchableText(recipe);
		return terms.every((term) => searchableText.includes(term));
	});

	renderRecipes(matches, `${matches.length} recipe${matches.length === 1 ? "" : "s"} found for "${query.trim()}"`);
}

searchForm.addEventListener("submit", (event) => {
	event.preventDefault();
	filterRecipes(searchInput.value);
});

showRandomRecipe();
