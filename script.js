
let menu_selector = document.querySelector(".menu_content");
let traveller_button = document.querySelector(".container_below_menu_cloud_image button");
let calendar = document.querySelector(".calendar_selection");

// Menu functionality

class Menu {
    constructor(menu_element) {
        this.menu_element = menu_element;
    }

    reference_func(e, menu_element) {
        e.stopPropagation();
        e.preventDefault();
        let element;
        switch (e.target.textContent) {
            case 'Traveler\'s guide': 
                element = new Traveller(this.menu_element, e.target);
                break;
            case 'Weather now': 
                element = new Weather_now(e.target);
                break;
            case 'About us': 
                element = new About_us(e.target);
                break;
            case 'Contact': 
                element = new Contact(e.target);
                break;
            case 'Home':
                element = new Home(e.target);
                break;
        }
        element.event_function();
    }
}

class Traveller extends Menu {
    constructor(menu_element, tag_ref) {
        super(menu_element);
        this.tag_ref = tag_ref;
    }
    event_function() {
        calendar.classList.add('animation_for_calendar');
        // if (window.location.href !== "index.html"){
        //     window.location.href = "index.html";
        // }
        // style.display
    }
}

class Weather_now extends Menu {
    // constructor(tag_ref) {
    //     this.tag_ref = tag_ref;
    // }
    // event_function() {
        
    // }
}

class About_us extends Menu {
    // constructor(menu_element, tag_ref) {
    //     super(menu_element);
    //     this.tag_ref = tag_ref;
    // }
    // event_function() {
    //     calendar.classList.remove('animation_for_calendar');
    // }
}

class Contact extends Menu {
    constructor(menu_element, tag_ref) {
        super(menu_element);
        this.tag_ref = tag_ref;
    }
    event_function() {
        window.location.href = 'contact.html';
    }
}

class Home extends Menu {
    constructor(menu_element, tag_ref) {
        super(menu_element);
        this.tag_ref = tag_ref;
    }
    event_function() {
        window.location.href = 'index.html';
    }
}

function show_calendar()
{
    calendar.classList.add('animation_for_calendar');
}

const main_menu = new Menu(menu_selector);

traveller_button.addEventListener('click', show_calendar);
menu_selector.addEventListener('click', main_menu.reference_func);


// Reviews functionality



class Storage {
    constructor() {
        this.default_reviews_data = {
            review1: [4, "Constantin Andrei" ,`This weather-based travel suggestion site is really innovative! The app does a good job recommending destinations based on my preferences
                 and current conditions. However, I think the recommendations could be a little more tailored to specific activities I enjoy.`],
            review2: [4, "Gheorghita Andrei", `I love how this site generates travel suggestions based on the weather! It makes planning my trips so much easier, 
                especially when I want to avoid bad weather. The AI is helpful, but I’d like to see a bit more variety in the options. Overall, a great tool!`],
            review3: [5, "Popescu Sebastian", `Amazing! This website is a game-changer for planning trips around weather conditions. It’s so easy to use,
                 and the suggestions feel personalized. I’ve discovered so many new places I wouldn't have considered otherwise. Highly recommend!`],
            review4: [5, "Dumitrescu Cosmin", `I’m absolutely hooked! The AI-powered travel recommendations based on weather are spot-on and super convenient. 
                I love how it helps me plan trips based on what the forecast looks like. It’s definitely become my go-to tool for travel planning!`]
        };
        this.index_of_review = 0;
        for( const review in this.default_reviews_data ) {
            const review_content = this.default_reviews_data[`${review}`];
            this.post_review_to_storage(review, review_content);
            this.post_default_review_to_page(review, review_content, this.index_of_review);
            this.index_of_review += 1;
        }

        this.average = 0;
        this.average = this.calculate_average_rating();
    }

    post_review_to_storage(review, review_content) {
        localStorage.setItem(`${review}`, JSON.stringify(review_content));
    }

    post_default_review_to_page(review, review_content, index) {
        let parsed_review_content = JSON.parse(localStorage.getItem(`${review}`));
        let review_container = document.querySelectorAll('.review .stars')[index];
        let review_title = document.querySelectorAll('.review .review_title')[index];
        let review_text = document.querySelectorAll('.review .review_text')[index];
        // review_container.textContent = parsed_review_content[0];
        for (let i=parsed_review_content[0]; i >= 1; i--) {
            let img = document.createElement('div');
            // img.src = 'resources/star-solid.svg';
            // img.alt = 'image not loaded';
            img.classList.add('star_icon');
            review_container.appendChild(img);
        }
        
        review_title.textContent = parsed_review_content[1];
        review_text.textContent = parsed_review_content[2];
        // review_text.offsetHeight;s
    }

    calculate_average_rating() {
        let sum = 0; 
        let current_rating;
        for (let i = 0; i< localStorage.length; i++) {
            current_rating = JSON.parse(localStorage.getItem(localStorage.key(i)))[0];
            sum += current_rating
        }
        let average = sum / localStorage.length;
        this.update_average(average);
        return this.average;
    }

    update_average(average) {
        let average_element = document.querySelector(".reviews_gallery h2")
        average_element.textContent = `Average score: ${average}/5`;
    }
    // function load_data_to_review(stars, title, short_text) {
        
    // }
}

class Reviews {
    constructor(){
        this.review_elements = document.querySelectorAll('.review');
        const observer = new IntersectionObserver(this.animate_reviews_fade_in.bind(this), {threshold: 0.2});
        this.review_elements.forEach(review_element => { observer.observe(review_element)})
        // for (let review_element in this.review_elements) {
        //     observer.observe(review_element);
        // }
    }

    animate_reviews_fade_in(reviews, observer) {
        for (let review of reviews) {
            if (review.isIntersecting){
                review.target.classList.add("animated_review");
                // observer.unobserve(review.target);
            }
            else 
            {
                review.target.classList.remove("animated_review")
            }
        }
    }
}

reviews_storage = new Storage();
reviews_post_animation = new Reviews();

