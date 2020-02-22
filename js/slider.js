const { Runtime, Inspector } = require("@observablehq/runtime");
const rpn = require("request-promise-native"); // RPN enables to generate requests to various APIs

const createObsCell = (
    slide,
    id,
    userName,
    notebookName,
    cellName,
    notebookVersion,
) => {
    // Create a DIV in the DOM
    let DOMSlide = document.getElementById(slide);
    var cell = document.createElement("DIV");
    cell.style.width = parseInt(window.innerWidth * 0.9) + "px";
    cell.id = "observablehq-" + id;
    DOMSlide.appendChild(cell);
    let version = "";
    if (notebookVersion) {
        version = "@" + notebookVersion;
    }

    // Create a path for the define script
    let modStorePath =
        userDataPath +
        "/flatDatasets/" +
        userName +
        "+" +
        notebookName +
        version +
        ".js?v=3";

    const adjustSize = () => {
        cell.style.height =
            window.innerHeight * 0.9 -
            DOMSlide.firstChild.firstChild.offsetHeight +
            "px"; // height is available
    };

    // Check if already accessed in the past and hence already available
    if (/* fs.existsSync(modStorePath) */ false) {
        require = require("esm")(module);
        var define = require(modStorePath);
        const inspect = Inspector.into("#observablehq-" + id);
        new Runtime().module(
            define.default,
            name => name === cellName && inspect(),
        );
        adjustSize();
        // If not, download it from the Observable API
    } else {
        let optionsRequest = {
            // Prepare options for the Request-Promise-Native Package
            uri:
                "https://api.observablehq.com/" +
                userName +
                "/" +
                notebookName +
                ".js?v=3", // URI to be accessed
            headers: { "User-Agent": "Request-Promise" }, // User agent to access is Request-promise
            json: false, // don't automatically parse as JSON
        };

        rpn(optionsRequest) // RPN stands for Request-promise-native (Request + Promise)
            .then(mod => {
                // Write the file in the app's user directory
                fs.writeFile(modStorePath, mod, "utf8", err => {
                    if (err) throw err;
                    require = require("esm")(module);
                    var define = require(modStorePath);
                    const inspect = Inspector.into("#observablehq-" + id);
                    new Runtime().module(
                        define.default,
                        name => name === cellName && inspect(),
                    );
                    adjustSize();
                });
            });
    }
};

let activeIndex = 0;

let currentIndex;

let currentMainPresStep = {};

var sectionList = document.querySelectorAll("section");

const addPadding = () => {
    for (let sect of sectionList) {
        sect.style.paddingTop = "0px"; //remove all previous padding;
        sect.style.paddingTop =
            parseInt((document.body.offsetHeight - sect.clientHeight) / 2) +
            "px";
    }
};

function scroller() {
    let container = d3.select("#mainSlideSections"),
        dispatch = d3.dispatch("active", "progress"),
        sections = null,
        sectionPositions = [],
        containerStart = 0;
    currentIndex = -1;

    function scroll(els) {
        sections = els;
        d3.select(window)
            .on("scroll.scroller", position)
            .on("resize.scroller", resize);

        resize();

        var timer = d3.timer(function() {
            position();
            timer.stop();
        });
    }

    function resize() {
        sectionPositions = [];
        var startPos;
        sections.each(function(d, i) {
            var top = this.getBoundingClientRect().top;
            if (i === 0) {
                startPos = top;
            }
            sectionPositions.push(top - startPos);
        });
        containerStart =
            d3
                .select("#mainSlideSections")
                .node()
                .getBoundingClientRect().top + window.pageYOffset;
    }

    function position() {
        var pos = window.pageYOffset - containerStart; //+document.body.offsetHeight*.3;
        var sectionIndex = d3.bisect(sectionPositions, pos);
        sectionIndex = Math.min(sections.size() - 1, sectionIndex) - 1;

        if (currentIndex !== sectionIndex) {
            dispatch.call("active", this, sectionIndex);
            currentIndex = sectionIndex;
            activeIndex = currentIndex;
            if (activeIndex > 1) {
                document.getElementById("prevSlideArr").innerHTML =
                    "arrow_upward";
            } else {
                document.getElementById("prevSlideArr").innerHTML = "&nbsp;";
            }
            if (activeIndex >= 0 && activeIndex <= sectionList.length - 2) {
                document.getElementById("nextSlideArr").innerHTML =
                    "arrow_downward";
            } else {
                document.getElementById("nextSlideArr").innerHTML =
                    "arrow_downward";
            }
        }

        var prevIndex = Math.max(sectionIndex - 1, 0);
        var prevTop = sectionPositions[prevIndex];
        var progress =
            (pos - prevTop) / (sectionPositions[sectionIndex] - prevTop);

        dispatch.call("progress", this, currentIndex, progress);
    }

    scroll.container = function(value) {
        if (arguments.length === 0) {
            return container;
        }
        container = value;
        return scroll;
    };

    scroll.on = function(action, callback) {
        dispatch.on(action, callback);
    };

    return scroll;
}

