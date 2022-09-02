(async () => {
  const response = await fetch('https://openapi.programming-hero.com/api/news/categories');
  const { data } = await response.json();
  const { news_category } = data;
  renderCategory(news_category);
})();

const renderCategory = (categories) => {
  const categoryContainer = document.getElementById('category');
  categories.forEach((category) => {
    const buttonHtml = `<button onclick='loadNews(this)' data-id=${category.category_id} class="btn-category border-0 bg-transparent py-1">${category.category_name}</button>`;
    categoryContainer.insertAdjacentHTML('beforeend', buttonHtml);
  });
};

const loadNews = (element) => {
  const categoryBtns = document.querySelectorAll('.btn-category');
  categoryBtns.forEach((categoryBtn) => {
    categoryBtn.classList.remove('text-primary');
  });
  element.classList.add('text-primary');
  console.log(element.dataset.id);
};
