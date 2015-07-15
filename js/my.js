
$("#name").on( "click", function(){
	$('html, body').animate({
        scrollTop: ($("#name").offset().top)-90
    }, 1500);
});


//services  more info btn
$("#servicesMoInfo").click(function() {
	$('html, body').animate({
        scrollTop: ($("#carousel-nav").offset().top)-120
    	},{
	        queue: false,
	        duration: 1500
        })
	setTimeout(function() {
    	$(".ser-carous-holder a.prev-slide").trigger("click");
		}, 590);
});


//form submit event launching 
var $contactForm = $('#contactform');
$contactForm.submit(function(e) {
	e.preventDefault();
	$.ajax({
		url: '//formspree.io/shmuel.disraeli@gmail.com',
		method: 'POST',
		data: $(this).serialize(),
		dataType: 'json',
		beforeSend: function() {
			$('html, body').animate({scrollTop: ($("#sec5").offset().top)-70
		    },{
		        queue: false,
		        duration: 1000
		    });
			$contactForm.fadeOut();
			$("#contact-p").hide();
			$("#contact-form").prepend('<h3 class="text-title  loading">שולח הודעה...</h3>');
			/*$(".loading").css("margin-right", "-=45");*/
			$(".loading").animate({
		      marginRight: "45px"
		    }, {
		      queue: false,
		      duration: 2600
		    });

		},
		success:  function(data) {
			setTimeout(
				function(){
					var name = document.getElementById('name').value;
					$("#contact-form").find('.loading').hide();
					$("#contact-form").prepend('<h3 class="text-title scs">תודה לך<span> '+name+'</span>.<br>ההודעה שלך התקבלה!</br>אצור אתך קשר בקרוב.<h3>');
					
					$(".scs").animate({
				     	marginRight: "45px"
					    }, {
					      queue: false,
					      duration: 2600
					});
				}, 2600
			)
		},
		error: function(err) {
			setTimeout(
				function(){
					$("#contact-form").find('.loading').hide();
					$("#contact-form").prepend('<h3 class="text-title err">אופס@# קרתה תקלה! <br>ההודעה לא נשלחה! </br>בדקו את החיבור לאינטרנט ונסו שנית.</br><span>ניתן גם ליצור איתי קשר ישירות,</span></br></span> הפרטים בסוף הדף.<h3><a id="contactRetrayBtn" class="btn hide-icon next-slide err"><i class="fa fa-paper-plane-o"></i> <span>שלח מחדש</span></a>');
					$(".scs").css("margin-right", "-=45");
					$(".err").animate({
						marginRight: "45px"
					    }, {
					      queue: false,
					      duration: 2600
				    });
				    $('#contactRetrayBtn').click(function(){
				    	$("#contact-form").find('#contactRetrayBtn').hide();
				    	$("#contact-form").find('.err').hide();
				    	$contactForm.trigger("submit");
				    	/*$contactForm.fadeIn();*/

				    })
				}, 2600
			) 
		},
	});
});

//contact form success message 
/*function formSubmit() {
	$("form").fadeOut(1000, function() {
		var name = "";
		name = document.getElementById('name').value;
		$("#message").prependTo("<p>תודה לך <span>"+name+"</span></p>");
		$("#message").fadeI
		n(1000);
	});
	
};*/
