var currentTime = function() {
	var now = new Date();
	return now.getFullYear()+"-"+(now.getMonth()+1)
			+"-"+now.getDate()+" "+now.getHours()+":"
			+now.getMinutes()+":"+now.getSeconds();
}

var resetPage = function() {
	$("#new-event-type").hide("slow")	
	$("#event").show(1000)
	$("#filter").show(1000)
	$("#new-feed-detail").hide("slow")
	$("#new-bio-detail").hide("slow")
	$("#new-comments").hide("slow")
	$("#ops").hide(1000)
}
$(document).ready(function() {
	if($("#saving")) {
		console.log("reload, remove saving block")
		$("#saving").remove();
	}



})
	$('#range-picker-start').datetimepicker({
		pickerTimeFormat:"HH:mm:ss",
		dateFormat: "yy-mm-dd",
		timeFormat: "HH:mm:ss",
		defaultValue: currentTime()
	});


$("#event-new").on('click',function() {
	$("#new-event-type").show("slow")	
	$("#event").hide(1000)
	$("#filter").hide(1000)
})

$("#new-type-bio").on('click',function(){
	$("#new-bio-detail").show("slow")
	$("#new-feed-detail").hide("slow")
	$("#new-comments").show("slow")
	$("#range-picker-start").val(currentTime())
	$("#new-type-show").text($(this).attr('value'))
})

$("#new-type-feed").on('click',function(){
	$("#new-feed-detail").show("slow")
	$("#new-bio-detail").hide("slow")
	$("#new-comments").show("slow")
	$("#range-picker-start").val(currentTime())
	$("#new-type-show").text($(this).attr('value'))
})

$(".bio-done").on('click',function() {
	$("#ops").show(1000)
	$("#new-bio-show").text($(this).text())
	
})

$(".feed-done").on('click',function() {
	$("#ops").show(1000)
	$("#new-feed-show").text($(this).text())
	
})

$("#event-cancel").on('click',function() {
	resetPage()

})

$("#event-save").on('click',function() {
	$('<div id="saving"></div>').appendTo('body')
	  .html('<div><h6>Saving...</h6></div>')
	  .dialog({
	      modal: true, title: '', zIndex: 10000, autoOpen: true,
	      width: 'auto', resizable: false,
	      buttons: {},
	      close: function (event, ui) {
	          $(this).remove();
	      }
	});

	var mod = {}
	mod.type = $("#new-type-show").text()
	var factName = "#new-"+mod.type.toLowerCase()+"-show"
	mod.fact = $(factName).text()
	mod.time = $('#range-picker-start').val()
	mod.comments = $("#new-comments-content").val() || $("#new-comments-content").attr('placeholder')
	console.log(mod)
	
	var myurl = "http://192.168.1.15:8887/rec"
	$.ajax({
		type: 'POST',
		data: JSON.stringify(mod),
        contentType: 'application/json',
        url: myurl,						
        success: function(data) {
            console.log('success');
            //console.log(JSON.stringify(data));
            //resetPage();
            window.location.reload(true);
        }
    });
})

var confirmRemoveOne = function(rid) {
	var myurl = "http://192.168.1.15:8887/rec/"+rid;
	mod={}
	mod.id=rid
	$.ajax({
		type: 'DELETE',
		data: JSON.stringify(mod),        
        url: myurl,						
        success: function(data) {
            console.log('Delete success');
            //console.log(JSON.stringify(data));
            //resetPage();
            window.location.reload(true);
        }
    });
}

$(".event-remove-one").on('click',function() {
	var id = $(this).attr('id')
	$('<div></div>').appendTo('body')
	  .html('<div><h6>Delete this event?</h6></div>')
	  .dialog({
	      modal: true, title: 'Are you sure?', zIndex: 10000, autoOpen: true,
	      width: 'auto', resizable: false,
	      buttons: {
	          Yes: function () {
	              confirmRemoveOne(id);
	              $(this).dialog("close");
	          },
	          No: function () {
	              
	              $(this).dialog("close");
	          }
	      },
	      close: function (event, ui) {
	          $(this).remove();
	      }
	});

})

