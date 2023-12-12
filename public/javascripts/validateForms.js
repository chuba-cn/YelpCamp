(function () {
    'use strict'

    bsCustomFileInput.init();

    //Fetch all forms we want apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    //Loop over them and prevent form submission
    Array.from(forms).forEach(function (form){
        form.addEventListener('submit', function(event){
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    });
})()