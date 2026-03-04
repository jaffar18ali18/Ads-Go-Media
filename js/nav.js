// Responsive Navbar Toggle (shared for all pages)
document.addEventListener('DOMContentLoaded', function() {
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  if(navToggle && mainNav) {
    navToggle.addEventListener('click', function() {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      mainNav.classList.toggle('active');
    });
    // Close menu on link click (mobile UX)
    mainNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        if(window.innerWidth < 1024) {
          mainNav.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
});
