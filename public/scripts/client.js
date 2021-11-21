/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(()=> {
  let $tweetText = $("#tweet-text"); // after that you can just use $tweetText
  const tweetMsgLength = 140;
  $tweetText.focus();

   // Initial set up new-tweet is hidden and list-tweets has a margin-top of 150px
   $(".new-tweet").slideUp("slow");
  //  const width = $(window).width();
 
  //  if (width > 1000) {
  //    $(".list-tweets").css("margin-top","150px");
  //  }
  
  // event triggered when user release the key when typing in the tweet text
  $tweetText.on("keyup",function(event) { 
    const txtAreaLength = $(this).val().length;
 
    // remove any error message when user start typing
    $("#tweet-errorMsg").removeClass("tweet-errorMsg").text("").slideUp(1000);
 
    // update the counter forEach because tweet-counter is a class
    // I think the requirement is to have it as a class. If not I would do it with just an
    // id and no need for the looping of all the elements with the class .tweet-counter
    let $counterElmts = $(".tweet-counter");
    $counterElmts.each(function() {
      $(this).text(tweetMsgLength - txtAreaLength);

      if (parseInt($(this).val()) < 0) {
        $(this).addClass("redText");  //no need because jQuery does check it anyway
      } else {
        $(this).removeClass("redText");
      }
    });
  });

  // triggered when user press the tweet button
  $( "form" ).submit(function( event ) {
    event.preventDefault();
    $("#tweet-errorMsg").removeClass("tweet-errorMsg").text("").slideUp(1000);

    // should not be empty
    if (!$("#tweet-text").val()) {
      //alert( "Tweet Cannot Be Empty." );
      $("#tweet-errorMsg").addClass("tweet-errorMsg").text("Tweet cannot be empty!").slideDown(1000);
      $("#tweet-text").focus();
      return;
    }

    // should have a maximum of 140 character in length
    if ($("#tweet-text").val().length > 140) {
      //alert( "Tweet too long. Please send shorter tweet of 140 characters or less!" );
      $("#tweet-errorMsg").addClass("tweet-errorMsg").text("Tweet too long. Please send shorter tweets of 140 characters or less!").slideDown(1000);
      $("#tweet-text").focus();
      return;
    }

    //prepare data to be sent to the server through an jQuery ajax call
    let dataForm = $("form").serialize();

    $.ajax({
      url: $( "form" ).attr("action"),
      method: "POST",
      data: dataForm,          //$("form textarea").serialize(),           //only input
    })
    .done(function(data) {
      //console.log('success callback ', data);
      $("#tweet-text").val("");
      $("#tweet-text").focus();
      $(".tweet-counter").val(tweetMsgLength);
      loadTweets();
    })
    .fail(function(xhr) {
      //alert("An error occurred posting your tweet! Call the Mentors!");
      $("#tweet-errorMsg").addClass("tweet-errorMsg").text("An error occurred posting your tweet! Call the Mentors!").slideDown(1000);
      console.log('error callback ', xhr);
    });
  });

  $(window).scroll(()=>{
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      $("#myBtn").show();  //css("di;play","block");
    } else {
      $("#myBtn").hide();  //css("display","block");
    }
  })
  
  $("#myBtn").click(() => {
    $("body").scrollTop = 0;                // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  });

  // function loop() {
  //   $(".down-arrow").animate({"top": "+= 10px"}, {
  //     duration: 1000, 
  //     complete: function() {
  //         $(".down-arrow").animate({"top": "-= 10px"}, {
  //           duration: 1000, 
  //           complete: loop
  //         });
  //     }
  //   });
  // }
  
  // loop();


  $(".down-arrow").click(() => {
    $(".new-tweet").slideDown("slow");
    $("#tweet-text").focus();
    $("#list-tweets").removeClass("list-tweets").addClass("list-tweets-with-new");
  });

});

// to secure against CSS all text that are displayed need to be escaped
const escape = function (str) {   // to defend against cross site scripting CSS
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// create a tweet element
const createTweetElement = function(tweet) {

  const date_str = timeago.format(tweet.created_at, 'pt_BR');

  let html = `
  <article class="tweet">
    <section class="tweet-line1">
      <span class="tweet-avatar"><img src='${escape(tweet.user.avatars)}'> 
        <span class="tweet_name">${escape(tweet.user.name)}</span>
      </span>
      <span class="tweet-handle">${escape(tweet.user.handle)}</span>
    </section>

    <span class="tweet-line2">
      <span class="tweet-text">${escape(tweet.content.text)}</span>
    </span>

    <footer class="tweet-line3">
      <span class="tweet-date">${date_str}</span>
      <span class="tweet-logo1"><i class="far fa-flag"></i>
        <span class="tweet-logo2"><i class="fas fa-undo"></i>
          <span class="tweet-logo3"><i class="far fa-heart"></i></span>
        </span>
      </span>
    </footer>
</article>
`;
 return html;
}

// load the tweets form initial-tweets.json on the server
const loadTweets = () => {
  let thisHtml = '';

  $.ajax({
    url: "/tweets",
    method: "GET",
  })
  .done(function(data) {
    const tweets = data.sort((tweet1, tweet2) => tweet2.created_at - tweet1.created_at);

    for (let tweet of tweets) {
      thisHtml += createTweetElement(tweet);
    }

    $("#list-tweets").html(thisHtml);
  })
  .fail(function(xhr) {
    //alert("An error occurred loading your tweets! Call the Mentors!");
    $("#tweet-errorMsg").addClass("tweet-errorMsg").text("An error occurred loading your tweets! Call the Mentors!").slideDown(1000);
    console.log('error callback ', xhr);
  });
}

loadTweets();



// //Get the button:
// mybutton = document.getElementById("myBtn");

// // When the user scrolls down 20px from the top of the document, show the button
// window.onscroll = function() {scrollFunction()};

// function scrollFunction() {
//   if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
//     mybutton.style.display = "block";
//   } else {
//     mybutton.style.display = "none";
//   }
// }

// // When the user clicks on the button, scroll to the top of the document
// function topFunction() {
//   document.body.scrollTop = 0; // For Safari
//   document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
// }

