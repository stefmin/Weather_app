import { import_Menu, import_Storage } from "./import_script.js";

import_Menu();
import_Storage();

let traveller_button = document.querySelector(".container_below_menu_cloud_image button");
let calendar = document.querySelector(".calendar_selection");

function show_calendar()
{
    calendar.classList.add('animation_for_calendar');
}

traveller_button.addEventListener('click', show_calendar);

let date_1_selected = 0;
let date_2_selected = 0;
let retain_color_index = 0;

class Calendar {
    calendar_animation(date, type_of_animation) {
        let date_styles = window.getComputedStyle(date);
        const colors = ["#FFCC00", "#FF6F61", "#3CB371", "#FFA07A", "#20B2AA"];

        if (date_styles.backgroundColor === 'rgb(192, 133, 128)')
        {
            if (retain_color_index === 0)
            {
                const randomIndex = Math.floor(Math.random() * colors.length);
                retain_color_index = randomIndex;
                date.style.backgroundColor = `${colors[randomIndex]}`;

                let month = document.getElementById('months');
                let year = document.getElementById('year');
                localStorage.setItem('month_of_arrival', JSON.stringify({ value: month.value, selectedIndex: month.selectedIndex }));
                localStorage.setItem('year_of_arrival', JSON.stringify({ value: year.value, selectedIndex: year.selectedIndex }));
            }
            else
            { 
                date.style.backgroundColor = `${colors[retain_color_index]}`;
                retain_color_index = 0;
            }
        }
        else
        {
            date.style.backgroundColor = '';
            retain_color_index = 0;
        }
    }

    relocate_window() {
        const month = document.getElementById('months');
        const year = document.getElementById('year');
        const selected_month = month.value;
        const selected_year = year.value;
        localStorage.setItem('year_of_departure', JSON.stringify(selected_year));
        localStorage.setItem('month_of_departure', JSON.stringify(selected_month));
        localStorage.setItem('date_of_arrival', JSON.stringify(date_1_selected));
        localStorage.setItem('date_of_departure', JSON.stringify(date_2_selected));
        window.location.href = 'weather_now.html';
    }
}

let calendar_functionality = new Calendar();

function select_dates(e) {
    e.stopPropagation();
    e.preventDefault();
    if (Number.isInteger(parseInt(e.target.textContent))) {
        if (date_1_selected === 0) {
            date_1_selected = parseInt(e.target.textContent);
            calendar_functionality.calendar_animation(e.target);
        }
        else {
            if (date_1_selected === parseInt(e.target.textContent)) {
                calendar_functionality.calendar_animation(e.target);
                date_1_selected = 0;
            }
            else {
                const month = document.getElementById('months');
                const year = document.getElementById('year');
                if((JSON.parse(localStorage.getItem('year_of_arrival')).selectedIndex < year.selectedIndex) || ((JSON.parse(localStorage.getItem('year_of_arrival')).selectedIndex === year.selectedIndex) && (JSON.parse(localStorage.getItem('month_of_arrival')).selectedIndex < month.selectedIndex))
                    || ((date_1_selected < parseInt(e.target.textContent)) && (JSON.parse(localStorage.getItem('month_of_arrival')).selectedIndex === month.selectedIndex) && (JSON.parse(localStorage.getItem('year_of_arrival')).selectedIndex === year.selectedIndex)))
                {
                    let y = JSON.parse(localStorage.getItem('year_of_arrival')).value;
                    let m = JSON.parse(localStorage.getItem('month_of_arrival')).value;
                    localStorage.setItem('month_of_arrival', JSON.stringify(m));
                    localStorage.setItem('year_of_arrival', JSON.stringify(y));
                
                    date_2_selected = parseInt(e.target.textContent);
                    calendar_functionality.calendar_animation(e.target);
                    calendar_functionality.relocate_window();
                }    
            }
        }
    }
    else {
        date_2_selected = 0;
    }
}

calendar.addEventListener('click', select_dates);