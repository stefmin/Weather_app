import { import_Menu, get_api_data } from "./import_script.js";

import_Menu();

class RequestHandling {
    constructor(){
        this.date_of_arrival = null;
        this.date_of_departure = null;
        this.month_of_arrival = null;
        this.month_of_departure = null;
        this.year_of_arrival = null;
        this.year_of_departure = null;
        this.location = null;
        this.set_dates();
    }
    
    set_dates() {
        this.date_of_arrival = JSON.parse(localStorage.getItem('date_of_arrival'));
        this.date_of_departure = JSON.parse(localStorage.getItem('date_of_departure'));
        this.month_of_arrival = JSON.parse(localStorage.getItem('month_of_arrival'));
        this.month_of_departure = JSON.parse(localStorage.getItem('month_of_departure'));
        this.year_of_arrival = JSON.parse(localStorage.getItem('year_of_arrival'));
        this.year_of_departure = JSON.parse(localStorage.getItem('year_of_departure'));
        this.location = JSON.parse(localStorage.getItem('location'));
        console.log(this.date_of_arrival, this.date_of_departure, this.month_of_arrival, this.month_of_departure, this.year_of_arrival, this.year_of_departure, this.location);
    }

    async send_request() {
        let output = await get_api_data(this.date_of_arrival, this.date_of_departure, this.month_of_arrival, this.month_of_departure, this.year_of_arrival, this.year_of_departure, this.location);
        console.log(output);
        this.display_request(output);
    }

    delete_previous_data() {

        let generated_content = document.querySelector(".generated");
        if(generated_content != null)
        {
            generated_content.remove(generated_content)
        }
    }

    display_request(output) {
        let content = document.createElement('div');
        content.classList.add('generated');
        let para1 = output.paragraph_one;
        let title1 = output.title_one;
        let para2 = output.paragraph_two;
        let title2 = output.title_two;
        let para3 = output.paragraph_three;
        let title3 = output.title_three;

        let generated_title1 = document.createElement('h2');
        generated_title1.textContent = title1;
        content.appendChild(generated_title1);

        let generated_paragraph1 = document.createElement('div');
        generated_paragraph1.textContent = para1;
        content.appendChild(generated_paragraph1);

        let generated_title2 = document.createElement('h2');
        generated_title2.textContent = title2;
        content.appendChild(generated_title2);

        let generated_paragraph2 = document.createElement('div');
        generated_paragraph2.textContent = para2;
        content.appendChild(generated_paragraph2);

        let generated_title3 = document.createElement('h2');
        generated_title3.textContent = title3;
        content.appendChild(generated_title3);

        let generated_paragraph3 = document.createElement('div');
        generated_paragraph3.textContent = para3;
        content.appendChild(generated_paragraph3);
        document.body.appendChild(content);
    }
}

let submit_location = document.querySelector(".form_fields")

let req = new RequestHandling();

function setare_locatie(e){
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData(this);
    const location = formData.get("Location");
    if (location != "")
    {
        localStorage.setItem('location', JSON.stringify(location));
        this.reset();
        req.set_dates();
        req.delete_previous_data()
        req.send_request();
    }
}

submit_location.addEventListener("submit", setare_locatie)
