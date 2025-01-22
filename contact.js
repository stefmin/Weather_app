
let submit = document.querySelector(".form_fields button");

class Submit_trigger {
    constructor() {
        submit.addEventListener('click', this.new_message.bind(this))
    }

    new_message(){
        this.change_icon();
    } 

    change_icon(){
        let animation = document.querySelector(".animated_jpeg");
        let form_title = document.querySelector(".form_fields h1");
        animation.style.backgroundImage = "url('resources/contact/email_file.gif')"; 
        form_title.textContent = "Message sent sucesfully"

        setTimeout( () => {
            window.location.href = 'contact.html';
        }, 4000)
    }
}

let submit_actions = new Submit_trigger();
