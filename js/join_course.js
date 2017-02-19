function sendSignUpJSON(coursekey) {
    $.ajax({
        url: BACKEND_BASE_URL + 'courses/join',
        type : 'POST',
        dataType : 'json',
        contentType: 'application/json',
        data : JSON.stringify(coursekey),
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success : function(data) {
            console.log("Success!");
            console.log(data);
            var alert = '<div id="join_course_alert" class="alert alert-success" role="alert">' + data.message + '</div>';
            $('#join_course_group').prepend(alert);
        },
        error: function(data) {
            console.log("Fail!");
            var alert = '<div id="join_course_alert" class="alert alert-danger" role="alert">' + JSON.parse(data.responseText).error + '</div>';
            $('#join_course_group').prepend(alert);
        }
    });
}

function createCourseView(data) {
    Object.keys(data).forEach(function(courseName) {
        var course = data[courseName];
        var name = course.coursename;
        var sd = new Date(course.startdate);
        var ed = new Date(course.enddate);
        var formattedTime = `${sd.getDate()}.${sd.getMonth() + 1} – ${ed.getDate()}.${ed.getMonth() + 1}`;

        var template = `<header><h1>${name}</h1><h2 style="display: inline-block; color: #666666">${formattedTime}</h2></header>`;

        $('#courseList').append(template);
    });
}

function getMyCourses() {
    var restfulURL = 'students/' + session_user.has_sign_in.id + '/courses';

    $.ajax({
        url: BACKEND_BASE_URL + restfulURL,
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
            console.log(data);
            createCourseView(data);
        },
    });

}

$( document ).ready(function() {

    getMyCourses();

    $("#joiningForm").on('submit', function (e) {
        $('#join_course_alert').remove();
        var data = $(this).serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        sendSignUpJSON(data);
        e.preventDefault();
    });

});