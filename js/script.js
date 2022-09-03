(async () => {
  try {
    const response = await fetch('https://openapi.programming-hero.com/api/news/categories');
    const { data } = await response.json();
    const { news_category } = data;
    renderCategory(news_category);
  } catch (error) {
    console.log(error);
  }
})();

const renderCategory = (categories) => {
  const categoryContainer = document.getElementById('category');
  categories.forEach((category) => {
    const buttonHtml = `<button onclick='categoryBtnClickHandler(this)' data-id=${category.category_id} class="btn-category border-0 bg-transparent py-1">${category.category_name}</button>`;
    categoryContainer.insertAdjacentHTML('beforeend', buttonHtml);
  });
};

const categoryBtnClickHandler = (element) => {
  const categoryBtns = document.querySelectorAll('.btn-category');
  categoryBtns.forEach((categoryBtn) => {
    categoryBtn.classList.remove('text-primary');
  });
  element.classList.add('text-primary');
  fetchNews(element.dataset.id, element.innerText);

  document.querySelector('.loading-animation').classList.remove('d-none');
};

const fetchNews = async (categoryId, categoryTitle) => {
  console.log(categoryId, categoryTitle);
  try {
    const response = await fetch(`https://openapi.programming-hero.com/api/news/category/${categoryId}`);
    const { data } = await response.json();
    renderNews(data, categoryTitle);
  } catch (error) {
    console.log(error);
  }
};

const renderNews = (newsData, categoryTitle) => {
  document.getElementById('item-found').innerText = `${newsData.length} items found for category ${categoryTitle}`;
  const sortedNewsData = newsData.sort((a, b) => b.total_view - a.total_view);
  console.log(sortedNewsData);
  const newsContainer = document.getElementById('news');
  newsContainer.innerHTML = '';
  sortedNewsData.forEach((data) => {
    newsContainer.insertAdjacentHTML('beforeend', newsCardHtml(data));
  });
  document.querySelector('.loading-animation').classList.add('d-none');
};

const newsCardHtml = (data) => {
  const { author, details, thumbnail_url, title, total_view } = data;
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const published_date =
    author.published_date === null ? 'N/A' : new Date(author.published_date).toLocaleDateString(undefined, options);

  return `<div class="card mb-5">
<div class="d-flex flex-column flex-md-row">
  <div class="flex-flex-shrink-0">
    <img class="card-thumb"
      src="${thumbnail_url}" alt="news thumbnail">
  </div>
  <div class="">
    <div class="card-body p-4">
      <div class="news-text">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${details.length > 190 ? details.slice(0, 190) : details}...</p>
      </div>
      <div class="d-flex align-items-center mt-3">
        <div class="author d-flex align-items-center me-5">
          <div class="author-img me-2">
            <img class="img-fluid rounded-circle" src="${author.img}" alt="author">
          </div>
          <div>
            <p class="author-name m-0">${author.name ? author.name : 'Anonymous Author'}</p>
            <p class="m-0 text-secondary fs-14">${published_date}</p>
          </div>
        </div>
        <div class="view ms-2 ms-md-5">
          <div class="d-flex align-items-center">
            <i class="fa-solid fa-binoculars me-2"></i>
            <p class="fw-bold m-0">${total_view === null ? 0 : total_view}</p>
          </div>
        </div>
        <button class="ms-auto border-0 bg-transparent text-primary">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</div>
</div>`;
};
