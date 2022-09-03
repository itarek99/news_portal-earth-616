// loading categories from api
(async () => {
  try {
    const response = await fetch('https://openapi.programming-hero.com/api/news/categories');
    const { data } = await response.json();
    const { news_category } = data;
    renderCategory(news_category);
  } catch (error) {
    console.error(error);
  }
})();

// render catagories
const renderCategory = (categories) => {
  const categoryContainer = document.getElementById('category');
  categories.forEach((category) => {
    // rendering active category
    if (category.category_id == '01') {
      const buttonHtml = `<button onclick='categoryBtnClickHandler(this)' data-id=${category.category_id} class="btn-category border-0 bg-transparent py-1 text-primary">${category.category_name}</button>`;
      categoryContainer.insertAdjacentHTML('beforeend', buttonHtml);
      console.log();
      fetchNews(category.category_id, category.category_name);
    } else {
      // render all other category
      const buttonHtml = `<button onclick='categoryBtnClickHandler(this)' data-id=${category.category_id} class="btn-category border-0 bg-transparent py-1">${category.category_name}</button>`;
      categoryContainer.insertAdjacentHTML('beforeend', buttonHtml);
    }
  });
};

// click handler for category button
const categoryBtnClickHandler = (element) => {
  // reset some element
  document.getElementById('news').innerHTML = '';
  document.getElementById('item-found').innerText = 'Loading Data...';
  // remove active class from category button
  const categoryBtns = document.querySelectorAll('.btn-category');
  categoryBtns.forEach((categoryBtn) => {
    categoryBtn.classList.remove('text-primary');
    categoryBtn.disabled = false;
  });
  // adding active class and disable button
  element.classList.add('text-primary');
  element.disabled = true;
  // calling fetchNews function with category id and category name
  fetchNews(element.dataset.id, element.innerText);
  // display loading spinner
  document.querySelector('.loading-animation').classList.remove('d-none');
};

// fetch news from api
const fetchNews = async (categoryId, categoryTitle) => {
  try {
    const response = await fetch(`https://openapi.programming-hero.com/api/news/category/${categoryId}`);
    const { data } = await response.json();
    renderNews(data, categoryTitle);
  } catch (error) {
    console.error(error);
  }
};

// render all news in a category
const renderNews = (newsData, categoryTitle) => {
  // item found in category text displaying
  document.getElementById('item-found').innerText = `${newsData.length} items found for category ${categoryTitle}`;
  // sorting data
  const sortedNewsData = newsData.sort((a, b) => b.total_view - a.total_view);
  const newsContainer = document.getElementById('news');
  newsContainer.innerHTML = '';
  // rendering data with forEach loop
  sortedNewsData.forEach((data) => {
    newsContainer.insertAdjacentHTML('beforeend', newsCardHtml(data));
  });
  // hide loading spinner
  document.querySelector('.loading-animation').classList.add('d-none');
};

// adding dynamic value in modal
const renderModal = (singleNewsData) => {
  // date locale string options
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  // object destructuring
  const { title, image_url, details, total_view, others_info, author } = singleNewsData;
  // dynamic value adding to modals elements
  document.getElementById('news-title').innerText = title;
  document.getElementById('modal-image').src = image_url;
  document.getElementById('modal-text').innerText = details;
  document.getElementById('total-view').innerText = !total_view ? 'Data N/A' : total_view;
  document.getElementById('trending').innerHTML = others_info.is_trending
    ? `<i class="fa-solid fa-arrow-trend-up"></i>`
    : `<i class="fa-solid fa-arrow-trend-down"></i>`;
  document.getElementById('modal-author-image').src = author.img;
  document.getElementById('modal-author-name').innerText = !author.name ? 'Data N/A' : author.name;
  document.getElementById('modal-published-date').innerText = !author.published_date
    ? 'Date N/A'
    : new Date(author.published_date).toLocaleDateString(undefined, options);
};

// fetching single news with news id
const fetchSingleNews = async (news_id) => {
  try {
    const response = await fetch(`https://openapi.programming-hero.com/api/news/${news_id}`);
    const { data } = await response.json();
    renderModal(data[0]);
  } catch (error) {
    console.error(error);
  }
};

// card html
const newsCardHtml = (data) => {
  // object destructing
  const { author, details, thumbnail_url, title, total_view, _id } = data;
  // options for toLocaleDateString
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  // convert data to locale date string
  const published_date = !author.published_date
    ? 'Date N/A'
    : new Date(author.published_date).toLocaleDateString(undefined, options);

  // returning html with dynamic value
  return `<div class="card mb-5 rounded-5">
              <div class="d-flex flex-column flex-md-row">
                <div class="flex-flex-shrink-0">
                  <img class="card-thumb" src="${thumbnail_url}" alt="news thumbnail">
                </div>
                <div class="w-100">
                  <div class="card-body p-3 p-md-4 h-100 d-flex flex-column">
                    <div class="news-text">
                      <h5 class="card-title" role="button">${title}</h5>
                      <p class="card-text mt-3">${details.length > 190 ? details.slice(0, 195) : details}...</p>
                    </div>
                    <div class="d-flex flex-wrap align-items-center mt-auto pt-4 ">
                      <div class="author d-flex align-items-center me-5">
                        <div class="author-img me-3">
                          <img class="img-fluid rounded-circle" src="${author.img}" alt="author">
                        </div>
                        <div>
                          <p class="author-name m-0">${!author.name ? 'Data N/A' : author.name}</p>
                          <p class="m-0 text-secondary fs-14">${published_date}</p>
                        </div>
                      </div>
                      <div class="view ms-0 ms-md-5">
                        <div class="d-flex align-items-center">
                          <i class="fa-solid fa-binoculars me-2"></i>
                          <p class="fw-bold m-0">${!total_view ? 'Data N/A' : total_view}</p>
                        </div>
                      </div>
                      <button onclick='fetchSingleNews("${_id}")' class="ms-auto border-0 bg-transparent text-primary"
                        data-bs-toggle="modal" data-bs-target="#newsModal">
                        <i class="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
            </div>
          </div>`;
};