var previous = "";

const smoothScrollTo = target =>
    document.getElementById(target)
        ? document
              .getElementById(target)
              .scrollIntoView({ block: "start", behavior: "smooth" })
        : false; // Scroll smoothly to target

const display = () => {
    var scroll = scroller().container(d3.select("#mainSlideSections"));

    scroll(d3.selectAll(".slideStep"));

    scroll.on("active", index => {
        currentMainPresStep.step = sectionList[index].id;

        d3.selectAll(".slideStep").style("visibility", function(d, i) {
            if (i < index - 1 || i > index + 1) {
                return "hidden";
            } else {
                return "visible";
            }
        });

        d3.selectAll(".slideStep").style("opacity", function(d, i) {
            if (i < index - 1 || i > index + 1) {
                return 0;
            } else {
                switch (i) {
                    case index:
                        return 1;
                        break;

                    case index - 1:
                        return 0.3;
                        break;

                    case index + 1:
                        return 0.3;
                        break;
                    default:
                        return 1;
                        break;
                }
            }
        });
        d3.selectAll(".slideStep").style("filter", function(d, i) {
            switch (i) {
                case index:
                    return "blur(0px)";
                    break;

                case index - 1:
                    return "blur(4px)";
                    break;

                case index + 1:
                    return "blur(4px)";
                    break;

                default:
                    return "blur(0px)";
                    break;
            }
        });
        progress(index);
    });
};

const progress = index => {
    var sectionList = document.querySelectorAll("section");
    let progBasis = parseInt(
        (activeIndex / sectionList.length) * window.innerHeight,
    );
    let progNext = parseInt((index / sectionList.length) * window.innerHeight);

    var progProc = setInterval(incr, 15);

    function incr() {
        if (progBasis === progNext) {
            clearInterval(progProc);
        } else if (progBasis < progNext) {
            progBasis++;
            //document.getElementById("progressBar").style.height = progBasis + "px";
        } else if (progBasis > progNext) {
            progBasis--;
            //document.getElementById("progressBar").style.height = progBasis + "px";
        }
    }
};

const slideControl = event => {
    switch (event.isComposing || event.code) {
        case "ArrowDown":
        case "ArrowRight":
            event.preventDefault();
            smoothScrollTo(sectionList[currentIndex + 1].id);
            break;

        case "ArrowUp":
        case "ArrowLeft":
            event.preventDefault();
            if (sectionList[currentIndex - 1]) {
                smoothScrollTo(sectionList[currentIndex - 1].id);
            }
            break;
    }
};

