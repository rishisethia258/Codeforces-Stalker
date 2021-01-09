const form = document.querySelector('#searchForm2');
const btn = document.querySelector('#find');
var users = [];

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
        const handle = form.elements.query.value;
        await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
        console.log(handle);
        var ul = document.querySelector("#listOfUsers");
        ul.innerHTML += (`<li>${handle}</li>`);
        users.push(handle);
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
        console.log(ids);
        for (var i = 0; i < userStatus.length; i++) {
            console.log(userStatus[i]);
            for (var j = 0; j < userStatus[i].length; j++) {
                ids[userStatus[i][j].contestId] = false;
            }
        }
        var ul = document.querySelector("#ans");
        for (i in ids) {
            if (ids[i]) {
                ul.innerHTML += (`<li><a href="https://codeforces.com/contests/${i}">ContestId - ${i}</a></li>`);
            }
        }
    } catch {
        alert("Some error !!!");
    }
});
