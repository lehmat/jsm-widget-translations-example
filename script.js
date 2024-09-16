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
  const elements = reactRoot.querySelectorAll('.optional:not([data-translated="true"])');
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].textContent === ' (optional)') {
      elements[i].textContent = ` (${translations.optional})`;
      elements[i].setAttribute('data-translated', 'true');
    }
  }
}
async function translateSubmitButton(reactRoot) {
  const element = reactRoot.querySelector('#submit-button:not([data-translated="true"])');
  if (element) {
    element.textContent = translations.submit;
    element.setAttribute('data-translated', 'true');
  }
}
async function translateEmailLabel(reactRoot) {
  const element = reactRoot.querySelector('label[for="email"]:not([data-translated="true"])')
  if (element) {
    element.innerHTML = element.innerHTML.replace(
      'Your contact e-mail',
      translations.YourContactEmail,
    )
    element.setAttribute('data-translated', 'true')
  }
}

async function translateHowCanWeHelp(reactRoot) {
  const element = reactRoot.querySelector('[data-ds--text-field--input="true"]:not([data-translated="true"])');
  if (element) {
    if (element && element.placeholder === 'How can we help?') {
      element.placeholder = translations.placeholder;
      element.setAttribute('data-translated', 'true');
    }
  }
}
async function translateFooter(reactRoot) {
  const footerElement = reactRoot.querySelector('.powered-by');
  if (footerElement) {
    const aref = footerElement.querySelector('a:not([data-translated="true"])');
    if (aref) {
      aref.textContent = translations.poweredByAtlassian;
      aref.setAttribute('data-translated', 'true');
    }
  }
}
async function translateElements(reactRoot, element) {
  // Loop through all h1 elements and change the text if needed
  const elements = reactRoot.querySelectorAll(`${element}:not([data-translated="true"])`);
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].textContent === 'Contact us about') {
      elements[i].textContent = translations.contactUsAbout;
      elements[i].setAttribute('data-translated', 'true');
    }
    if (elements[i].textContent === 'Learn about') {
      elements[i].textContent = translations.learnAbout;
      elements[i].setAttribute('data-translated', 'true');
    }
    if (elements[i].textContent == 'Thanks!') {
      elements[i].textContent = translations.thanks;
      elements[i].setAttribute('data-translated', 'true');
    }
    if (elements[i].textContent === 'Choose file') {
      elements[i].textContent = translations.addAttachment;
      elements[i].setAttribute('data-translated', 'true');

    }
    if (elements[i].textContent == 'Load more') {
      elements[i].textContent = translations.loadMore;
      elements[i].setAttribute('data-translated', 'true');
    }
    if (elements[i].textContent === 'Choose file') {
      elements[i].textContent = translations.addAttachment;
      elements[i].setAttribute('data-translated', 'true');

    }
    if (elements[i].textContent == 'Load more') {
      elements[i].textContent = translations.loadMore;
      elements[i].setAttribute('data-translated', 'true');
    }
  }
}

async function translateTexts(reactRoot) {
  translateHowCanWeHelp(reactRoot);
  translateElements(reactRoot, 'h1');
  translateElements(reactRoot, 'h2');
  translateElements(reactRoot, 'h3');
  translateElements(reactRoot, 'span');
  translateFooter(reactRoot);
  translateEmailLabel(reactRoot);
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
