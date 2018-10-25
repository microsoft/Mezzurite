import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { finalize } from 'rxjs/operators/finalize';
import { axisBottom } from 'd3';

declare var jsllViewer: any;


@Component({
    selector: 'status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.css']
})

export class StatusComponent implements OnInit {
    
    ngOnInit() {
        window["d3"] = d3;
        jsllViewer.dataRenderFunction= this.cv_ig_render;
        
        
        window["StatusComponent"] = window["StatusComponent"] || {};
        window["StatusComponent"].getData = this.getData.bind(this);
        window["StatusComponent"].render_Perf_Data = this.render_Perf_Data.bind(this);
        window["StatusComponent"].getBroswerPerfData = this.getBroswerPerfData.bind(this);
        window["StatusComponent"].waterFall = this.render_waterFall.bind(this);
        window["StatusComponent"].get_Spa_Perf_Data =  this.get_Spa_Perf_Data.bind(this);
        window["StatusComponent"].d3_waterFall_svg = this.d3_waterFall_svg.bind(this);
    }
    
    getBroswerPerfData()
    {
        var data = [];
        for (var t in window.performance.timing) {
                  if (typeof window.performance.timing[t] != 'function'){
                      data.push([t, window.performance.timing[t]]);
                    }
        }
        return data;
    }

    getData(){
        
        var data = [];
        if (jsllViewer && jsllViewer.eventHistory)
        {
            var count =0;
            jsllViewer.eventHistory.forEach(function (d){

                
                var currentBase = d.EventData.cV;
                if (d && d.EventData && d.EventData.data && d.EventData.data.baseData && d.EventData.data.baseData.impressionGuid) {
                    var currentIg = d.EventData.data.baseData.impressionGuid;
                }
                var index = currentBase.lastIndexOf(".");
                var extention = currentBase.substring(index, currentBase.length);
                currentBase = currentBase.substring(0,index);
                var foundBase = data.find(function (e){ return e.cV_ig === currentBase; });
             if (!foundBase)
              {
                count = count +1;
                  // didn't find the base, so we need to add the whole thing
                var sub = {"ext": extention, "cC":"", "name":d.EventData.name, "cV_Ig_Count": count };
                data.push({"cV_ig":currentBase, "ig":currentIg, "sub":[sub]});
              } 
              else{
                foundBase.sub.push({"ext": extention, "cC":"", "name":d.EventData.name, "cV_Ig_Count": count });
              }
            });
        }
        return data;
    }


