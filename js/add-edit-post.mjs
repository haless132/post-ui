import postApi from './api/postApi.js';
import AppConstants from './appConstants.js';

const setFormValues = (post) => {
  const postImgElement = document.querySelector('#postHeroImage');
  if (postImgElement) {
    postImgElement.style.backgroundImage = `url(${post.imageUrl})`;
  }

  const formElement = document.querySelector('#postForm');

  const titleInpus = formElement.querySelector('#postTitle');
  if (titleInpus) {
    titleInpus.value = post.title;
  }

  const authorInpus = formElement.querySelector('#postAuthor');
  if (authorInpus) {
    authorInpus.value = post.author;
  }

  const descriptionInput = formElement.querySelector('#postDescription');
  if (descriptionInput) {
    descriptionInput.value = post.description;
  }
};

const handleChangeImageClick = () => {
  const randomId = 1 + Math.trunc(Math.random() * 1000);

  const imageUrl = `https://picsum.photos/id/${randomId}/${AppConstants.DEFAULT_IMAGE_WIDTH}/${AppConstants.DEFAULT_IMAGE_HEIGHT}`;

  const element = document.querySelector('#postHeroImage');
  if (element) {
    element.style.backgroundImage = `url(${imageUrl})`;
    element.addEventListener('error', handleChangeImageClick);
  }
};

const changeBackgroundButton = document.querySelector('#postChangeImage');
if (changeBackgroundButton) {
  changeBackgroundButton.addEventListener('click', handleChangeImageClick);
}

const getImageUrlFromString = (str) => {
  const firstDoubleQuotePosition = str.indexOf('"');
  const lastDoubleQuotePosition = str.lastIndexOf('"');
  return str.slice(firstDoubleQuotePosition + 1, lastDoubleQuotePosition);
};

const getFormValues = () => {
  // if (!form) return;
  const formvalues = {};

  const titleElement = document.querySelector('#postTitle');
  if (titleElement) {
    formvalues.title = titleElement.value;
  }

  const authorElement = document.querySelector('#postAuthor');
  if (titleElement) {
    formvalues.author = authorElement.value;
  }

  const discriptionElement = document.querySelector('#postDescription');
  if (titleElement) {
    formvalues.description = discriptionElement.value;
  }

  const postImageElement = document.querySelector('#postHeroImage');
  if (postImageElement) {
    formvalues.imageUrl = getImageUrlFromString(postImageElement.style.backgroundImage);
  }
  return formvalues;
};

const validateForm = () => {
  let isValid = true;

  // title is required
  const titleElement = document.querySelector('#postTitle');
  const title = titleElement.value;
  if (!title) {
    titleElement.classList.add('is-invalid');
    isValid = false;
  }

  // author is required
  const authorElement = document.querySelector('#postAuthor');
  const author = authorElement.value;
  if (!author) {
    authorElement.classList.add('is-invalid');
    isValid = false;
  }

  return isValid;
};

const handleFormSubmit = async (postId) => {
  const formValues = getFormValues();
  // console.log(formValues);

  const isValid = validateForm(formValues);

  if (!isValid) return;
  try {
    if (postId) {
      const savePostButtonElement = document.querySelector('#savePostButton');
      savePostButtonElement.innerHTML =
        '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>Loading...';
      savePostButtonElement.disabled = true;

      formValues.id = postId;
      const newUpPost = await postApi.update(formValues);
      alert('Save post successfully');
      window.location = `./post-detail.html?id=${newUpPost.id}`;
    } else {
      const savePostButtonElement = document.querySelector('#savePostButton');

      savePostButtonElement.innerHTML =
        '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>Loading...';

      savePostButtonElement.disabled = true;

      const newPost = await postApi.add(formValues);

      window.location = `./post-detail.html?id=${newPost.id}`;

      alert('Add new post successfully');
    }
  } catch (error) {
    console.log("Can't update data", error);
  }
};

(async () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');
  const isEditMode = !!postId;

  if (isEditMode) {
    try {
      const post = await postApi.get(postId);
      setFormValues(post);

      const goToDetailPageLink = document.querySelector('#goToDetailPageLink');
      goToDetailPageLink.href = `./post-detail.html?id=${post.id}`;
      goToDetailPageLink.innerHTML = '<i class="fas fa-eye mr-1"></i> View post detail';
    } catch (error) {
      console.log(error);
    }
  } else {
    handleChangeImageClick();
  }

  const formElement = document.querySelector('#postForm');
  if (formElement) {
    formElement.addEventListener('submit', (e) => {
      handleFormSubmit(postId);
      e.preventDefault();
    });
  }

  const imageElement = document.querySelector('#postHeroImage');
  if (imageElement) {
    imageElement.onerror = handleChangeImageClick;
  }
})();
