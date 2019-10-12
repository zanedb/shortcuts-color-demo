let socket = io();

let glob = {};
let colorQueue = [];

let transitionGoing = false;

$(document).ready(() => {
  // transitions background colors
  glob.processColorTransition = color => {
    if (document.body.style.backgroundColor == color) {
      return;
    }
    transitionGoing = true;
    document.body.style.backgroundColor = color;
  };

  // adds message
  glob.addMessage = color => {
    $(".messages").append('<p class="message">- ' + color + "</p>");
  };

  // set transition flag to false when a transition stops
  $("body").on("transitionend", function(e) {
    transitionGoing = false;
  });

  // every 50 milliseconds, if the transition is done, process the color queue
  setInterval(() => {
    if (!transitionGoing && colorQueue[0] != null) {
      let latestColor = colorQueue[0];
      colorQueue.shift();

      glob.processColorTransition(latestColor);
    }
  }, 50);

  // every 100 milliseconds, clear the messages
  setInterval(() => {
    let children = $(".messages")
      .children()
      .toArray();
    let numberOfChildren = children.length;

    // if there are messages
    if (numberOfChildren > 0) {
      children.forEach(child => {
        let jqChild = $(child);
        // do nothing if it has been processed
        if (
          !jqChild
            .attr("class")
            .split(/\s+/)
            .includes("processed")
        ) {
          // make it go away
          setTimeout(function() {
            jqChild.addClass("animated fadeOutLeft processed");
          }, 1500);

          // make it go away permanently
          setTimeout(function() {
            jqChild.remove();
          }, 2000);
        }
      });
    }
  }, 100);

  glob.processText = color => {
    colorQueue.push(color);
    glob.addMessage(color);
  };

  socket.on("message", message => {
    glob.processText(message.color);
  });
});
