window.addEventListener("load", async () => {
    try {
        const testimonials = await fetchTestimonial();
        if (testimonials && testimonials.length > 0) {
            displayTestimonial(testimonials);
        } else {
            showError("No testimonials available.");
        }

        $('.clients-carousel').owlCarousel({
            loop: true,
            nav: false,
            autoplay: true,
            autoplayTimeout: 5000,
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            smartSpeed: 450,
            margin: 30,
            responsive: {
                0: { items: 1 },
                768: { items: 2 },
                991: { items: 2 },
                1200: { items: 3 },
                1920: { items: 3 }
            }
        });
    } catch (error) {
        console.error('Error during page load:', error);
        showError('An error occurred while loading the page. Please try again later.');
    }
});

async function fetchTestimonial() {
    try {
        const response = await fetch('http://localhost:5500/data/testimonial.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return []; // Return an empty array to handle the error gracefully
    }
}

function displayTestimonial(testimonials) {
    const testimonialsDiv = document.getElementById('testimoinal-list');
    testimonialsDiv.innerHTML = '';
    
    testimonials.forEach(testimonial => {
        const testimonialDiv = document.createElement('div');
        testimonialDiv.className = 'single-box';
        testimonialDiv.innerHTML = `
            <div class="img-area"><img alt="" class="img-fluid" src="${testimonial.image}"></div>
            <div class="content">
                <p>${testimonial.content}</p>
                <h4>${testimonial.name}</h4>
            </div>
        `;
        testimonialsDiv.appendChild(testimonialDiv);
    });
}


