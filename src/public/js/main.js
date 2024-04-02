const sidebar = document.querySelector('.sidebar');
const navItems = sidebar.querySelectorAll('.nav:not(.sub-menu) > div > .nav-item');

switch (location.pathname) {
    case '/':
        navItems[0].classList.add('active');
        break;

    case '/user':
        navItems[1].classList.add('active');
        break;

    default:
        navItems.forEach((item) => item.classList.remove('active'));
        break;
}
