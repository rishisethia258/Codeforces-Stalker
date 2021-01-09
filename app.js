google.charts.load("current", { packages: ["corechart"] });
google.charts.load("current", { packages: ["calendar"] });
const form = document.querySelector('#searchForm');
const table1 = document.querySelector('#table1');
const table2 = document.querySelector('#table2');
var langUsed = {};
var verdict = {};
var problemTag = {};
var date = {};
var heat = [];
var ratingUser = [];
var rankArr = [];
var labelR = [];
var problemRating = [];
var tagAccuracy = {};
var problems = {};
var tried = 0;
var solved = 0;
var avgAttempts = 0;
var solvedWithOne = 0;
var contestGiven = 0;
var bestRank = 1e10;
var worstRank = 0;
var strong = [];
var weak = [];

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const handle = form.elements.query.value;
    try {
        const userInfo = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
        const userStatus = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
        const userRating = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
        // console.log(userStatus.data);

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

            var ver = sub.verdict;
            if (verdict[ver] === undefined) {
                verdict[ver] = 1;
            } else {
                verdict[ver]++;
            }

            var tags = sub.problem.tags;
            for (var k = 0; k < tags.length; k++) {
                if (sub.verdict === "OK") {
                    if (tagAccuracy[tags[k]] === undefined) {
                        tagAccuracy[tags[k]] = 1;
                    } else {
                        tagAccuracy[tags[k]]++;
                    }
                }
                if (problemTag[tags[k]] === undefined) {
                    problemTag[tags[k]] = 1;
                } else {
                    problemTag[tags[k]]++;
                }
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


        for (var i = 0; i < userRating.data.result.length; i++) {
            var sub = userRating.data.result[i];
            var rating = sub.newRating;
            ratingUser[i] = rating;
            var label = sub.ratingUpdateTimeSeconds;
            labelR[i] = label;
            var rank = sub.rank;
            rankArr[i] = rank;
            if (bestRank > rank) {
                bestRank = rank;
            }
            if (worstRank < rank) {
                worstRank = rank;
            }
        }
        contestGiven = userRating.data.result.length;

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
        avgAttempts /= solved;


        for (i in tagAccuracy) {
            if (problemTag[i] != 0) {
                tagAccuracy[i] /= problemTag[i];
                tagAccuracy[i] *= 100;
            } else {
                tagAccuracy[i] = 0;
            }
        }
        var ta = tagAccuracy;
        google.charts.setOnLoadCallback(drawChart);

        var maxi = 0;
        var ind;
        for (i in tagAccuracy) {
            if (tagAccuracy[i] >= maxi) {
                maxi = tagAccuracy[i];
                ind = i;
            }
        }
        strong.push(ind);
        ind = '';
        maxi = 0;
        for (i in tagAccuracy) {
            if (i != strong[0] && tagAccuracy[i] >= maxi) {
                maxi = tagAccuracy[i];
                ind = i;
            }
        }
        strong.push(ind);
        ind = '';
        maxi = 0;
        for (i in tagAccuracy) {
            if (i != strong[0] && i != strong[1] && tagAccuracy[i] >= maxi) {
                maxi = tagAccuracy[i];
                ind = i;
            }
        }
        strong.push(ind);
        ind = '';
        maxi = 0;

        var mini = 1e10;
        ind = '';
        for (i in tagAccuracy) {
            if (tagAccuracy[i] <= mini) {
                mini = tagAccuracy[i];
                ind = i;
            }
        }
        weak.push(ind);
        ind = '';
        mini = 1e10;
        for (i in tagAccuracy) {
            if (i != weak[0] && tagAccuracy[i] <= mini) {
                mini = tagAccuracy[i];
                ind = i;
            }
        }
        weak.push(ind);
        ind = '';
        mini = 1e10;
        for (i in tagAccuracy) {
            if (i != weak[0] && i != weak[1] && tagAccuracy[i] <= mini) {
                mini = tagAccuracy[i];
                ind = i;
            }
        }
        weak.push(ind);

        // Building Strongest Weakest Topic Table
        table1.classList.toggle("d-none");
        var stng1 = document.querySelector("#stng-1");
        stng1.innerText = strong[0];
        var stng2 = document.querySelector("#stng-2");
        stng2.innerText = strong[1];
        var stng3 = document.querySelector("#stng-3");
        stng3.innerText = strong[2];
        var weak1 = document.querySelector("#weak-1");
        weak1.innerText = weak[0];
        var weak2 = document.querySelector("#weak-2");
        weak2.innerText = weak[1];
        var weak3 = document.querySelector("#weak-3");
        weak3.innerText = weak[2];

        // Building table of Some Numbers
        table2.classList.toggle("d-none");
        var info1 = document.querySelector("#info-1");
        info1.innerText = tried;
        var info2 = document.querySelector("#info-2");
        info2.innerText = solved;
        var info3 = document.querySelector("#info-3");
        info3.innerText = avgAttempts.toFixed(2);
        var info4 = document.querySelector("#info-4");
        info4.innerText = solvedWithOne;
        var info5 = document.querySelector("#info-5");
        info5.innerText = contestGiven;
        var info6 = document.querySelector("#info-6");
        info6.innerText = bestRank;
        var info7 = document.querySelector("#info-7");
        info7.innerText = worstRank;


        function drawChart() {

            // Language 
            var data1 = new google.visualization.DataTable();
            data1.addColumn('string', 'language');
            data1.addColumn('number', 'countOfLanguage');
            for (var lang in langUsed) {
                data1.addRow([lang, langUsed[lang]]);
            }
            var option1 = {
                'title': 'languages used by user',
                'width': 400,
                'height': 300
            };
            var chart1 = new google.visualization.PieChart(document.getElementById('chart_1'));
            chart1.draw(data1, option1);


            // Verdict
            var data2 = new google.visualization.DataTable();
            data2.addColumn('string', 'verdict');
            data2.addColumn('number', 'countOfVerdict');
            for (var verd in verdict) {
                data2.addRow([verd, verdict[verd]]);
            }
            var option2 = {
                'title': 'Verdicts by user',
                'width': 400,
                'height': 300
            };
            var chart2 = new google.visualization.PieChart(document.getElementById('chart_2'));
            chart2.draw(data2, option2);


            // Problem Tag
            var data3 = new google.visualization.DataTable();
            data3.addColumn('string', 'Tag');
            data3.addColumn('number', 'countOfTag');
            for (var tag in problemTag) {
                data3.addRow([tag, problemTag[tag]]);
            }
            var option3 = {
                'title': 'problem tags solved used by user',
                'width': 400,
                'height': 300
            };
            var chart3 = new google.visualization.PieChart(document.getElementById('chart_3'));
            chart3.draw(data3, option3);


            // Rating 
            var data4 = new google.visualization.DataTable();
            data4.addColumn('date', 'label');
            data4.addColumn('number', 'rating');
            for (var x in ratingUser) {
                data4.addRow([new Date(labelR[x] * 1000), ratingUser[x]]);
            }
            var option4 = {
                'title': 'Rating over time',
                'width': 900,
                'height': 500
            };
            var chart4 = new google.visualization.LineChart(document.getElementById('chart_4'));
            chart4.draw(data4, option4);


            // Rank
            var data5 = new google.visualization.DataTable();
            data5.addColumn('date', 'label');
            data5.addColumn('number', 'rank');
            for (var x in ratingUser) {
                data5.addRow([new Date(labelR[x] * 1000), rankArr[x]]);
            }
            var option5 = {
                'title': 'Rank over time',
                'width': 900,
                'height': 500
            };
            var chart5 = new google.visualization.LineChart(document.getElementById('chart_5'));
            chart5.draw(data5, option5);


            // Problem Rating
            var data6 = new google.visualization.DataTable();
            data6.addColumn('string', 'Problem_Rating');
            data6.addColumn('number', 'Number_Of_Such_Rating');
            for (var x in problemRating) {
                data6.addRow([x, problemRating[x]]);
            }
            var option6 = {
                'title': 'Problem Ratings',
                'width': 600,
                'height': 800
            };
            var chart6 = new google.visualization.BarChart(document.getElementById('chart_6'));
            chart6.draw(data6, option6);


            // Tagwise Accuracy
            var data7 = new google.visualization.DataTable();
            data7.addColumn('string', 'Tagwise_Accuracy');
            data7.addColumn('number', 'Percentage_Accuracy');

            for (var x in tagAccuracy) {
                data7.addRow([x, tagAccuracy[x]]);
            }
            var option7 = {
                'title': 'Tagwise Accuracy',
                'width': 600,
                'height': 800
            };
            var chart7 = new google.visualization.BarChart(document.getElementById('chart_7'));
            chart7.draw(data7, option7);

            // Heatmap
            var dataTable = new google.visualization.DataTable();
            dataTable.addColumn({ type: 'date', id: 'Date' });
            dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
            var years;
            for (var i in date) {
                var value = date[i];
                var ms = i * 1000;
                var d1 = new Date(ms);
                if (years === undefined) {
                    years = 2022 - d1.getFullYear();
                }
                dataTable.addRow([new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()), value]);
            }
            if (years === undefined) {
                years = 1;
            }
            var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));
            var options = {
                title: "Submissions",
                height: years * 140 + 30,
                width: 1000,
                colorAxis: {
                    minValue: 0,
                    colors: ['#ffffff', '#0027ff', '#00127d']
                },
                calendar: {
                    cellSize: 15
                }
            };
            chart.draw(dataTable, options);

        }
    } catch (error) {
        alert("User not found !!!");
    }
});
