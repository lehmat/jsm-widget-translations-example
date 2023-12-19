const translations = {
  optional: 'Optional',
  submit: 'Submit',
  YourContactEmail: 'Your contact email',
  loadMore: 'load more',
  thanks: 'Thanks!',
  addAttachment: 'Add attachment',
  placeholder: 'How can we help?',
  contactUsAbout: 'Contact us about',
  learnAbout: 'Learn about',
  poweredByAtlassian: 'Powered by Atlassian',
};

async function translateOptionalText(reactRoot) {
  const elements = reactRoot.querySelectorAll('.optional');
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].textContent === ' (optional)') {
      elements[i].textContent = ` (${translations.optional})`;
    }
  }
}
async function translateSubmitButton(reactRoot) {
  const element = reactRoot.querySelector('#submit-button');
  if (element) {
    element.textContent = translations.submit;
  }
}
async function translateEmailLabel(reactRoot) {
  const element = reactRoot.querySelector('label[for="email"]');
  if (element) {
    const spanElement = element.querySelector('span');
    if (spanElement) {
      spanElement.textContent = translations.YourContactEmail;
    }
  }
}
async function translateButtons(reactRoot) {
  const elements = reactRoot.querySelectorAll('.ak-button__appearance-link');
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].textContent === 'Choose file') {
      elements[i].textContent = translations.addAttachment;
    }
    if (elements[i].textContent == 'Load more') {
      elements[i].textContent = translations.loadMore;
    }
  }
}
async function translateHowCanWeHelp(reactRoot) {
  const element = reactRoot.querySelector('.ak-field-text');
  if (element) {
    if (element && element.placeholder === 'How can we help?') {
      element.placeholder = translations.placeholder;
    }
  }
}
async function translateFooter(reactRoot) {
  const footerElement = reactRoot.querySelector('.powered-by');
  if (footerElement) {
    const aref = footerElement.querySelector('a');
    if (aref) {
      aref.textContent = translations.poweredByAtlassian;
    }
  }
}
async function translateH1Elements(reactRoot) {
  // Loop through all h1 elements and change the text if needed
  const h1Elements = reactRoot.querySelectorAll('h1');
  for (let i = 0; i < h1Elements.length; i++) {
    if (h1Elements[i].textContent === 'Contact us about') {
      h1Elements[i].textContent = translations.contactUsAbout;
    }
    if (h1Elements[i].textContent === 'Learn about') {
      h1Elements[i].textContent = translations.learnAbout;
    }
  }
}
async function translateH3Elements(reactRoot) {
  const h3Elements = reactRoot.querySelectorAll('h3')
  // Loop through all h3 elements
  for (let i = 0; i < h3Elements.length; i++) {
    // Check if the h3 element has the specific value
    if (h3Elements[i].textContent == 'Thanks!') {
      h3Elements[i].textContent = translations.thanks;
    }
  }
},

async function translateTexts(reactRoot) {
  translateHowCanWeHelp(reactRoot);
  translateH1Elements(reactRoot);
  translateH3Elements(reactRoot);
  translateFooter(reactRoot);
  translateEmailLabel(reactRoot);
  translateButtons(reactRoot);
  translateSubmitButton(reactRoot);
  translateOptionalText(reactRoot);
}

async function iframeLoad(iframe) {
  // wait for the iframe to load
  iframe.onload = () => {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const reactRoot = iframeDoc.querySelector('#react-root');

    // Create a new observer for reactRoot
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          translateTexts(reactRoot);
        }
      });
    });
    // Init the new observer
    observer.observe(reactRoot, { childList: true, subtree: true });
  };
}
async function addListenerForIframe() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        // Check if the element has been added
        const element = document.querySelector('#jsd-widget');
        if (element) {
          iframeLoad(element);
          observer.disconnect();
        }
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.setTimeout(() => {
    observer.disconnect();
  }, 5000); // Something wierd happends. Lets still clean it up to spead up browser
}

function init() {
  if (window.MutationObserver) {
    addListenerForIframe();
  }
}
