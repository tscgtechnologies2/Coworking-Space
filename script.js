/**
 * Coworking Space Web App Script
 * Interactions: Mobile menu, header change on scroll, pricing toggle with counter animation,
 * FAQ accordion, pricing click-to-contact scroll prefill, form validation, and scroll reveal.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Mobile Navigation Menu Toggle
  // ==========================================
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

  const toggleMenu = () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('open');
    // Prevent body scrolling when menu is open on mobile
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  };

  navToggle.addEventListener('click', toggleMenu);

  // Close menu when clicking links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // ==========================================
  // 2. Header Style on Scroll
  // ==========================================
  const header = document.getElementById('header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initially in case page loaded scrolled

  // ==========================================
  // 3. Membership Pricing Toggle & Animation
  // ==========================================
  const pricingToggle = document.getElementById('pricingToggle');
  const labelMonthly = document.getElementById('toggle-monthly-label');
  const labelAnnual = document.getElementById('toggle-annual-label');
  const priceAmounts = document.querySelectorAll('.price-amount');
  
  // Set initial active state
  labelMonthly.classList.add('active');

  const animatePriceChange = (element, targetValue) => {
    const startVal = parseInt(element.textContent, 10);
    const endVal = parseInt(targetValue, 10);
    
    if (startVal === endVal) return;

    const duration = 250; // ms
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime >= duration) {
        element.textContent = endVal;
        return;
      }
      const progress = elapsedTime / duration;
      // Ease out quad formula
      const easeVal = progress * (2 - progress);
      const currentVal = Math.round(startVal + (endVal - startVal) * easeVal);
      element.textContent = currentVal;
      requestAnimationFrame(updateCounter);
    };

    requestAnimationFrame(updateCounter);
  };

  pricingToggle.addEventListener('click', () => {
    const isAnnual = pricingToggle.getAttribute('aria-pressed') === 'true';
    pricingToggle.setAttribute('aria-pressed', !isAnnual);
    pricingToggle.classList.toggle('active');

    if (!isAnnual) {
      // Switched to Annual
      labelMonthly.classList.remove('active');
      labelAnnual.classList.add('active');
      priceAmounts.forEach(price => {
        const annualVal = price.getAttribute('data-annual');
        animatePriceChange(price, annualVal);
      });
    } else {
      // Switched to Monthly
      labelAnnual.classList.remove('active');
      labelMonthly.classList.add('active');
      priceAmounts.forEach(price => {
        const monthlyVal = price.getAttribute('data-monthly');
        animatePriceChange(price, monthlyVal);
      });
    }
  });

  // ==========================================
  // 4. FAQ Accordion Handling
  // ==========================================
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const answer = faqItem.querySelector('.faq-answer');
      const isExpanded = question.getAttribute('aria-expanded') === 'true';

      // Close all other open FAQ items first
      faqQuestions.forEach(otherQuestion => {
        if (otherQuestion !== question) {
          otherQuestion.setAttribute('aria-expanded', 'false');
          otherQuestion.parentElement.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Toggle current FAQ
      if (!isExpanded) {
        question.setAttribute('aria-expanded', 'true');
        // Set max-height to its scrollHeight (natural content size)
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      }
    });
  });

  // ==========================================
  // 5. Select Plan Prefill and Smooth Scroll
  // ==========================================
  const selectPlanBtns = document.querySelectorAll('.select-plan-btn');
  const inputInterest = document.getElementById('inputInterest');
  const inputTeamSize = document.getElementById('inputTeamSize');

  selectPlanBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const planName = btn.getAttribute('data-plan');
      if (inputInterest && planName) {
        inputInterest.value = planName;
        
        // Auto set corresponding team size suggestions for better UX
        if (planName === 'Flexible Pass') {
          inputTeamSize.value = '1';
        } else if (planName === 'Pro Desk') {
          inputTeamSize.value = '1';
        } else if (planName === 'Private Office') {
          inputTeamSize.value = '2-5';
        }
        
        // Clear any previous error styling
        inputInterest.parentElement.parentElement.classList.remove('error');
        inputTeamSize.parentElement.parentElement.classList.remove('error');
      }
    });
  });

  // ==========================================
  // 6. Contact Form Validation & Success State
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const formSuccessOverlay = document.getElementById('formSuccessOverlay');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');

  // Input elements
  const inputName = document.getElementById('inputName');
  const inputEmail = document.getElementById('inputEmail');
  const inputMessage = document.getElementById('inputMessage');

  // Helper validation functions
  const isEmail = (email) => {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  };

  const checkRequired = (inputEl, errorElId) => {
    const value = inputEl.value.trim();
    const group = inputEl.closest('.form-group');
    if (!value) {
      group.classList.add('error');
      return false;
    } else {
      group.classList.remove('error');
      return true;
    }
  };

  const checkEmail = (inputEl) => {
    const value = inputEl.value.trim();
    const group = inputEl.closest('.form-group');
    if (!value) {
      group.classList.add('error');
      document.getElementById('emailError').textContent = 'Email is required';
      return false;
    } else if (!isEmail(value)) {
      group.classList.add('error');
      document.getElementById('emailError').textContent = 'Please enter a valid email';
      return false;
    } else {
      group.classList.remove('error');
      return true;
    }
  };

  // Add dynamic input listeners to remove error highlight on keypress/change
  const inputs = [inputName, inputEmail, inputInterest, inputTeamSize, inputMessage];
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group.classList.contains('error')) {
          group.classList.remove('error');
        }
      });
      input.addEventListener('change', () => {
        const group = input.closest('.form-group');
        if (group.classList.contains('error')) {
          group.classList.remove('error');
        }
      });
    }
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate each input field
    const isNameVal = checkRequired(inputName, 'nameError');
    const isEmailVal = checkEmail(inputEmail);
    const isInterestVal = checkRequired(inputInterest, 'interestError');
    const isTeamVal = checkRequired(inputTeamSize, 'teamSizeError');
    const isMessageVal = checkRequired(inputMessage, 'messageError');

    const isFormValid = isNameVal && isEmailVal && isInterestVal && isTeamVal && isMessageVal;

    if (isFormValid) {
      // Simulate form submission success state
      formSuccessOverlay.classList.add('active');
    }
  });

  // Close overlay and reset form
  closeSuccessBtn.addEventListener('click', () => {
    formSuccessOverlay.classList.remove('active');
    contactForm.reset();
  });

  // ==========================================
  // 7. Scroll Reveal Intersection Observer
  // ==========================================
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // viewport
      threshold: 0.15, // trigger when 15% of element is in view
      rootMargin: '0px 0px -50px 0px' // adjust bottom margin
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after revealing to prevent repeating animation
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      observer.observe(el);
    });
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(el => el.classList.add('visible'));
  }
});