    cv_ig_render() {

        // Data below is this format:
        // cV_ig :  cV extended to track page impressions
        // ig:  Impression Guid 
        // sub:  Event Data
        //     ext:  Current Extention Value
        //     name:   Event Name
        //     cV_Ig_Count:  number of Impressions Hit, used for styles.
        //  [{cV_ig:"", ig:"", sub:[{"ext":"", "name":"", cV_Ig_Count:""}]}]


        var events =  window["StatusComponent"].getData();
        var width = 300;
        var height = 40;
        var padding = 10;
        var totalElements = 0;


        // hack for now.
        var svg = d3.select('#chart').remove();
             svg= d3.select('#cV_ig').append("svg").attr("id", "chart").attr("width","100%").attr("height","100%")
               //     .call(d3.zoom().on("zoom", function()
               //     {
               //         svg.attr("transform", d3.event.transform )
                //    }))
                .append("g");
        
        
        var groups = svg.selectAll('g')
                    .data(events)
                    .enter()
                    .append("g")
                    .attr("cV_ig", function(d:any){
                        return d.cV_ig;
                    })
                    .attr("transform",function(d:any,i){
                        totalElements = totalElements + d.sub.length +1;
                        return "translate(0," + (((totalElements - d.sub.length) * height) + padding) +")";
                    });

        var cvBase = groups.append("g").attr("class", function(d,i){
                
                if ((i % 2) === 0)
                {
                    return "cVBase Even";
                }
                else
                {
                    return "cVBase Odd";
                }
            });

            cvBase.append("rect")
                  .attr("x","0")
                  .attr("y", "0")
                  .attr("width",width)
                  .attr("height",height)
                  .attr("class","jsllEvent");
                  

                  cvBase.append("text")
                  .attr("x","5")
                  .attr("y", "15")
                  .attr("class","cvText")
                  .text(function(d:any){
                    return "cV: " + d.cV_ig;
                });

                cvBase.append("text")
                .attr("x","5")
                .attr("y", "35")
                .attr("class","igText")
                .text(function(d:any){
                  return "ig: " + d.ig;
              });

        // Add Second Layer of Boxes  
        
                var rects = groups.selectAll("g[cV_ig]").data(function (d:any) {
                    
                    return d.sub;})
                        .enter()
                        .append("g"
                        ).attr("extend", function(d:any){
                                     return d.ext; });

                        rects.append("rect")
                        .attr("x", width)
                        .attr("y", function (d,i){
                            return (i * height) + height;
                         
                        })
                        .attr("width", width)
                        .attr("height", height)
                        .attr("class", function (d:any,i)
                            {
                                var val = "sub";
                                if ((d.cV_Ig_Count % 2) === 0)
                                {
                                    val = val + " Even";
                                }
                                else
                                {
                                    val = val + " Odd";
                                }

                                if(i %2 == 0)
                                {
                                    val = val + " L2E";
                                }
                                else
                                {
                                    val = val + " L2O";
                                }
                                return val;
                            });

                    rects.append("text").data(function (d:any) {
                    
                            return d.sub;})
                        .text(function (d:any){
                            return d.ext + " | " + d.name;
                        })
                        .attr("x", width)
                        .attr("y", function (d:any,i:number){
                            return (i * height) + height + 30
                        })
                        .attr("class", "cvText")
                        .attr("width", width)
                        .attr("height", height);

                groups.exit();

            var maxHeight = Math.pow(10, Math.ceil(Math.log10(totalElements * height)));

            if (maxHeight < 400)
            {
                maxHeight = 400;
            }

            svg= d3.select('#chart').attr("height", maxHeight + "px").attr("width", width *2 + "px");
            
            window["StatusComponent"].render_Perf_Data();     
    }


    get_Spa_Perf_Data()
    {
        // Returns data in this format
        // Perf Data{
        // ALT:number
        // ALTstart:number (datetime)
        // ALTEnd:number (datetime)
        // FVLT:number 
        // FVLTStart:number (datetime)
        // FVLTEnd:number (datetime)
        // VLTC:number
        // LastPage:string
        // Array of PageNames[]
        //     Histo:  array of [Count, Value]
        //     Sum:  Total of Values
        //     Starts:  Array of numbers (dateTime)
        //     Ends:  Array of numbers (dateTime)
        // }

        var perfData:any = {};

        var list:any = {};
        if (jsllViewer && jsllViewer.eventHistory)
        {
                 list = jsllViewer.eventHistory.filter(function(d){
                                                 return d.EventData.name === "Ms.Webi.ContentUpdate" && d.EventData.data.timings;
            });
        }
       
        var pageName = "";
        list.forEach(function(d){
            
            pageName = d.EventData.data.baseData.pageName;
            perfData[pageName] = perfData[pageName] || {};
            perfData[pageName].Count = perfData[pageName].Count || 0;
            perfData[pageName].Histo = perfData[pageName].Histo || [];
            perfData[pageName].Sum = perfData[pageName].Sum || 0;
            perfData[pageName].Starts = perfData[pageName].Starts || [];
            perfData[pageName].Ends = perfData[pageName].Ends || [];

            perfData.ALT = perfData.ALT || -1;
            perfData.ALTStart = perfData.ALTStart || -1;
            perfData.FVLT = perfData.FVLT || -1;
            perfData.FVLTStart = perfData.FVLTStart || -1;
            perfData.FVLTEnd = perfData.FVLTEnd || -1;
            perfData.VLTC = perfData.VLTC || -1;
            perfData.LastPage = pageName;
            var obj = JSON.parse(d.EventData.data.timings);
                obj.forEach(function(e) {
                    var val = Math.round(e.value);
                    if ((e.metricType === 'Aplt' || e.metricType === 'Alt') && perfData.ALT == -1){
                            perfData.ALT = val;
                            if (e && e.data && e.data.startTime) {
                            perfData.ALTStart = e.data.startTime;
                            }
                    }
                    if (e.metricType === 'Vlt' || e.metricType === 'Vlt'){
                        if ( perfData.FVLT == -1){
                            perfData.FVLT = val;
                            perfData.FVLTStart = e.data.startTime;
                            perfData.FVLTEnd = e.data.endTime;
                        }
                        perfData.VLTC = val;
                        perfData[pageName].Count = perfData[pageName].Count +1;
                        perfData[pageName].Sum = perfData[pageName].Sum + perfData.VLTC;
                        perfData[pageName].Ends.push(e.data.endTime);
                        perfData[pageName].Starts.push(e.data.startTime);

                        // need to see if value is already in histogram, if so then +1 it
                        
                        var findOut = perfData[pageName].Histo.find(function (d){ return d[1] === perfData.VLTC})
                        if (findOut){
                            findOut[0] = findOut[0]    +1;
                        }
                        else {
                            perfData[pageName].Histo.push([1, perfData.VLTC]);
                        }
            
                    }
                } );         
        } );
        
       
    
        return perfData;
    }

