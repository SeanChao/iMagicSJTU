/**
 * WELCOME TO SJTU of Witchcraft and Wizardry
 * Version: v0.0.2-alpha
 */

var config = {
    // list all classes
    "listAll": true,
    // trigger auto select
    "auto": false,
    // how many times to run
    "times": 10,
    // TODO: add support for interval between getClass, ms
    "unitInterval": 1000,
    // retry interval of the whole task, ms
    "taskInterval": 10000,
    "semesterPrefix": "(2019-2020-2)-",
    // target courses, please follow the format below:
    "targetList": ["CH936-1", "BI916-1", "CH902-1", "MU901-3", "WA901-1", "HI948-1"],
    // Please change this to `true`
    "i_ve_read_this": false,
}

console.log('WELCOME TO SJTU of Witchcraft and Wizardry~ 😏');
if (!config['i_ve_read_this']) {
    console.log('哦！我向上帝发誓，老伙计，你一定得先修改 `config` 才能和隔壁家的玛丽太太一起去祈祷！');
} else {
    run(config);
}

async function run(config) {
    if (config.listAll) {
        document.querySelector("#nav_tab > li.active > a").click();
        await sleep(500);
        await showAllCourses();
        await listAllCoursesInfo();
    }

    const targetList = config['targetList'];
    for (var count = 0; (config.times == 0) ? true : (count < config.times); count++) {
        if (targetList.length == 0 || !config.auto) break;

        // refresh
        document.querySelector("#nav_tab > li.active > a").click();
        await sleep(500);
        await showAllCourses(false);
        await listAllCoursesInfo(false);
        //select
        if (config.times != 0)
            console.log('正在尝试第' + (count + 1) + '/' + config.times + '次');
        else
            console.log('正在尝试第' + (count + 1) + '次');
        await runGetClasses(targetList, config.unitInterval);
        console.log('让我睡个觉觉，' + config.taskInterval + "ms");
        await sleep(config.taskInterval);
    }
    console.log('👋Bye！');
}

async function showAllCourses(log = true) {
    console.debug('begin of showAllCourses');
    let guard = 0;
    while (guard++ < 1000 && !(document.getElementById('more').style.display.trim() === 'none')) {
        loadCoursesByPaged();
        await sleep(100);
        if (log)
            console.log('load ' + guard + ' more times ');
    }
    console.debug('end of showAllCourses')
}

