// scroller
let activeIndex = 0;

var sectionList;

const addPadding = () => {
  for (let sect of sectionList) {
    sect.style.paddingTop =
      parseInt((document.body.offsetHeight - sect.clientHeight) / 2) + "px";
  }
};

function scroller() {
  let container = d3.select("body"),
    dispatch = d3.dispatch("active", "progress"),
    sections = null,
    sectionPositions = [],
    currentIndex = -1,
    containerStart = 0;

  function scroll(els) {
    sections = els;
    d3.select(window)
      .on("scroll.scroller", position)
      .on("resize.scroller", resize);

    resize();

    var timer = d3.timer(function () {
      position();
      timer.stop();
    });
  }

  function resize() {
    sectionPositions = [];
    var startPos;
    sections.each(function (d, i) {
      var top = this.getBoundingClientRect().top;
      if (i === 0) {
        startPos = top;
      }
      sectionPositions.push(
        top -
          startPos -
          (window.innerHeight - this.getBoundingClientRect().height) / 2
      );
    });
    containerStart =
      container.node().getBoundingClientRect().top + window.pageYOffset;
  }

  function position() {
    var pos = window.pageYOffset - containerStart;
    var sectionIndex = d3.bisect(sectionPositions, pos);
    sectionIndex = Math.min(sections.size() - 1, sectionIndex) - 1;

    if (currentIndex !== sectionIndex) {
      dispatch.call("active", this, sectionIndex);
      currentIndex = sectionIndex;
      activeIndex = currentIndex;
    }

    var prevIndex = Math.max(sectionIndex - 1, 0);
    var prevTop = sectionPositions[prevIndex];
    var progress = (pos - prevTop) / (sectionPositions[sectionIndex] - prevTop);

    dispatch.call("progress", this, currentIndex, progress);
  }

  scroll.container = function (value) {
    if (arguments.length === 0) {
      return container;
    }
    container = value;
    return scroll;
  };

  scroll.on = function (action, callback) {
    dispatch.on(action, callback);
  };

  return scroll;
}

var previous = "";

const smoothScrollTo = (target, hide) => {
  previous = sectionList[activeIndex].id; // Store current section ID
  document.getElementById("backarrow").style.display = "inline-block"; // Display "previous" arrow button
  document
    .getElementById(target)
    .scrollIntoView({ block: "start", behavior: "smooth" }); // Scroll smoothly to target
  if (hide === true) {
    document.getElementById("backarrow").style.display = "none";
  } // If order comes from the "previous" arrow button, hide this button
};

const display = () => {
  var scroll = scroller().container(d3.select("#slideSections"));

  scroll(d3.selectAll(".step"));

  scroll.on("active", function (index) {
    d3.selectAll(".step").style("opacity", function (d, i) {
      return i === index ? 1 : 0.1;
    });
    progress(index);
  });
};

const progress = (index) => {
  var sectionList = document.querySelectorAll("section");
  let progBasis = parseInt(
    (activeIndex / sectionList.length) * window.innerHeight
  );
  let progNext = parseInt((index / sectionList.length) * window.innerHeight);

  var progProc = setInterval(incr, 15);

  function incr() {
    if (progBasis === progNext) {
      clearInterval(progProc);
    } else if (progBasis < progNext) {
      progBasis++;
      document.getElementById("progressBar").style.height = progBasis + "px";
    } else if (progBasis > progNext) {
      progBasis--;
      document.getElementById("progressBar").style.height = progBasis + "px";
    }
  }
};
