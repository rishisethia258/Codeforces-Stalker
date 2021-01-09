const form = document.querySelector('#searchForm2');

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const handle = form.elements.query.value;


    const userStatus1 = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);

    var count=0;
    var Ids=[]
    const contests = await axios.get(`https://codeforces.com/api/contest.list?gym=false`);

    for(var j in contests.data.result)
    {
        var k=0;
       for(var i=0;i<userStatus1.data.result.length;i++)
      {
          if(userStatus1.data.result[i].contestId == contests.data.result[j].id) {
             k=1;
             break;
             //Ids[count]=userStatus;
             //if(count==10) break;
          }
        }
        if(k==0){ Ids[count]=contests.data.result[j].id;
        count++;}
        if(count==10) break;
    }

    console.log(Ids);

});
