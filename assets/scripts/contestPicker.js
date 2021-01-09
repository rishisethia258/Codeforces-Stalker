const form = document.querySelector('#searchForm2');
const btn = document.querySelector('#find');
const reset = document.querySelector('#reset');
var users = [];

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
        const handle = form.elements.query.value;
        await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
        var ul = document.querySelector("#listOfUsers");
        ul.innerHTML += (`<tr><td>${handle}</td></tr>`);
        users.push(handle);
        document.querySelector("#t1").classList.remove("d-none");
    } catch {
        alert("User Not Found");
    }
});

btn.addEventListener('click', async function (e) {
    e.preventDefault();
    try {
        var userStatus = [];
        for (var i = 0; i < users.length; i++) {
            var v = await axios.get(`https://codeforces.com/api/user.status?handle=${users[i]}`);
            userStatus.push(v.data.result);
        }
        var contests = await axios.get(`https://codeforces.com/api/contest.list?gym=false`);
        var ids = {};

        for (var i = 0; i < contests.data.result.length; i++) {
            var u = contests.data.result[i].id;
            ids[u] = true;
        }
        for (var i = 0; i < userStatus.length; i++) {
            console.log(userStatus[i]);
            for (var j = 0; j < userStatus[i].length; j++) {
                ids[userStatus[i][j].contestId] = false;
            }
        }
        var ul = document.querySelector("#ans");
        for (var i = 0; i < contests.data.result.length; i++) {
            var u = contests.data.result[i].id;
            var v = contests.data.result[i].name;
            if (ids[u]) {
                ul.innerHTML += (`<tr><td><a href="https://codeforces.com/contests/${u}">${v}</a></td></tr>`);
            }
        }

        document.querySelector("#t2").classList.remove("d-none");
    } catch {
        alert("Some error !!!");
    }
});

reset.addEventListener('click', async function (e) {
    e.preventDefault();
    users = [];
    var ul = document.querySelector("#listOfUsers");
    ul.innerHTML = '';
    var vl = document.querySelector("#ans");
    vl.innerHTML = '';
    document.querySelector("#t1").classList.add("d-none");
    document.querySelector("#t2").classList.add("d-none");
});