    render_Perf_Data()
    {
        var spaData = window["StatusComponent"].get_Spa_Perf_Data();
        if (spaData.ALT)
        {
            if (spaData.ALT !== -1){
                var  TTFVLT = spaData.ALT + spaData.FVLT;
                document.getElementById('waiting').style.display= "none";
                var hideThese = document.getElementsByClassName('timing');
                for( var i = 0; i < hideThese.length; i++)
                {
                    if (hideThese[i].attributes.getNamedItem("style")) {
                    hideThese[i].attributes.removeNamedItem("style");
                    }
                }
                document.getElementById('ALT').innerText = 'Application Load Time: ' + spaData.ALT + "ms";
                document.getElementById('VLT1ST').innerText = 'First Viewport Load Time: ' + spaData.FVLT+ "ms";
                document.getElementById('TTFVLT').innerText = 'Time To First Viewport Load Time: ' + TTFVLT+ "ms";
                document.getElementById('VLTCURRENT').innerText = 'Current Viewport Load Time: ' + spaData.VLTC + "ms";
                document.getElementById('VLTAVG').innerText = 'Avg Viewport Load Time in this Session for ' + spaData.LastPage + ': ' + spaData[spaData.LastPage].Sum / spaData[spaData.LastPage].Count + "ms";
                window["StatusComponent"].waterFall(spaData);
            }
        }
    }

