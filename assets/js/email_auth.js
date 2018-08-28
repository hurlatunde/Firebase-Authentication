(function ($) {
    "use strict";

    // Initialize Firebase
    const config = {
        apiKey: "AIzaSyB8_EPfEZWfBQLUrbWOTMTiZoByQQZIxwA",
        authDomain: "my-first-project-5961c.firebaseapp.com",
        databaseURL: "https://my-first-project-5961c.firebaseio.com",
        projectId: "my-first-project-5961c",
        storageBucket: "my-first-project-5961c.appspot.com",
        messagingSenderId: "281946839884"
    };
    firebase.initializeApp(config);

    const auth = firebase.auth();
    const database = firebase.database();


    //set up validate
    $.validate({
        modules: 'location, date, security, file',
    });

    function showLoading(show, element) {
        if (show === 'true') {
            $('#' + element).hide(100);
            $('#spinner').show(100);
        } else {
            $('#' + element).show(100);
            $('#spinner').hide(100);
        }
    }

    function alertTimeout(wait) {
        setTimeout(function () {
            $('#showAlert').children('.alert:first-child').remove();
        }, wait);
    }

    function showAlert(message, alertType) {
        var type;
        switch (alertType) {
            case 1:
                type = 'alert-success';
                break;
            case 2:
                type = 'alert-info';
                break;
            case 3:
                type = 'alert-warning';
                break;
            default :
                type = 'alert-danger';
        }

        const alert = '<div class="alert ' + type + ' alert-dismissible" role="alert">' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' + message + '</div>';
        $('#showAlert').html(alert);
        alertTimeout(3000);
    }

    /**
     *
     * @param formData element
     * @returns {Array of Objects}
     */
    function formToArray(element) {
        var formData = $("#" + element).serializeArray();
        var dataArray;
        dataArray = {};
        for (var i in formData) {
            dataArray[formData[i].name.trim()] = formData[i].value.trim();
        }
        return dataArray;
    }

    /**
     * Creating an account
     */
    $("#signUp").submit(function (e) {
        e.preventDefault();

        // show loading
        showLoading('true', 'div_holder');

        //get all input element as an array
        var formData = formToArray('signUp');

        //a little more validation
        if (formData.email.length < 4) {
            showAlert('Please enter an email address.');
            showLoading('false', 'div_holder');
            return;
        }
        if (formData.password.length < 4) {
            showAlert('Please enter a password.');
            showLoading('false', 'div_holder');
            return;
        }

        const email = formData.email;
        const password = formData.password;

        auth.createUserWithEmailAndPassword(email, password)
            .then(function (user) {
                console.log(user);
                saveCreatedAccount(formData, user, email);

            })
            .catch(function (error) {
                var errorCode = error.code;
                console.log(error);

                showAlert(errorCode);
                showAlert(error.message);
                showLoading('false', 'div_holder');
            });

        function saveCreatedAccount(formData, user, email) {
            // the unique id from the saved user
            var node_id = user.user.uid;

            formData.node_id = node_id;
            formData.email = email;
            formData.type = 'password';
            formData.created = new Date().valueOf();

            //save new user to data
            writeUserData(node_id, formData);
        }

        function writeUserData(node_id, formData) {
            database.ref('users/' + node_id).set(formData, function (error) {
                if (error) {
                    showAlert(error);
                    showLoading('false', 'div_holder');
                } else {
                    showAlert(node_id+' Saved. Please login', 1);
                    showLoading('false', 'div_holder');
                }
            });
        }

    });

})(jQuery);