let baseUrl = "https://ec2-100-27-4-13.compute-1.amazonaws.com:5000"
let $submitDesignFormContainer = $('#submitDesignFormContainer');
if ($submitDesignFormContainer.length != 0) {
    console.log('Submit design form detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit design details
    //to server-side api when the #submitButton element fires the click event.
    $('#submitButton').on('click', function (event) {
        event.preventDefault();
        let userId = localStorage.getItem('token');
        let designTitle = $('#designTitleInput').val();
        let designDescription = $('#designDescriptionInput').val();
        let webFormData = new FormData();
        webFormData.append('designTitle', designTitle);
        webFormData.append('designDescription', designDescription);
        // HTML file input, chosen by user
        webFormData.append("file", document.getElementById('fileInput').files[0]);
        axios({
            method: 'post',
            url: baseUrl + '/api/user/process-submission',
            data: webFormData,
            headers: { 'Content-Type': 'multipart/form-data', 'user': "Bearer " + userId }
        })
            .then(function (response) {
                Noty.overrideDefaults({
                    callbacks: {
                        onTemplate: function () {
                            if (this.options.type === 'systemresponse') {
                                this.options.text = escapeHtml(this.options.text);
                                this.options.imageURL = escapeHtml(this.options.imageURL);

                                this.barDom.innerHTML = '<div class="my-custom-template noty_body">';
                                this.barDom.innerHTML += '<div class="noty-header">Message</div>';
                                this.barDom.innerHTML += '<p class="noty-message-body">' + this.options.text + '</p>';
                                this.barDom.innerHTML += '<img src="' + this.options.imageURL + '">';
                                this.barDom.innerHTML += '</div>';
                            }
                        }
                    }
                })

                new Noty({
                    type: 'systemresponse',
                    layout: 'topCenter',
                    timeout: '50000',
                    text: 'File submission completed.',
                    // text: response.data.message,
                    imageURL: response.data.imageURL
                }).show();
            })
            .catch(function (response) {
                //Handle error
                console.dir(response);
                new Noty({
                    type: 'error',
                    timeout: '6000',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Unable to submit design file.',
                }).show();
            });
    });

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
} //End of checking for $submitDesignFormContainer jQuery object