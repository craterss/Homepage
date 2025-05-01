// ===== ОБЩИЕ ФУНКЦИИ ДЛЯ ВСЕХ СТРАНИЦ =====
document.addEventListener('DOMContentLoaded', function() {
    // 1. Плавная прокрутка (работает везде)
    smoothScroll();
    
    // 2. Проверяем, на какой странице находимся
    if (document.getElementById('projects-container')) {
        initPagination(); // Запускаем пагинацию только на странице проектов
    }
    
    if (document.querySelector('.featured-projects')) {
        initAnimations(); // Анимации для главной страницы
    }
});

// ===== ФУНКЦИИ ДЛЯ ГЛАВНОЙ СТРАНИЦЫ =====
function initAnimations() {
    const elements = document.querySelectorAll('section, .project-card');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 150 * index);
    });
}

function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ФУНКЦИИ ДЛЯ СТРАНИЦЫ ПРОЕКТОВ =====
function initPagination() {
    const projectsData = JSON.parse(document.getElementById('projects-data').textContent);
    const container = document.getElementById('projects-container');
    const pagination = document.getElementById('pagination');
    const projectsPerPage = 3;
    let currentPage = 1;

    function showProjects(page) {
        container.innerHTML = '';
        const start = (page - 1) * projectsPerPage;
        const end = start + projectsPerPage;
        
        projectsData.slice(start, end).forEach(project => {
            container.innerHTML += `
                <a href="${project.url}" class="project-tile">
                    <div class="project-image" style="background-image: url('${project.image}')"></div>
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </a>
            `;
        });
    }

    function updatePagination() {
        pagination.innerHTML = '';
        const pageCount = Math.ceil(projectsData.length / projectsPerPage);

        // Кнопка "Назад"
        if (currentPage > 1) {
            pagination.innerHTML += `<a href="#" class="page-number prev">&laquo;</a>`;
        }

        // Номера страниц
        for (let i = 1; i <= pageCount; i++) {
            pagination.innerHTML += `
                <a href="#" class="page-number ${i === currentPage ? 'active' : ''}">${i}</a>
            `;
        }

        // Кнопка "Вперед"
        if (currentPage < pageCount) {
            pagination.innerHTML += `<a href="#" class="page-number next">&raquo;</a>`;
        }

        // Обработчики событий
        document.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (this.classList.contains('prev')) {
                    currentPage--;
                } else if (this.classList.contains('next')) {
                    currentPage++;
                } else {
                    currentPage = parseInt(this.textContent);
                }

                showProjects(currentPage);
                updatePagination();
                window.scrollTo({top: 0, behavior: 'smooth'});
            });
        });
    }

    // Запуск
    showProjects(currentPage);
    updatePagination();
}