$('.report').on('click',function() {
	var myurl = "http://192.168.1.15:8887/rows"
	$.ajax({
		type: 'GET',		     
        url: myurl,						
        success: function(data) {            
            var total_events = data.length
            var poo_total=pee_total=feed_total=lefty_total=
            righty_total=0;
            var poo_avg,pee_avg,feed_avg;

            var next_poo,next_pee,next_feed;
            var min_poo_time,min_pee_time,min_feed_time;
            var max_poo_time, max_pee_time, max_feed_time;

            data.forEach(function(d){
            	if(d.type==='Bio') {
            		if(d.fact==='Pee') {
            			pee_total++;
            			if(!min_pee_time) min_pee_time = d.event_time
            			if(Date.parse(min_pee_time) > Date.parse(d.event_time)) {
            				min_pee_time = d.event_time
            			}
            			if(!max_pee_time) max_pee_time = d.event_time
            			if(Date.parse(max_pee_time) < Date.parse(d.event_time)) {
            				max_pee_time = d.event_time
            			}
            		}else if(d.fact==='Poo'){
            			poo_total++;
            			if(!min_poo_time) min_poo_time = d.event_time
            			if(Date.parse(min_poo_time) > Date.parse(d.event_time)) {
            				min_poo_time = d.event_time
            			}
            			if(!max_poo_time) max_poo_time = d.event_time
            			if(Date.parse(max_poo_time) < Date.parse(d.event_time)) {
            				max_poo_time = d.event_time
            			}
            		}
            	}else if(d.type==='Feed') {
            		if(d.fact==='Both Side') {
            			lefty_total++;
            			righty_total++;
            		}else if(d.fact=='Left Side') {
            			lefty_total++;
            		}else if(d.fact==='Right Side') {
            			righty_total++;
            		}
            		feed_total++;
            		if(!min_feed_time) min_feed_time = d.event_time
            		if(Date.parse(min_feed_time) > Date.parse(d.event_time)) {
            				min_feed_time = d.event_time
            		}
            		if(!max_feed_time) max_feed_time = d.event_time
            		if(Date.parse(max_feed_time) < Date.parse(d.event_time)) {
            				max_feed_time = d.event_time
            		}
            	}
            })
            //console.log(min_poo_time,min_pee_time,min_feed_time)
            //console.log(max_poo_time,max_pee_time,max_feed_time)
            var millisNow = Date.parse(currentTime())

            pee_avg = Math.ceil((millisNow - Date.parse(min_pee_time))/(pee_total*1000*60))
            poo_avg = Math.ceil((millisNow - Date.parse(min_poo_time))/(poo_total*1000*60))
            feed_avg = Math.ceil((millisNow - Date.parse(min_feed_time))/(feed_total*1000*60))

            next_pee = Math.ceil((Math.ceil(Date.parse(max_pee_time)/(1000*60))+pee_avg)-millisNow/(1000*60))
            next_poo = Math.ceil((Math.ceil(Date.parse(max_poo_time)/(1000*60))+poo_avg)-millisNow/(1000*60))
            next_feed = Math.ceil((Math.ceil(Date.parse(max_feed_time)/(1000*60))+feed_avg)-millisNow/(1000*60))

            var report = 
            '<div><h6>小Katie的日常</h6>'+
            '<p>Done:<ul>'+
            '<li>In total: '+total_events+' Events</li>'+
            '<li>Poo total: '+poo_total+'</li>'+
            '<li>Pee total: '+pee_total+'</li>'+
            '<li>Feed total: '+feed_total+'</li>'+
            '<li>Lefty: '+lefty_total+' righty'+righty_total+'</li>'+
            '</ul></p>'+
            '<p>Average:<ul>'+
            '<li>Poo every: '+poo_avg+' min</li>'+
            '<li>Pee every: '+pee_avg+' min</li>'+
            '<li>Feed every: '+feed_avg+' min</li>'+            
            '</ul></p>'+
            '<p>Forecast:<ul>'+
            '<li>Next poo in '+next_poo+' min</li>'+
            '<li>Next pee in '+next_pee+' min</li>'+
            '<li>Next feed in '+next_feed+' min</li>'+
            '</ul></p>'+
            '</div>'

            $('<div id="report-dialog"></div>').appendTo('body')
			  .html(report)
			  .dialog({
			      modal: true, title: 'Reports', zIndex: 10000, autoOpen: true,
			      width: 'auto', resizable: false,
			      position:['center',150],
			      buttons: {
			         
			          Close: function () {
			              
			              $(this).dialog("close");
			          }
			      },
			      close: function (event, ui) {
			          $(this).remove();
			      }
			});
        }
    });
	
})