const populateSlides = id => {
    let mainSliSect = document.getElementById("mainSlideSections");

    field.value = "loading presentation";

    currentMainPresStep.id = id;
    pandodb.slider.get(id).then(presentation => {
        let slides = presentation.content;
        let obsCellBuffer = {};

        if (mainPresEdit) {
            slideCreator();
            priorDate = presentation.date;
            mainPresContent = slides;
            document.getElementsByClassName("ql-editor")[0].innerHTML =
                mainPresContent[0].text;
            document.getElementById("slidetitle").value =
                mainPresContent[0].title;
            document.getElementById("presNamer").value = presentation.name;
        } else {
            slides.forEach(slide => {
                // Create action buttons for types
                for (
                    let i = 0;
                    i < (slide.text.match(/\[actionType:/g) || []).length;
                    i++
                ) {
                    slide.text = slide.text.replace(
                        "[actionType:",
                        '<a style="filter:invert(1);cursor:pointer;" onclick=selectOption(',
                    );
                    slide.text = slide.text.replace(
                        "/actionType]",
                        ')><i class="material-icons">flip</i></a>',
                    );
                }
                // Load observable cells
                for (
                    let i = 0;
                    i < (slide.text.match(/\[obsCell:/g) || []).length;
                    i++
                ) {
                    let beginIndex = slide.text.search(/\[obsCell:/g);
                    let endIndex = slide.text.search(/\/obsCell]/g);
                    let cellArgsArray = slide.text
                        .slice(beginIndex + 9, endIndex)
                        .split(",");
                    slide.text = slide.text.replace(
                        slide.text.slice(beginIndex, endIndex + 9),
                        "",
                    );
                    obsCellBuffer[slide.title] = [
                        slide.title,
                        cellArgsArray[0],
                        cellArgsArray[1],
                        cellArgsArray[2],
                        cellArgsArray[3],
                    ];
                }
                // create intra-slide references
                for (
                    let i = 0;
                    i < (slide.text.match(/\[refSlider:/g) || []).length;
                    i++
                ) {
                    slide.text = slide.text.replace(
                        "[refSlider:",
                        '<a style="filter:invert(1);cursor:pointer;" onclick=smoothScrollTo(',
                    );
                    slide.text = slide.text.replace(
                        "/refSlider]",
                        ')><i class="material-icons">picture_in_picture_alt</i></a>',
                    );
                }
            });

            slides.push({});

            let controlDiv = document.createElement("DIV");
            controlDiv.id = "slideControlDiv";
            let arrowUp = document.createElement("I");
            arrowUp.className += "material-icons controlSlide";
            arrowUp.id = "prevSlideArr";
            arrowUp.onclick = function() {
                smoothScrollTo(slides[activeIndex - 2].title);
            };
            arrowUp.addEventListener("mouseover", e => {
                if (arrowUp.innerHTML.length > 1) {
                    arrowUp.style = "background-color:#141414;color:white";
                }
            });
            arrowUp.addEventListener("mouseout", e => {
                if (arrowUp.innerHTML.length > 1) {
                    arrowUp.style =
                        "background-color:transparent;color:#141414";
                }
            });

            let arrowDown = document.createElement("I");
            arrowDown.className += "material-icons controlSlide";
            arrowDown.id = "nextSlideArr";
            arrowDown.onclick = function() {
                smoothScrollTo(slides[activeIndex].title);
            };
            arrowDown.addEventListener("mouseover", e => {
                if (arrowDown.innerHTML.length > 1) {
                    arrowDown.style = "background-color:#141414;color:white";
                }
            });
            arrowDown.addEventListener("mouseout", e => {
                if (arrowDown.innerHTML.length > 1) {
                    arrowDown.style =
                        "background-color:transparent;color:#141414";
                }
            });

            controlDiv.appendChild(arrowUp);
            controlDiv.appendChild(arrowDown);
            mainSliSect.appendChild(controlDiv);

            let section = document.createElement("SECTION");
            section.id = "startPres";
            section.className += "slideStep";
            section.innerHTML = "<div style='width:100%;'><div>";
            section.style.pointerEvents = "all";
            field.value = "start presentation";
            field.style.pointerEvents = "none";

            mainSliSect.appendChild(section);

            for (let i = 0; i < slides.length - 1; i++) {
                let section = document.createElement("SECTION");
                section.style.pointerEvents = "all";
                section.className += "slideStep";
                if (slides[i].text) {
                    //stop for last slide (empty)
                    section.id = slides[i].title;
                    if (
                        slides[i].text[slides[i].text.indexOf(">") + 1] === "<"
                    ) {
                        //hide box if text area now empty
                        section.innerHTML =
                            "<div style='display:inline-flex;align-items:center;'><div style='background-color:rgba(0, 10, 10, .8);border-radius:4px;padding:10px;margin-right:5%;color:white;display:none;width:" +
                            parseInt(window.innerWidth * 0.9) +
                            "px;'></div></div>";
                    } else {
                        section.innerHTML =
                            "<div style='display:inline-flex;align-items:center;'><div style='background-color:rgba(0, 10, 10, .8);border-radius:4px;padding:10px;margin-right:5%;color:white;display:inline-block;width:" +
                            parseInt(window.innerWidth * 0.9) +
                            "px;'>" +
                            slides[i].text +
                            "</div></div>";
                    }
                }
                mainSliSect.appendChild(section);
            }

            document
                .querySelectorAll("p")
                .forEach(p => (p.style.fontSize = "20px"));

            sectionList = document.querySelectorAll("section");

            for (let slide in obsCellBuffer) {
                let cellArg = obsCellBuffer[slide];
                createObsCell(
                    cellArg[0],
                    cellArg[1],
                    cellArg[2],
                    cellArg[3],
                    cellArg[4],
                );
            }

            mainSliSect.style.opacity = 0;

            setTimeout(() => {
                addPadding();
                display();
                mainSliSect.style.opacity = 1;
                document.addEventListener("keydown", slideControl);
                document
                    .getElementById("menu-icon")
                    .addEventListener("click", () => {
                        document.body.style.animation = "fadeout 0.1s";
                        setTimeout(() => {
                            document.body.remove();
                            remote.getCurrentWindow().reload();
                        }, 100);
                    });
            }, 1000);
        }
    });
};
