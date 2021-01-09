google.charts.load("current", { packages: ["corechart",'bar','line'] });
google.charts.load("current", { packages: ["calendar"] });
const form = document.querySelector('#searchForm1');
var langUsed = {};
var verdict = {};
var problemTag = {};
var date = {};
var heat = [];
var ratingUser = [];
var rankArr = [];
var labelR=[];
var problemRating=[];

for(var x in labelR){
    labelR[x]=0;
}


var langUsed2= {};
var verdict2= {};
var problemTag2= {};
var date2 = {};
var heat2 = [];
var ratingUser2 = [];
var rankArr2 = [];
var problemRating2=[];

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const handle = form.elements.query.value;
    const handle2= form.elements.query2.value;
    // console.log(handle2);

    try {
        const userInfo = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
        const userStatus = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
        const userRating = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);

        const userInfo2 = await axios.get(`https://codeforces.com/api/user.info?handles=${handle2}`);
        const userStatus2= await axios.get(`https://codeforces.com/api/user.status?handle=${handle2}`);
        const userRating2 = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle2}`);
        //const problemSet = await axios.get(`https://codeforces.com/api/problemset.problems?tags=${handle}`);

       
        var currentRating=userInfo.data.result[0].rating;
        var maxRating=userInfo.data.result[0].maxRating;

        var currentRating2=userInfo2.data.result[0].rating;
        var maxRating2=userInfo2.data.result[0].maxRating;

        var totalContest=userRating.data.result.length;
        var totalContest2=userRating2.data.result.length;

        // console.log(currentRating);

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
                if (problemTag[tags[k]] === undefined) {
                    problemTag[tags[k]] = 1;
                } else {
                    problemTag[tags[k]]++;
                }
            }




           var rating=sub.problem.rating;
           if(ver=="OK" && rating!=undefined){
               if(problemRating[rating] === undefined){
                   problemRating[rating]=1;
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




           var rating2=sub2.problem.rating;
           if(ver2=="OK" && rating2!=undefined){
               if(problemRating2[rating2] === undefined){
                   problemRating2[rating2]=1;
               }
               else {
                   problemRating2[rating2]++;
               }
            }
        }
        
        // console.log(currentRating);
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
        //column graph of rating, max rating
        var data1 = google.visualization.arrayToDataTable([
          ['Rating', handle, handle2],
          ["current rating", currentRating, currentRating2],
          ["max rating", maxRating, maxRating2],
        ]);
          var classicOptions1 = {
          width: 900,
          series: {
            0: {targetAxisIndex: 0},
            // 1: {targetAxisIndex: 1}
          },
          title: 'Current and max rating of both users',
          vAxes: {
            // Adds titles to each axis.
            // minValue: 0,
            0: {title: 'rating'},
           // 1: {title: 'user'}
          },
          vAxis: {
            minValue: 0,
            // ticks: [0, .3, .6, .9, 1]
          }
        }
        //column graph of contest given

          var data2 = google.visualization.arrayToDataTable([
          ['Contest', "total number of contest"],
          [handle, totalContest],
          [handle2, totalContest2],
        ]);

          var classicOptions2 = {
          width: 900,
          series: {
            0: {targetAxisIndex: 0},
            // 1: {targetAxisIndex: 1}
          },
          title: 'Total contest given by both users',
          vAxes: {
            // Adds titles to each axis.
            0: {title: 'contests'},
            // 1: {title: 'user'}
          },
          vAxis: {
            minValue: 0,
            // ticks: [0, .3, .6, .9, 1]
          }
        }

        function drawClassicChart() {
          var classicChart1 = new google.visualization.ColumnChart(chartDiv_1);
          classicChart1.draw(data1, classicOptions1);

          var classicChart2= new google.visualization.ColumnChart(chartDiv_2);
          classicChart2.draw(data2, classicOptions2);
        }
        drawClassicChart();

        
        //     //----- start of variable 1-----------// 
        //     var data1 = new google.visualization.DataTable();
        //     data1.addColumn('string', 'language');
        //     data1.addColumn('number', 'countOfLanguage');
        //     for (var lang in langUsed) {
        //         data1.addRow([lang, langUsed[lang]]);
        //     }
        //     //set options
        //     var option1 = {
        //         'title': 'languages used by user',
        //         'width': 400,
        //         'height': 300
        //     };

        //     // Instantiate and draw our chart, passing in some options.
        //     var chart1 = new google.visualization.PieChart(document.getElementById('chart_1'));
        //     chart1.draw(data1, option1);
        //     //----- end of variable-----------// 

        //     //----- start of variable 2-----------// 
        //     var data2 = new google.visualization.DataTable();
        //     data2.addColumn('string', 'verdict');
        //     data2.addColumn('number', 'countOfVerdict');
        //     for (var verd in verdict) {
        //         data2.addRow([verd, verdict[verd]]);
        //     }

        //     var option2 = {
        //         'title': 'Verdicts by user',
        //         'width': 400,
        //         'height': 300
        //     };

        //     // Instantiate and draw our chart, passing in some options.
        //     var chart2 = new google.visualization.PieChart(document.getElementById('chart_2'));
        //     chart2.draw(data2, option2);
        //     //----- end of variable-----------// 

        //     //----- start of variable 3-----------// 
        //     var data3 = new google.visualization.DataTable();
        //     data3.addColumn('string', 'Tag');
        //     data3.addColumn('number', 'countOfTag');
        //     for (var tag in problemTag) {
        //         data3.addRow([tag, problemTag[tag]]);
        //     }
        //     //set options
        //     var option3 = {
        //         'title': 'problem tags solved used by user',
        //         'width': 400,
        //         'height': 300
        //     };
        //     // Instantiate and draw our chart, passing in some options.
        //     var chart3 = new google.visualization.PieChart(document.getElementById('chart_3'));
        //     chart3.draw(data3, option3);
        //     //----- end of variable-----------// 


        //     var dataTable = new google.visualization.DataTable();
        //     dataTable.addColumn({ type: 'date', id: 'Date' });
        //     dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
        //     var years;
        //     for (var i in date) {
        //         var value = date[i];
        //         var ms = i * 1000;
        //         var d1 = new Date(ms);
        //         if (years === undefined) {
        //             years = 2022 - d1.getFullYear();
        //         }
        //         dataTable.addRow([new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()), value]);
        //     }
        //     if (years === undefined) {
        //         years = 1;
        //     }
        //     var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));
        //     var options = {
        //         title: "Submissions",
        //         height: years * 140 + 30,
        //         width: 1000,
        //         colorAxis: {
        //             minValue: 0,
        //             colors: ['#ffffff', '#0027ff', '#00127d']
        //         },
        //         calendar: {
        //             cellSize: 15
        //         }
        //     };
        //     chart.draw(dataTable, options);



            
 
           
        //           //console.log(data.result[0]);
                
          
          
          for(var i=0;i<userRating.data.result.length;i++)
             {
                var sub=userRating.data.result[i];
                var rating=sub.newRating;
                
                var label=sub.ratingUpdateTimeSeconds;
                labelR[i]=label;
                ratingUser[label]=rating;
                var rank=sub.rank;
                rankArr[label]=rank;
                labelFinal=label;
             }
         for(var i=0;i<userRating2.data.result.length;i++)
             {
                var sub=userRating2.data.result[i];
                var rating=sub.newRating;
                
                var label=sub.ratingUpdateTimeSeconds;
                labelR[i+(userRating.data.result.length)]=label;
                ratingUser2[label]=rating;
                var rank=sub.rank;
                rankArr2[label]=rank;
             }

         labelR.sort();
         var data4 = new google.visualization.DataTable();
            data4.addColumn('date', 'label');
            data4.addColumn('number', 'rating 1');
            data4.addColumn('number', 'rating 2');
            for(var x of labelR){
                    data4.addRow([new Date(x*1000),ratingUser[x],ratingUser2[x]]);    

            }
         var option4 = {'title':'Rating over time',
                            interpolateNulls: true,
                           'width':900,
                           'height':500};
         var chart4 = new google.visualization.LineChart(document.getElementById('chart_4'));
         chart4.draw(data4, option4);
  
        
        
         var data5 = new google.visualization.DataTable();
         data5.addColumn('date', 'label');
         data5.addColumn('number','rank 1');
         data5.addColumn('number', 'rank 2');
         for(var x of labelR)
             {
                 data5.addRow([new Date(x*1000),rankArr[x],rankArr2[x]]);
             }
         var option5 = {'title':'Rank over time',
                            interpolateNulls: true,
                           'width':900,
                           'height':500};
         var chart5 = new google.visualization.LineChart(document.getElementById('chart_5'));
         chart5.draw(data5, option5);

        var data7 = new google.visualization.DataTable();
         data7.addColumn('string', 'Problem_Rating');
         data7.addColumn('number', `${handle}`);
         data7.addColumn('number',`${handle2}`);
         for (var x in problemRating) {
             data7.addRow([x, problemRating[x],problemRating2[x]]);
         }
         //set options
         var option7 = {
             'title': 'Problem Ratings',
             'width': 600,
             'height': 800
         };
         // Instantiate and draw our chart, passing in some options.
         var chart7 = new google.visualization.BarChart(document.getElementById('chart_7'));
         chart7.draw(data7, option7);
         
         }
    } catch (error) {
        alert("User not found !!!");
    }
});