    render_waterFall(spaData:any)
    {
        var chartId = "#NavTimings";

        var data = window["StatusComponent"].getBroswerPerfData();
        

        var min = data.find(function (d){return d[0] === "navigationStart"})[1];
        var max = data.find(function (d){return d[0] === "loadEventEnd"})[1];

        var width = 600;//Math.ceil((max - min) / 100.0) * 100;

        // create nav timing set based off W3.

        var navStats = [];

       // navStats.push(["Redirect", data.find(function (d){return d[0] === "redirectStart"})[1], data.find(function (d){return d[0] === "redirectEnd"})[1]]);
        navStats.push(["Unload", data.find(function (d){return d[0] === "unloadEventStart"})[1], data.find(function (d){return d[0] === "unloadEventEnd"})[1]]);
        navStats.push(["AppCache", data.find(function (d){return d[0] === "fetchStart"})[1], data.find(function (d){return d[0] === "domainLookupStart"})[1]]);
        navStats.push(["Dns", data.find(function (d){return d[0] === "domainLookupStart"})[1], data.find(function (d){return d[0] === "domainLookupEnd"})[1]]);
        navStats.push(["TCP", data.find(function (d){return d[0] === "connectStart"})[1], data.find(function (d){return d[0] === "connectEnd"})[1]]);
        navStats.push(["Request", data.find(function (d){return d[0] === "requestStart"})[1], data.find(function (d){return d[0] === "responseStart"})[1]]);
        navStats.push(["Response", data.find(function (d){return d[0] === "responseStart"})[1], data.find(function (d){return d[0] === "responseEnd"})[1]]);
        navStats.push(["Processing", data.find(function (d){return d[0] === "domLoading"})[1], data.find(function (d){return d[0] === "domComplete"})[1]]);
       // navStats.push(["onLoad", data.find(function (d){return d[0] === "loadEventStart"})[1], data.find(function (d){return d[0] === "loadEventEnd"})[1]]);

        navStats = navStats.sort(function (a,b){
            if (a[1] === 0){
                  return -1
            }else{
                return a[1] - b[1]
            }
        });

        // Perphorma Timings:
        navStats.push(["Network Time", min,data.find(function (d){return d[0] === "connectEnd"})[1]]);
        navStats.push(["Server Time", data.find(function (d){return d[0] === "requestStart"})[1],data.find(function (d){return d[0] === "responseEnd"})[1]]);
        // ALT
        navStats.push(["ALT", min, spaData.ALTStart]);
        // First VLT
        navStats.push(["TTFVLT", spaData.FVLTStart, spaData.FVLTEnd]);
        
        

        window["StatusComponent"].d3_waterFall_svg(navStats, "#navStat", "#NavTimings", width, min, max);

        
        var vlt = [];
        var pages = Object.keys(spaData).filter(function(d){ return (typeof spaData[d]) === 'object' });

            pages.forEach(function (d){
                
                var items = spaData[d].Ends.length -1;

                for( var i = items; i >= 0; i--){

                    vlt.push(["VLT: " + d , spaData[d].Starts[i], spaData[d].Ends[i]]);
                    if (spaData[d].Ends[i] > max){
                        max = spaData[d].Ends[i];
                    }
                }
            }); 
        
       vlt = vlt.sort(function (a,b){
            return a[1] - b[1]
        });
     
        
        min = spaData.FVLTStart;
        window["StatusComponent"].d3_waterFall_svg(vlt, "#VltStat", "#VLTTimings", width, min, max); 
    }

    d3_waterFall_svg(chartData:any, chartId:string, divId:string, width:number, min:number, max:number )
    {
        // Expect chartData in the following format
        // [["string", start, end]]


        var margin = [40, 0 , 20, 50];
        var dataPadding =  50;
        var height = (chartData.length +2) * 20;

        var chart = d3.select(chartId).remove();


        chart = d3.select(divId).classed('waterFall', true).append('svg')
                     .attr('width', width)
                     .attr('height', height + margin[0])
                     .attr('id', chartId.substring(1, chartId.length))
                     .style("float","left")
                     .append('g');
                     
                     

       var xScaler = d3.scaleLinear()
                      .domain([min, max+ dataPadding] )
                      .range([margin[2], width - margin[3]]);

       var ticksToUse = xScaler.ticks();

           ticksToUse[0] = (ticksToUse[0] - min) /2 

           ticksToUse.push(min);

       var gridlines = d3.axisBottom(null)
                         .tickSize(height)
                         .tickFormat(function (d:any){return d - min + "ms";})
                         .tickValues(ticksToUse)
                         .scale(xScaler);

        chart.append("g")
             .attr("class","grids")
             .call(gridlines);


       var main = chart.append("g")
                       .attr("width",width - margin[2])
                       .attr("height", height)
                       .attr("class", "main");

           main.append('g').selectAll("labels")
               .data(chartData)
               .enter()
               .append("text")
               .text(function (d){return d[0] + ' ' + (d[2] - d[1])+ 'ms'})
               .attr("x", function (d){return xScaler(d[1])})
               .attr("y",function (d,i){return i * 20 + 15 })
               .attr("dy",".5ex")
               .attr("class", "txt");

           main.append('g').selectAll("boxes")
               .data(chartData)
               .enter()
               .append("rect")
               .attr("x", function (d){return xScaler(d[1])})
               .attr("y",function (d,i){return i * 20})
               .attr("width", function (d){return xScaler(d[2]) - xScaler(d[1])})
               .attr("height", 20)
               .attr("class","bars");

           d3.select('path').remove();
    }
}

