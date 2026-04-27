// Common utilities for Online Car Sale website

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }

  // Highlight current page in navigation
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navAnchors = document.querySelectorAll('.nav-links a');

  navAnchors.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage ||
        (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
});
