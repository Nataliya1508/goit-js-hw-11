
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import { fetchImages } from './js/fetchImages';

const form = document.querySelector('.search-form');
const searchQuery = document.querySelector('.input');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');


let perPage = 40;
let page = 1;
let name = searchQuery.value;

loadMoreBtn.style.display = 'none';
form.addEventListener('submit', eventHandler);

async function eventHandler(evt) {
    evt.preventDefault();
    

    loadMoreBtn.style.display = 'none';
    gallery.innerHTML = '';
    page = 1;
    name = searchQuery.value;
    
     fetchImages(name, page, perPage)
    .then(name => {
        let totalPages = name.total/ perPage;
        // console.log(name)
        
        if (name.hits.length > 0) {
            Notiflix.Notify.success(`Hooray! We found ${name.total} images.`);
            renderGallery(name);
            new SimpleLightbox('.gallery a');
            loadMoreBtn.style.display = 'block';

            loadMoreBtn.addEventListener('click', () => {
                gallery.innerHTML = '';
                // loadMoreBtn.style.display = 'none';
            })
        }
            if (page < totalPages) {
                loadMoreBtn.style.display = 'block';
            } else {
                loadMoreBtn.style.display = 'none';
                 Notiflix.Notify.failure(
            "Sorry, there are no images matching your search query. Please try again."
                 );
                gallery.innerHTML = '';
            }
            
        })
            .catch(error => console.log('ERROR: ' + error));
}

function renderGallery(name) {
  const markup = name.hits
    .map(hit => {
      return `<div class="photo-card">
        <a class="gallery-item" href="${hit.largeImageURL}">
          <img
            class="gallery__image"
            src="${hit.webformatURL}"
            alt="${hit.tags}"
            loading="lazy"
        /></a>
        <div class="info">
          <div class="info__box">
            <p class="info-item">
            <b class="text-info">likes</b>
            </p>
            <p class="info-counter">${hit.likes.toLocaleString()}</p>
          </div>
          <div class="info__box">
            <p class="info-item">
            <b class="text-info">views</b>
            </p>
            <p class="info-counter">${hit.views.toLocaleString()}</p>
          </div>
          <div class="info__box">
            <p class="info-item">
            <b class="text-info">comments</b>
            </p>
            <p class="info-counter">${hit.comments.toLocaleString()}</p>
          </div>
          <div class="info__box">
            <p class="info-item">
            <b class="text-info">downloads</b>
            </p>
            <p class="info-counter">${hit.downloads.toLocaleString()}</p>
          </div>
        </div>
      </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

loadMoreBtn.addEventListener(
  'click',
    () => {
      
    name = searchQuery.value;
    page += 1;
    fetchImages(name, page, perPage).then(name => {
        let totalPages = name.total / perPage;
      renderGallery(name);
      new SimpleLightbox('.gallery a');
      if (page >= totalPages) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    });
  },
);
