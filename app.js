google.charts.load("current", { packages: ["corechart"] });
google.charts.load("current", { packages: ["calendar"] });
const form = document.querySelector('#searchForm');
var langUsed = {};
var verdict = {};
var problemTag = {};
var tagAccuracy = {};
var date = {};
var heat = [];
var problems = {};
var tried = 0;
var Solved = 0;


form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const handle = form.elements.query.value;
    try {
        const userInfo = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
        const userStatus = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
        console.log(userStatus.data);
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
        }

        for (i in tagAccuracy) {
            if (problemTag[i] != 0) {
                tagAccuracy[i] /= problemTag[i];
                tagAccuracy[i] *= 100;
            } else {
                tagAccuracy[i] = 0;
            }
            console.log(i, tagAccuracy[i]);
        }

        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            //----- start of variable 1-----------// 
            var data1 = new google.visualization.DataTable();
            data1.addColumn('string', 'language');
            data1.addColumn('number', 'countOfLanguage');
            for (var lang in langUsed) {
                data1.addRow([lang, langUsed[lang]]);
            }
            //set options
            var option1 = {
                'title': 'languages used by user',
                'width': 400,
                'height': 300
            };

            // Instantiate and draw our chart, passing in some options.
            var chart1 = new google.visualization.PieChart(document.getElementById('chart_1'));
            chart1.draw(data1, option1);
            //----- end of variable-----------// 

            //----- start of variable 2-----------// 
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

            // Instantiate and draw our chart, passing in some options.
            var chart2 = new google.visualization.PieChart(document.getElementById('chart_2'));
            chart2.draw(data2, option2);
            //----- end of variable-----------// 

            //----- start of variable 3-----------// 
            var data3 = new google.visualization.DataTable();
            data3.addColumn('string', 'Tag');
            data3.addColumn('number', 'countOfTag');
            for (var tag in problemTag) {
                data3.addRow([tag, problemTag[tag]]);
            }
            //set options
            var option3 = {
                'title': 'problem tags solved used by user',
                'width': 400,
                'height': 300
            };
            // Instantiate and draw our chart, passing in some options.
            var chart3 = new google.visualization.PieChart(document.getElementById('chart_3'));
            chart3.draw(data3, option3);
            //----- end of variable-----------// 


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