
export function import_Menu(){
    let menu_selector = document.querySelector(".menu_content");
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
                    element = new Weather_now(this.menu_element, e.target);
                    break;
                case 'About us': 
                    element = new About_us(e.target);
                    break;
                case 'Contact': 
                    element = new Contact(this.menu_element, e.target);
                    break;
                case 'Home':
                    element = new Home(this.menu_element, e.target);
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
            window.location.href = 'index.html';
            calendar.classList.add('animation_for_calendar');
        }
    }

    class Weather_now extends Menu {
        constructor(menu_element, tag_ref) {
            super(menu_element);
            this.tag_ref = tag_ref;
        }
        event_function() {
            window.location.href = 'weather_now.html';
        }
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
    const main_menu = new Menu(menu_selector);
    menu_selector.addEventListener('click', main_menu.reference_func);
}


export function import_Storage(){
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
            for (let i=parsed_review_content[0]; i >= 1; i--) {
                let img = document.createElement('div');
                img.classList.add('star_icon');
                review_container.appendChild(img);
            }
            
            review_title.textContent = parsed_review_content[1];
            review_text.textContent = parsed_review_content[2];
        }
    
        calculate_average_rating() {
            let sum = 0; 
            let current_rating;
            let count = 0;
            for (let i = 0; i< localStorage.length; i++) {
                current_rating = JSON.parse(localStorage.getItem(localStorage.key(i)));
                if ((Array.isArray(current_rating)) && typeof current_rating[0] === "number")
                {
                    sum += current_rating[0];
                    count += 1;
                }
                console.log(sum)
            }
            let average = sum / count;
            console.log(average)
            this.update_average(average);
            return this.average;
        }
    
        update_average(average) {
            let average_element = document.querySelector(".reviews_gallery h2")
            average_element.textContent = `Average score: ${average}/5`;
        }
    }
    
    class Reviews {
        constructor(){
            this.review_elements = document.querySelectorAll('.review');
            const observer = new IntersectionObserver(this.animate_reviews_fade_in.bind(this), {threshold: 0.2});
            this.review_elements.forEach(review_element => { observer.observe(review_element)})
        }
    
        animate_reviews_fade_in(reviews, observer) {
            for (let review of reviews) {
                if (review.isIntersecting){
                    review.target.classList.add("animated_review");
                }
                else 
                {
                    review.target.classList.remove("animated_review")
                }
            }
        }
    }
    
    let reviews_storage = new Storage();
    let reviews_post_animation = new Reviews();
}

export async function get_api_data(date1, date2, month1, month2, year1, year2, location){
    const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

    const apiKey = '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';

    const requestBody = {
    model: 'llama-3.3-70b-versatile',
    messages: [
        {
        role: 'system',
        content: 'You are a helpful assistant that outputs JSON based on the schema provided.'
        },
        { role: 'user', content: `What will the weather in ${location} be between ${date1} ${month1} ${year1} and ${date2} of ${month2} ${year2}? 
        (you can give an average in celsius degrees) What three activities do you reccomend doing
        during this time while visiting the city? Please give a detailed answer in three paragraphs with minimum 300 words/paragraph and maximum 350 words/paragraph
        and include a timetable of the location of each activity if such a timetable exists. Provide the response in the specified JSON schema.` }
    ],
    max_tokens: 2000,
    temperature: 0.7,
    tools: [
        {
        type: "function",
        function: {
            name: "getWeather",
            description: "Fetch the weather for a given location and give a detailed travel advice for that specific location, specifying activities based on the weather.",
            parameters: {
                type: "object",
                properties: {
                    location: {
                        type: "string",
                        description: "City or location name"
                    },
                    temperature: {
                        type: "string",
                        description: "Current temperature in Celsius"
                    },
                    condition: {
                        type: "string",
                        description: "Current weather condition (e.g., sunny, rainy)"
                    },
                    humidity: {
                        type: "string",
                        description: "Humidity percentage"
                    },
                    wind_speed: {
                        type: "string",
                        description: "Wind speed in km/h"
                    },
                    title_one: {
                        type: "string", 
                        description: "A title for the first suggested activity"
                    },
                    paragraph_one: {
                        type: "string",
                        description: "Description of the location and timetable of the first suggested activity in a paragraph"
                    },
                    title_two: {
                        type: "string", 
                        description: "A title for the second suggested activity"
                    },
                    paragraph_two: {
                        type: "string",
                        description: "Description of the location and timetable of the second suggested activity in a paragraph"
                    },
                    title_three: {
                        type: "string", 
                        description: "A title for the third suggested activity"
                    },
                    paragraph_three: {
                        type: "string",
                        description: "Description of the location and timetable of the third suggested activity in a paragraph"
                    }
                },
                required: ["location", "condition", "title_one", "paragraph_one", "title_two", "paragraph_two", "title_three", "paragraph_three"]
            }
        }
        }
    ],
    tool_choice: {
        type: "function",
        function: { name: "getWeather" }
    }
    };

    return fetch(apiUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
    })
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {

        let output;
        if (data.choices[0]?.message?.tool_calls) {
            const toolCall = data.choices[0].message.tool_calls[0];
            try {
                output = JSON.parse(toolCall.function.arguments);
            } catch (error) {
                console.error('Failed to parse arguments:', error);
                output = null;
            }
        } else {
            output = 'No structured output available';
        }
        console.log('Model Output:', output);
        return output;
    })
    .catch(error => {
        console.error('Request failed:', error);
        throw error
    });
}
