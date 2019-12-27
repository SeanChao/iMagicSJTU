async function loadAllCourses() {
    let guard = 0;
    while (guard++ < 800 && !(document.getElementById('more').style.display.trim() === 'none')) {
        loadCoursesByPaged();
        await sleep(100);
        console.log('load ' + guard + ' more times ');
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
    while (counts > 0) {
        queryCourse(this, '06', '9AA70497686C662DE0530200A8C043A1');
        console.log(counts);
        await sleep(c_interval);
    }
}

async function hack() {
    // loadAllCourses
    await loadAllCourses();

    // get all of the courses
    var counts = 1;
    const c_interval = 5000;
    a = document.querySelector("#contentBox")
    allCourses = document.querySelectorAll("#contentBox > div.tjxk_list > div.panel ");
    console.log('successfully load all ' + allCourses.length + ' courses');
    allCourses.forEach(course => {
        //         console.log(course); // log the whole block
        const courseName = course.querySelector("div > h3 > span > a").innerText;
        allClasses = course.querySelectorAll("div.panel-body > table > tbody > tr ");
        const classAmount = allClasses.length;
        console.log(courseName);
        allClasses.forEach(tClass => {
            courseObj = tClass.parentNode.parentNode.parentNode.parentNode.childNodes[0];
            loadJxbxxZzxk(courseObj);
            sleep(10000);
            const teacher = tClass.querySelector("td.jsxm").innerText;
            const prof = tClass.querySelector("td.jszc").innerText;
            const time = tClass.querySelector("td.sksj").innerText;
            const location = tClass.querySelector("td.jxdd").innerText;
            const selected = tClass.querySelector("td.rsxx > .jxbrs").innerText.toInt();
            const capacity = tClass.querySelector("td.rsxx > .jxbrl").innerText.toInt();
            selectBtnId = tClass.querySelector("td > button");
            const ok = selected < capacity;
            console.log('\t' + teacher + ' ' + prof + ' ' + time + ' ' + location + ' ' + selected + '/' + capacity + ' ' + ok.toString());
        }
        )
    }
    )
}

hack();
