// Server config - input your port
const port = 3154

var request = require('request');
var cheerio = require('cheerio');
const express = require('express')
const app = express()

var last="0", last2="EROARE", last3="0";

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

app.get('/', (req, res) => {

request('https://api1.datelazi.ro/api/v2/data/ui-data', function (error, response, data) {
        if (!error && response.statusCode == 200) {
                try {
                         val = JSON.parse(data).quickStats.totals.confirmed.toString();
                         last = val;
                         console.log(Date()+" | Requested update, val: "+val)
                         res.send(val);
                } catch(err) { res.send(last)  }
        } else res.send(last);
});

})

app.get('/stat', (req, res) => {

request('https://covid19ro.org/', function (error, response, html) {
        if (!error && response.statusCode == 200) {
          try {
                $ = cheerio.load(html);
                result = $("table");
                txt = "";
                $("table").find("tr").not(".emptyRow").slice(2).each(function(){
                        if($(this).find('td').eq(0).text()!="-")
                                   txt+=$(this).find('td').eq(0).text().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ")[0]+" "+$(this).find('td').eq(1).text()+"/"+$(this).find('td').eq(2).text()+"/"+$(this).find('td').eq(3).text()+"\r\n";
  })
          last2=txt;
          res.send(txt);
        } catch(err) { res.send(last2)  }
  } else res.send(last2);
});

})

app.get('/active', (req, res) => {

request('https://www.worldometers.info/coronavirus/', function (error, response, html) {
        if (!error && response.statusCode == 200) {
          try {
                $ = cheerio.load(html);
                $("table tr").each(function(){
                        if($(this).find('td').eq(0).text().trim()=="Romania"){ last3=($(this).find('td').eq(6).text().trim()); res.send(last3); }
                })
        } catch(err) { res.send(last3);  }
  } else res.send(last3);
});

})

// This is a scraper, the page format might temporarily change and this global exception catcher is here to not kill the server if parsing fails
process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

app.listen(port, () => console.log(`Scrape proxy app listening on port ${port}!`))
