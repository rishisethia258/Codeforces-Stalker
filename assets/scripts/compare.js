google.charts.load("current", { packages: ["corechart", 'bar', 'line'] });
google.charts.load("current", { packages: ["calendar"] });
const form = document.querySelector('#searchForm1');

const full = document.querySelector("#vis");

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const handle = form.elements.query.value;
    const handle2 = form.elements.query2.value;

    try {
        const userInfo = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
        const userStatus = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
        const userRating = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);

        const userInfo2 = await axios.get(`https://codeforces.com/api/user.info?handles=${handle2}`);
        const userStatus2 = await axios.get(`https://codeforces.com/api/user.status?handle=${handle2}`);
        const userRating2 = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle2}`);

        full.classList.remove("d-none");
        var langUsed = {};
        var verdict = {};
        var problemTag = {};
        var date = {};
        var heat = [];
        var ratingUser = [];
        var rankArr = [];
        var labelR = [];
        var problemRating = [];
        var problems = {};
        var tried = 0;
        var solved = 0;
        var avgAttempts = 0;
        var solvedWithOne = 0;
        var bestRank = 1e10;
        var worstRank = 0;

        for (var x in labelR) {
            labelR[x] = 0;
        }
        var langUsed2 = {};
        var verdict2 = {};
        var problemTag2 = {};
        var date2 = {};
        var heat2 = [];
        var ratingUser2 = [];
        var rankArr2 = [];
        var problemRating2 = [];
        var problems2 = {};
        var tried2 = 0;
        var solved2 = 0;
        var avgAttempts2 = 0;
        var solvedWithOne2 = 0;
        var bestRank2 = 1e10;
        var worstRank2 = 0;

        var currentRating = userInfo.data.result[0].rating;
        var maxRating = userInfo.data.result[0].maxRating;

        var currentRating2 = userInfo2.data.result[0].rating;
        var maxRating2 = userInfo2.data.result[0].maxRating;

        var totalContest = userRating.data.result.length;
        var totalContest2 = userRating2.data.result.length;

        for (var i = 0; i < userStatus.data.result.length; i++) {
            var sub = userStatus.data.result[i];

            var unixTime = sub.creationTimeSeconds;
            var ms = unixTime * 1000;
            var d1 = new Date(ms);
            var d2 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
            var val = d2.getTime() / 1000;
            if (date[val] === undefined) {
                date[val] = 1;
            } else {
                date[val]++;
            }

            var programmingLanguage = sub.programmingLanguage;
            if (langUsed[programmingLanguage] === undefined) {
                langUsed[programmingLanguage] = 1;
            } else {
                langUsed[programmingLanguage]++;
            }

            var prblm = sub.problem.name;
            if (problems[prblm] === undefined) {
                problems[prblm] = {};
                if (sub.verdict === "OK") {
                    problems[prblm].isSolved = true;
                    problems[prblm].attempts = 1;
                } else {
                    problems[prblm].attempts = 1;
                }
            } else {
                if (sub.verdict === "OK") {
                    problems[prblm].isSolved = true;
                    problems[prblm].attempts++;
                } else {
                    problems[prblm].attempts++;
                }
            }

            var ver = sub.verdict;
            if (verdict[ver] === undefined) {
                verdict[ver] = 1;
            } else {
                verdict[ver]++;
            }

            var tags = sub.problem.tags;
            for (var k = 0; k < tags.length; k++) {
                if (problemTag[tags[k]] === undefined) {
                    problemTag[tags[k]] = 1;
                } else {
                    problemTag[tags[k]]++;
                }
            }

            var rating = sub.problem.rating;
            if (ver == "OK" && rating != undefined) {
                if (problemRating[rating] === undefined) {
                    problemRating[rating] = 1;
                }
                else {
                    problemRating[rating]++;
                }
            }
        }

        for (var i = 0; i < userStatus2.data.result.length; i++) {
            var sub2 = userStatus2.data.result[i];

            var unixTime2 = sub2.creationTimeSeconds;
            var ms2 = unixTime * 1000;
            var d12 = new Date(ms);
            var d22 = new Date(d12.getFullYear(), d12.getMonth(), d12.getDate());
            var val = d22.getTime() / 1000;
            if (date2[val] === undefined) {
                date2[val] = 1;
            } else {
                date2[val]++;
            }

            var programmingLanguage2 = sub2.programmingLanguage;
            if (langUsed2[programmingLanguage2] === undefined) {
                langUsed2[programmingLanguage2] = 1;
            } else {
                langUsed2[programmingLanguage2]++;
            }

            var ver2 = sub2.verdict;
            if (verdict2[ver2] === undefined) {
                verdict2[ver2] = 1;
            } else {
                verdict2[ver2]++;
            }

            var tags2 = sub2.problem.tags;
            for (var k = 0; k < tags2.length; k++) {
                if (problemTag2[tags2[k]] === undefined) {
                    problemTag2[tags2[k]] = 1;
                } else {
                    problemTag2[tags2[k]]++;
                }
            }

            var prblm2 = sub2.problem.name;
            if (problems2[prblm2] === undefined) {
                problems2[prblm2] = {};
                if (sub2.verdict === "OK") {
                    problems2[prblm2].isSolved = true;
                    problems2[prblm2].attempts = 1;
                } else {
                    problems2[prblm2].attempts = 1;
                }
            } else {
                if (sub2.verdict === "OK") {
                    problems2[prblm2].isSolved = true;
                    problems2[prblm2].attempts++;
                } else {
                    problems2[prblm2].attempts++;
                }
            }

            var rating2 = sub2.problem.rating;
            if (ver2 == "OK" && rating2 != undefined) {
                if (problemRating2[rating2] === undefined) {
                    problemRating2[rating2] = 1;
                }
                else {
                    problemRating2[rating2]++;
                }
            }
        }

        for (i in problems) {
            tried++;
            if (problems[i].isSolved) {
                solved++;
                avgAttempts += problems[i].attempts;
                if (problems[i].attempts === 1) {
                    solvedWithOne++;
                }
            }
        }
        if (solved != 0) {
            avgAttempts /= solved;
        }


        for (i in problems2) {
            tried2++;
            if (problems2[i].isSolved) {
                solved2++;
                avgAttempts2 += problems2[i].attempts;
                if (problems2[i].attempts === 1) {
                    solvedWithOne2++;
                }
            }
        }
        if (solved2 != 0) {
            avgAttempts2 /= solved2;
        }

        for (var i = 0; i < userRating.data.result.length; i++) {
            var sub = userRating.data.result[i];
            var rating = sub.newRating;

            var label = sub.ratingUpdateTimeSeconds;
            labelR[i] = label;
            ratingUser[label] = rating;
            var rank = sub.rank;
            rankArr[label] = rank;
            labelFinal = label;
            if (bestRank > rank) {
                bestRank = rank;
            }
            if (worstRank < rank) {
                worstRank = rank;
            }
        }
        for (var i = 0; i < userRating2.data.result.length; i++) {
            var sub = userRating2.data.result[i];
            var rating = sub.newRating;

            var label = sub.ratingUpdateTimeSeconds;
            labelR[i + (userRating.data.result.length)] = label;
            ratingUser2[label] = rating;
            var rank = sub.rank;
            rankArr2[label] = rank;
            if (bestRank2 > rank) {
                bestRank2 = rank;
            }
            if (worstRank2 < rank) {
                worstRank2 = rank;
            }
        }
        labelR.sort();

        // Building Table
        var table = document.querySelector("#compareTable");
        document.querySelector("#handle1").innerText = handle;
        document.querySelector("#handle2").innerText = handle2;
        document.querySelector("#tried1").innerText = tried;
        document.querySelector("#tried2").innerText = tried2;
        document.querySelector("#solved1").innerText = solved;
        document.querySelector("#solved2").innerText = solved2;
        document.querySelector("#unsolved1").innerText = tried - solved;
        document.querySelector("#unsolved2").innerText = tried2 - solved2;
        document.querySelector("#avgAttempts1").innerText = avgAttempts.toFixed(2);
        document.querySelector("#avgAttempts2").innerText = avgAttempts2.toFixed(2);
        document.querySelector("#oneSub1").innerText = solvedWithOne;
        document.querySelector("#oneSub2").innerText = solvedWithOne2;
        document.querySelector("#bestRank1").innerText = bestRank;
        document.querySelector("#bestRank2").innerText = bestRank2;
        document.querySelector("#worstRank1").innerText = worstRank;
        document.querySelector("#worstRank2").innerText = worstRank2;

        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {

            var data1 = google.visualization.arrayToDataTable([
                ['Rating', handle, handle2],
                ["current rating", currentRating, currentRating2],
                ["max rating", maxRating, maxRating2],
            ]);
            var classicOptions1 = {
                width: 400,
                height: 450,
                legend: 'none',
                'backgroundColor': '#DDDDDD',
                series: {
                    0: { targetAxisIndex: 0 },
                },
                title: 'Current and max rating of both users',
                vAxes: {
                    0: { title: 'rating' },
                },
                vAxis: {
                    minValue: 0,
                },
                'fontName': 'Arial',
                'fontSize': '15'
            }

            var data2 = google.visualization.arrayToDataTable([
                ['Contest', "total number of contest"],
                [handle, totalContest],
                [handle2, totalContest2],
            ]);

            var classicOptions2 = {
                width: 400,
                height: 450,
                'backgroundColor': '#DDDDDD',
                legend: 'none',
                series: {
                    0: { targetAxisIndex: 0 },
                },
                title: 'Total contest given by both users',
                vAxes: {
                    0: { title: 'contests' },
                },
                vAxis: {
                    minValue: 0,
                },

                fontSize: 15,
                fontName: 'Arial'

            }

            function drawClassicChart() {
                var classicChart1 = new google.visualization.ColumnChart(chart_1);
                classicChart1.draw(data1, classicOptions1);

                var classicChart2 = new google.visualization.ColumnChart(chart_2);
                classicChart2.draw(data2, classicOptions2);
            }
            drawClassicChart();


            var data4 = new google.visualization.DataTable();
            data4.addColumn('date', 'label');
            data4.addColumn('number', handle);
            data4.addColumn('number', handle2);
            for (var x of labelR) {
                data4.addRow([new Date(x * 1000), ratingUser[x], ratingUser2[x]]);

            }
            var option4 = {
                'title': 'Rating over time',
                'backgroundColor': '#DDDDDD',
                interpolateNulls: true,
                'width': 900,
                'height': 500,

                fontSize: 15,
                fontName: 'Arial'

            };
            var chart4 = new google.visualization.LineChart(document.getElementById('chart_4'));
            chart4.draw(data4, option4);



            var data5 = new google.visualization.DataTable();
            data5.addColumn('date', 'label');
            data5.addColumn('number', handle);
            data5.addColumn('number', handle2);
            for (var x of labelR) {
                data5.addRow([new Date(x * 1000), rankArr[x], rankArr2[x]]);
            }
            var option5 = {
                'title': 'Rank over time',
                interpolateNulls: true,
                'width': 900,
                'backgroundColor': '#DDDDDD',
                'height': 500,
                'fontName': 'Arial',
                'fontSize': '15'
            };
            var chart5 = new google.visualization.LineChart(document.getElementById('chart_5'));
            chart5.draw(data5, option5);

            var data7 = new google.visualization.DataTable();
            data7.addColumn('string', 'Problem_Rating');
            data7.addColumn('number', `${handle}`);
            data7.addColumn('number', `${handle2}`);
            for (var x in problemRating) {
                data7.addRow([x, problemRating[x], problemRating2[x]]);
            }
            var option7 = {
                'title': 'Problem Ratings',
                'width': 600,
                'backgroundColor': '#DDDDDD',
                'height': 800,
                legend: 'none',

                fontSize: 15,
                fontName: 'Arial'

            };
            var chart7 = new google.visualization.BarChart(document.getElementById('chart_7'));
            chart7.draw(data7, option7);

            var data8 = new google.visualization.DataTable()
            data8.addColumn('string', 'Problem_Tag');
            data8.addColumn('number', `${handle}`);
            data8.addColumn('number', `${handle2}`);
            for (var x in problemTag) {
                data8.addRow([x, problemTag[x], problemTag2[x]]);
            }

            var classicOptions8 = {
                width: 1100,
                height: 450,
                'backgroundColor': '#DDDDDD',
                series: {
                    0: { targetAxisIndex: 0 },
                },
                title: 'Solved problems according to Tag',
                vAxes: {
                    0: { title: 'rating' },
                },
                vAxis: {
                    minValue: 0,
                },

                fontSize: 15,
                fontName: 'Arial'

            }
            function drawClassicChart1() {
                var classicChart8 = new google.visualization.ColumnChart(chart_8);
                classicChart8.draw(data8, classicOptions8);
            }
            drawClassicChart1()

        }
    } catch (error) {
        alert("User not found !!!");
    }
});
