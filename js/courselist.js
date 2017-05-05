let myCourses;

class CourseList {

  static createCourseList(data) {
    myCourses = data;
    for (let i in data) {
      this._createListItem(data[i]);
    }
    // place a listener when collapse is opened
    $('header h1 a').click(function () {
      const scoreboard = new Scoreboard();
      scoreboard.init(data, this.id);
    });

    $('.btn-exit').click(function () {
      CourseList._removeFromCourse();
    });
  }

  static _createListItem(data) {
    const sd = new Date(data.startdate);
    const ed = new Date(data.enddate);
    const formattedTime = `${sd.getDate()}.${sd.getMonth() + 1}.${sd.getFullYear().toString().substr(2,2)} – ${ed.getDate()}.${ed.getMonth() + 1}.${ed.getFullYear().toString().substr(2,2)}`;
    let listItem = view.createListItem(data, formattedTime);
    $(".courseList").append(listItem);
  }

  init() {
    let role = 'teachers';
    if (window.location.pathname.includes("/omat_kurssit")) {
      role = 'students';
    }

    backend.get(`${role}/${Session.getUserId()}/courses`)
      .then(
        function fulfilled(data) {
          CourseList.createCourseList(data);
        },
        function rejected() {
          console.warn("Could not retrieve course keys");
        }
      );
  }

  static _removeFromCourse() {
        $("#leaveCourse").on('click', function () {
            let coursekey = $("#coursekeyRemove").val();
            let courseId;
            for (let i in myCourses) {
                if (coursekey === myCourses[i].coursekey) {
                    courseId = myCourses[i].id;
                    backend.delete(`students/${Session.getUserId()}/courses/${courseId}`);
                    $('#remove_course_alert').html("Olet poistunut kurssilta " + myCourses[i].html_id + " " + myCourses[i].name).show();
                    $('#remove_course_alert').attr("class", "alert alert-success");
                    break
                } else {
                    $('#remove_course_alert').html('Kurssia ei löytynyt').show();
                }
            }
        });
  }
}

/**
 * Execute when DOM has loaded, get teacher's scoreboards
 */
$(document).ready(function () {
  const courselist = new CourseList();
  courselist.init();
});