function sleep(ms) {
    console.debug('set timer: ' + ms);
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function listAllCoursesInfo(log = true) {
    console.debug('begin of listAllCoursesInfo');
    // get all of the courses
    a = document.querySelector("#contentBox")
    allCourses = document.querySelectorAll("#contentBox > div.tjxk_list > div.panel ");
    for (course of allCourses) {
        //         console.log(course); // log the whole block
        const courseName = course.querySelector("div > h3 > span > a").innerText;
        const credits = course.querySelector("div > h3 > span > i").innerText;
        if (log) console.log(courseName + '\t' + credits);
        allClasses = course.querySelectorAll("div.panel-body > table > tbody > tr ");
        const classAmount = allClasses.length;
        for (tClass of allClasses) {
            courseObj = tClass.parentNode.parentNode.parentNode.parentNode.childNodes[0];
            await loadJxbxxZzxk(courseObj);
            await sleep(1);
            // have to just wait a moment for animation to be loaded
            const classId = tClass.querySelector('td.jxbmc > a').innerText;
            const teacher = tClass.querySelector("td.jsxm").innerText;
            const prof = tClass.querySelector("td.jszc").innerText;
            const time = tClass.querySelector("td.sksj").innerText;
            const location = tClass.querySelector("td.jxdd").innerText;
            const selected = tClass.querySelector("td.rsxx > .jxbrs").innerText.toInt();
            const capacity = tClass.querySelector("td.rsxx > .jxbrl").innerText.toInt();
            selectBtnId = tClass.querySelector("td > button");
            const ok = selected < capacity;
            if (log)
                console.log('\t- ' + teacher + ' ' + prof + ' ' + time + ' ' + location + ' ' + selected + '/' + capacity + ' ' + rate(selected, capacity) + '; id:' + classId);
        }
    }
    console.log('successfully load all ' + allCourses.length + ' courses under current conditions');
}

async function runGetClasses(targetList, interval) {
    const bufferedList = targetList.slice();
    // console.log(bufferedList);
    var promises = [];
    bufferedList.forEach((tClass) => {
        promises.push(getClass(config['semesterPrefix'] + tClass));
    }
    )
    await Promise.all(promises).then(async (res) => {// console.log(res);
        for (var idx = 0; idx < res.length; idx++) {//                     console.log(bufferedList[idx]);
            var name; if (res[idx] != 2) { name = (await getClassById(config['semesterPrefix'] + bufferedList[idx])).courseName; } switch (res[idx]) { case 0: { console.info('👏👏👏 选到「' + name + '」辣！'); targetList.splice(idx, 1); break; } case 1: { console.warn("😐 「" + name + "」被抢爆啦，稍后试试"); break; } case 2: { console.warn('🤔 当前页面上没有id为「' + bufferedList[idx] + '」的这门课哦'); break; } case 3: { console.info('😎 你已经有「' + name + '」啦！'); targetList.splice(idx, 1); break; } }
        }
    }, (err) => { console.log(err); })
    //         console.log(targetList);
}

function rate(selected, capacity) {
    if (selected >= capacity || capacity === 0) {
        return 'full';
    }
    const ratio = selected / capacity;
    if (capacity - selected <= 3) {
        return 'super hot';
    } else if (ratio >= 0.9) {
        return 'very hot';
    } else if (ratio >= 0.8) {
        return 'hot';
    } else if (ratio >= 0.6) {
        return 'normal';
    } else
        return 'deserted';
}

async function getClassById(tClassId) {
    //     console.log("[debug]===in getClassById===");
    const allClasses = document.querySelectorAll("td.jxbmc");
    for (tClass of allClasses) {
        if (tClass.querySelector("a").innerText === tClassId) {
            //                 console.log("Found " + tClassId + "!");
            p = tClass.parentNode;
            console.debug(p);
            const courseName = p.parentNode.parentNode.parentNode.parentNode.querySelector('.panel-title a').innerText;
            const tClassId = p.querySelector('td.jxbmc > a').innerText;
            const teacher = p.querySelector("td.jsxm").innerText;
            const prof = p.querySelector("td.jszc").innerText;
            const time = p.querySelector("td.sksj").innerText;
            const location = p.querySelector("td.jxdd").innerText;
            const numSelected = p.querySelector("td.rsxx > .jxbrs").innerText.toInt();
            const capacity = p.querySelector("td.rsxx > .jxbrl").innerText.toInt();
            const full = numSelected >= capacity;
            const selected = p.querySelector("button").innerText === '退选';
            const btn = p.querySelector("button");
            classJson = {
                "courseName": courseName,
                "tClassId": tClassId,
                "teacher": teacher,
                "prof": prof,
                "time": time,
                "location": location,
                "numSelected": numSelected,
                "capacity": capacity,
                "full": full,
                "selected": selected,
                "btn": btn,
            }
            //             console.log('\t- ' + teacher + ' ' + prof + ' ' + time + ' ' + location + ' ' + selected + '/' + capacity + ' ' + rate(selected, capacity) + '; id:' + classId);
            console.debug(classJson);
            return classJson;
        }
    }
    // console.warn("Class not found in current page. Please check the classId: " + tClassId);
    return null;
}

/**
 * return value: 
 *  0: take the class successfully;
 *  1: the class is full
 *  2: class doesn't exist in current page
 *  3: already had the course
 *  -1: other reasons leading to failure
 * @param {string}  classId teaching class id of the class
 * @returns {int}   state code
 */
async function getClass(classId) {
    target = await getClassById(classId);
    console.debug(target);
    if (target === null)
        return 2;
    else if (target.selected) {
        return 3;
    } else if (target.full) {
        return 1;
    }
    console.log('正在用靴子狠狠地抢' + target.courseName);
    target.btn.click();
    await sleep(100);
    target = await getClassById(classId);
    console.debug(target);
    if (target.selected) {
        return 0;
    } else
        return -1;
}
