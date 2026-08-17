(function () {
  'use strict';

  var STORAGE_KEY = 'mottoEnquiryPopupShown';
  var WHATSAPP_NUMBER = '971582868358';
  var DELAY = 7000;
  var isArabic = document.documentElement.lang.toLowerCase().indexOf('ar') === 0;
  var forcePreview = new URLSearchParams(window.location.search).get('preview-popup') === '1';

  function getPageContext() {
    var heading = document.querySelector('h1');
    var canonical = document.querySelector('link[rel="canonical"]');
    return {
      title: heading ? heading.textContent.replace(/\s+/g, ' ').trim() : document.title,
      url: canonical ? canonical.href : window.location.href
    };
  }

  function hasShownThisSession() {
    if (document.cookie.split(';').some(function (entry) {
      return entry.trim() === STORAGE_KEY + '=1';
    })) return true;

    try {
      return window.sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch (error) {
      return false;
    }
  }

  function markAsShown() {
    document.cookie = STORAGE_KEY + '=1; Path=/; SameSite=Lax';

    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (error) {
      /* The prompt still works when storage is unavailable. */
    }
  }

  if (!forcePreview && hasShownThisSession()) return;

  var copy = isArabic ? {
    dialogLabel: 'إرسال استفسار إلى موتو للسيارات',
    close: 'إغلاق النموذج',
    brand: 'موتو',
    brandSub: 'للسيارات',
    eyebrow: 'لنتواصل',
    title: 'ندخل في صلب الموضوع. لنتحدث.',
    intro: 'أخبرنا بما تحتاج إليه وسنجهز رسالتك للمتابعة مباشرة عبر واتساب.',
    nameLabel: 'الاسم',
    namePlaceholder: 'اكتب اسمك',
    requirementLabel: 'المنتج المطلوب',
    selectPlaceholder: 'اختر منتجاً',
    submit: 'متابعة عبر واتساب',
    note: 'سيتم فتح واتساب برسالة جاهزة. لا يتم تخزين بياناتك على هذا الموقع.',
    greeting: 'مرحباً فريق MOTTO Automotive، اسمي {name}. أنا مهتم بـ {requirement}. وجدت هذا أثناء تصفح صفحة «{page}». أرجو التواصل معي لمناقشة المتطلبات. الصفحة: {url}',
    products: [
      'حوامل لوحات الأرقام',
      'الشعارات والشارات ثلاثية الأبعاد',
      'ميداليات المفاتيح المخصصة',
      'مظلات السيارات الشمسية المخصصة',
      'لوحات صالات العرض',
      'متطلبات أخرى'
    ]
  } : {
    dialogLabel: 'Send an enquiry to MOTTO Automotive',
    close: 'Close enquiry form',
    brand: 'MOTTO',
    brandSub: 'AUTOMOTIVE',
    eyebrow: 'Let us connect',
    title: 'Cut to the chase. Let\'s talk.',
    intro: 'Tell us what you need and we will prepare your enquiry for a direct WhatsApp conversation.',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    requirementLabel: 'What do you need?',
    selectPlaceholder: 'Select a product',
    submit: 'Continue on WhatsApp',
    note: 'This opens WhatsApp with a prepared enquiry. Your details are not stored on this website.',
    greeting: 'Hello MOTTO Automotive, my name is {name}. I am interested in {requirement}. I found this while viewing the page, "{page}". Please contact me to discuss my requirements. Page: {url}',
    products: [
      'Number Plate Holders',
      '3D Emblems and Badges',
      'Custom Keychains',
      'Custom Sunshades',
      'Showroom Plates',
      'Other Requirement'
    ]
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function buildPopup() {
    var popup = document.createElement('div');
    popup.className = 'enquiry-popup';
    popup.hidden = true;
    popup.innerHTML = [
      '<section class="enquiry-popup__dialog" role="dialog" aria-modal="true" aria-labelledby="enquiry-popup-title" aria-label="' + escapeHtml(copy.dialogLabel) + '">',
      '<div class="enquiry-popup__accent"></div>',
      '<button class="enquiry-popup__close" type="button" aria-label="' + escapeHtml(copy.close) + '">×</button>',
      '<div class="enquiry-popup__inner">',
      '<div class="enquiry-popup__brand">',
      '<img src="/assets/logo/motto-emblem-nav-104.avif" width="208" height="208" alt="" aria-hidden="true">',
      '<div><strong>' + escapeHtml(copy.brand) + '</strong><span>' + escapeHtml(copy.brandSub) + '</span></div>',
      '</div>',
      '<p class="enquiry-popup__eyebrow">' + escapeHtml(copy.eyebrow) + '</p>',
      '<h2 class="enquiry-popup__title" id="enquiry-popup-title">' + escapeHtml(copy.title) + '</h2>',
      '<p class="enquiry-popup__intro">' + escapeHtml(copy.intro) + '</p>',
      '<form class="enquiry-popup__form">',
      '<div class="enquiry-popup__field"><label for="enquiry-name">' + escapeHtml(copy.nameLabel) + '</label><input id="enquiry-name" name="name" type="text" autocomplete="name" maxlength="80" placeholder="' + escapeHtml(copy.namePlaceholder) + '" required></div>',
      '<div class="enquiry-popup__field"><label for="enquiry-requirement">' + escapeHtml(copy.requirementLabel) + '</label><select id="enquiry-requirement" name="requirement" required><option value="" selected disabled>' + escapeHtml(copy.selectPlaceholder) + '</option>' + copy.products.map(function (product) { return '<option value="' + escapeHtml(product) + '">' + escapeHtml(product) + '</option>'; }).join('') + '</select></div>',
      '<button class="enquiry-popup__submit" type="submit">',
      '<svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"></path></svg>',
      '<span>' + escapeHtml(copy.submit) + '</span>',
      '</button>',
      '<p class="enquiry-popup__note">' + escapeHtml(copy.note) + '</p>',
      '</form>',
      '</div>',
      '</section>'
    ].join('');
    return popup;
  }

  function openPopup(popup) {
    if (!forcePreview) markAsShown();
    popup.hidden = false;
    window.requestAnimationFrame(function () {
      popup.classList.add('is-open');
      document.documentElement.classList.add('has-enquiry-popup');
      var nameInput = popup.querySelector('#enquiry-name');
      if (nameInput) nameInput.focus({ preventScroll: true });
    });
  }

  function closePopup(popup) {
    popup.classList.remove('is-open');
    document.documentElement.classList.remove('has-enquiry-popup');
    window.setTimeout(function () { popup.hidden = true; }, 300);
  }

  function init() {
    var popup = buildPopup();
    document.body.appendChild(popup);

    var closeButton = popup.querySelector('.enquiry-popup__close');
    var form = popup.querySelector('.enquiry-popup__form');

    closeButton.addEventListener('click', function () { closePopup(popup); });
    popup.addEventListener('click', function (event) {
      if (event.target === popup) closePopup(popup);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && popup.classList.contains('is-open')) closePopup(popup);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;

      var name = form.elements.name.value.trim();
      var requirement = form.elements.requirement.value;
      var pageContext = getPageContext();
      var message = copy.greeting
        .replace('{name}', name)
        .replace('{requirement}', requirement)
        .replace('{page}', pageContext.title)
        .replace('{url}', pageContext.url);
      var whatsappUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

      closePopup(popup);
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });

    window.setTimeout(function () {
      if (forcePreview || !hasShownThisSession()) openPopup(popup);
    }, forcePreview ? 350 : DELAY);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
